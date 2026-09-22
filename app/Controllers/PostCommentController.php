<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\PostComment;
use App\Models\PostCommentLike;
use App\Models\Post;

class PostCommentController
{
    public static function index(int $postId): never
    {
        $post = Post::findById($postId);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        $authUser = AuthMiddleware::optional();
        $authUserId = $authUser ? $authUser->id : null;

        $comments = PostComment::findByPost($postId);

        // Build threaded structure: top-level comments with nested replies
        $tree = [];
        $map  = [];
        foreach ($comments as $c) {
            $arr = $c->toArray($authUserId);
            $arr['replies'] = [];
            $map[$arr['id']] = $arr;
        }
        foreach ($map as $id => $arr) {
            if ($arr['parent_id'] && isset($map[$arr['parent_id']])) {
                $map[$arr['parent_id']]['replies'][] = &$map[$id];
            } else {
                $tree[] = &$map[$id];
            }
        }

        Response::success(['comments' => $tree, 'total' => count($comments)]);
    }

    public static function create(int $postId): never
    {
        $authUser = AuthMiddleware::authenticate();

        $post = Post::findById($postId);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['content']) || trim($data['content']) === '') {
            Response::validationError('Comment content is required.', ['content' => ['Content cannot be empty.']]);
        }

        $parentId = isset($data['parent_id']) ? (int) $data['parent_id'] : null;
        if ($parentId) {
            $parent = PostComment::findById($parentId);
            if (!$parent || $parent->post_id !== $postId) {
                Response::validationError('Invalid parent comment.', ['parent_id' => ['Parent comment not found.']]);
            }
        }

        $comment = PostComment::create([
            'post_id'   => $postId,
            'user_id'   => $authUser->id,
            'parent_id' => $parentId,
            'content'   => trim($data['content']),
        ]);

        // Update comment count on post
        $db = \App\Config\Database::getInstance();
        $db->prepare('UPDATE content_posts SET comments_count = (SELECT COUNT(*) FROM post_comments WHERE post_id = ?) WHERE id = ?')
           ->execute([$postId, $postId]);

        \App\Models\ActivityLog::log('comment.create', $authUser->id, 'post', $postId);

        Response::success(['comment' => $comment->toArray()], 'Comment added.', 201);
    }

    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $comment = PostComment::findById($id);
        if (!$comment) {
            Response::notFound('Comment not found.');
        }

        if ($comment->user_id !== $authUser->id && $authUser->role_slug !== 'super_admin') {
            Response::forbidden();
        }

        $postId = $comment->post_id;
        $comment->delete();

        // Update comment count
        $db = \App\Config\Database::getInstance();
        $db->prepare('UPDATE content_posts SET comments_count = (SELECT COUNT(*) FROM post_comments WHERE post_id = ?) WHERE id = ?')
           ->execute([$postId, $postId]);

        \App\Models\ActivityLog::log('comment.delete', $authUser->id, 'post', $postId);

        Response::success(null, 'Comment deleted.');
    }

    public static function toggleLike(int $commentId): never
    {
        $authUser = AuthMiddleware::authenticate();

        $comment = PostComment::findById($commentId);
        if (!$comment) {
            Response::notFound('Comment not found.');
        }

        $result = PostCommentLike::toggle($commentId, $authUser->id);
        $count = PostCommentLike::countByComment($commentId);

        Response::success([
            'liked' => $result['liked'],
            'count' => $count,
        ], $result['liked'] ? 'Comment liked.' : 'Like removed.');
    }
}
