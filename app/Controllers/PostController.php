<?php
/**
 * Post Controller (Unified Content Engine)
 *
 * GET    /posts
 * POST   /posts
 * GET    /posts/{slug}
 * PUT    /posts/{id}
 * DELETE /posts/{id}
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\ActivityLog;

class PostController
{
    /**
     * GET /posts
     */
    public static function index(): never
    {
        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);
        $type     = $_GET['type'] ?? '';
        $status   = $_GET['status'] ?? '';
        $search   = $_GET['search'] ?? '';

        $filters = [];
        if ($type) $filters['post_type'] = $type;
        if ($status) $filters['status'] = $status;
        if ($search) $filters['search'] = $search;

        $authUser = AuthMiddleware::optional();
        if (!$authUser) {
            // Public: only published posts
            $filters['status'] = 'published';
        }

        $posts = Post::findAll($filters, $page, $perPage);
        $total = Post::countAll($filters);

        $data = array_map(fn(Post $p) => $p->toArray(), $posts);

        $response = [
            'posts'       => $data,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ];

        Response::success($response);
    }

    /**
     * POST /posts
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('title')->min('title', 3)->max('title', 255);
        $v->required('post_type')->in('post_type', ['blog', 'announcement', 'resource', 'challenge', 'project', 'gallery', 'page']);

        if (!$v->passes()) {
            Response::validationError('Post creation failed.', $v->errors());
        }

        $data['author_id'] = $authUser->id;
        $data['slug']      = $data['slug'] ?? Post::generateSlug($data['title']);
        $data['status']    = $data['status'] ?? 'draft';

        $post = Post::create($data);

        ActivityLog::log('post.create', $authUser->id, 'post', $post->id, [
            'type' => $data['post_type'],
            'slug' => $post->slug,
        ]);

        Response::success(['post' => $post->toArray()], 'Post created.', 201);
    }

    /**
     * GET /posts/{slug}
     */
    public static function show(string $slug): never
    {
        $post = Post::findBySlug($slug);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        $authUser = AuthMiddleware::optional();

        // Only show published to public
        if ($post->status !== 'published' && !$authUser) {
            Response::notFound('Post not found.');
        }

        $data = $post->toArray();
        $author = $post->author();
        $data['author'] = $author ? $author->toArray() : null;
        $data['is_liked'] = $authUser ? PostLike::isLiked($post->id, $authUser->id) : false;

        Response::success(['post' => $data]);
    }

    /**
     * PUT /posts/{id}
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $post = Post::findById($id);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        // Only author or super admin can update
        if ($post->author_id !== $authUser->id && $authUser->role_slug !== 'super_admin') {
            Response::forbidden();
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $allowed = ['title', 'excerpt', 'content', 'status', 'meta'];
        $updateData = [];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($data['slug'])) {
            $updateData['slug'] = $data['slug'];
        }

        if (empty($updateData)) {
            Response::success(['post' => $post->toArray()], 'Nothing to update.');
        }

        $post->update($updateData);

        ActivityLog::log('post.update', $authUser->id, 'post', $id);

        $fresh = Post::findById($id);
        Response::success(['post' => $fresh->toArray()], 'Post updated.');
    }

    /**
     * DELETE /posts/{id}
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $post = Post::findById($id);
        if (!$post) {
            Response::notFound('Post not found.');
        }

        if ($post->author_id !== $authUser->id && $authUser->role_slug !== 'super_admin') {
            Response::forbidden();
        }

        $post->delete();
        ActivityLog::log('post.delete', $authUser->id, 'post', $id);

        Response::success(null, 'Post deleted.');
    }
}
