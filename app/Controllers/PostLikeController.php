<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\PostLike;
use App\Models\Post;

class PostLikeController
{
    public static function toggle(int $postId): never
    {
        $authUser = AuthMiddleware::authenticate();

        $post = Post::findById($postId);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        $result = PostLike::toggle($postId, $authUser->id);

        $count = PostLike::countByPost($postId);

        \App\Models\ActivityLog::log(
            $result['liked'] ? 'post.like' : 'post.unlike',
            $authUser->id, 'post', $postId
        );

        Response::success([
            'liked' => $result['liked'],
            'count' => $count,
        ], $result['liked'] ? 'Post liked.' : 'Like removed.');
    }
}
