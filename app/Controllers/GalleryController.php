<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\GalleryItem;
use App\Models\ActivityLog;

class GalleryController
{
    /**
     * GET /gallery — list gallery items
     * Public: only published. Admin: all with status filter.
     */
    public static function index(): never
    {
        $authUser = AuthMiddleware::optional();
        $isAdmin = $authUser && RoleMiddleware::hasAnyRole($authUser, [
            'super_admin', 'admin_general', 'admin_monitor', 'admin_educational',
            'admin_financial', 'admin_sports', 'soc', 'operations_manager',
        ]);

        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 50);
        $category = $_GET['category'] ?? '';

        $filters = [];
        if (!$isAdmin || !isset($_GET['status'])) {
            $filters['status'] = 'published';
        } elseif ($_GET['status']) {
            $filters['status'] = $_GET['status'];
        }
        if ($category) $filters['category'] = $category;

        $items = GalleryItem::findAll($filters, $page, $perPage);
        $total = GalleryItem::countAll($filters);

        Response::success([
            'items'       => array_map(fn($i) => $i->toArray(), $items),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /gallery/{id} — show a single gallery item
     */
    public static function show(int $id): never
    {
        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::notFound('Gallery item not found.');
        }

        $authUser = AuthMiddleware::optional();
        $isAdmin = $authUser && RoleMiddleware::hasAnyRole($authUser, [
            'super_admin', 'admin_general', 'admin_monitor',
        ]);

        if ($item->status !== 'published' && !$isAdmin) {
            Response::forbidden('Gallery item not visible.');
        }

        Response::success(['item' => $item->toArray()]);
    }

    /**
     * POST /gallery — create a gallery item (admin)
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['title'])) {
            Response::validationError('Title is required.', ['title' => ['Required.']]);
        }

        $item = new GalleryItem([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'image_url'   => $data['image_url'] ?? null,
            'video_url'   => $data['video_url'] ?? null,
            'category'    => $data['category'] ?? 'events',
            'author_id'   => $authUser->id,
            'author_name' => $data['author_name'] ?? $authUser->full_name ?? $authUser->username,
            'status'      => $data['status'] ?? 'published',
        ]);

        $item->create();

        ActivityLog::log('gallery.create', $authUser->id, 'gallery', $item->id);

        $fresh = GalleryItem::findById($item->id);
        Response::success(['item' => $fresh->toArray()], 'Gallery item created.');
    }

    /**
     * POST /gallery/{id}/image — upload gallery image (admin)
     */
    public static function uploadImage(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::notFound('Gallery item not found.');
        }

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            Response::validationError('Upload failed.', ['image' => ['No file uploaded or upload error.']]);
        }

        $file = $_FILES['image'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 5 * 1024 * 1024;

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedTypes, true)) {
            Response::validationError('Invalid file type.', ['image' => ['Only JPG, PNG, GIF, and WebP images are allowed.']]);
        }

        if ($file['size'] > $maxSize) {
            Response::validationError('File too large.', ['image' => ['Maximum file size is 5MB.']]);
        }

        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp',
            default      => 'jpg',
        };
        $filename = 'gallery_' . $id . '_' . time() . '.' . $ext;
        $uploadDir = __DIR__ . '/../../uploads/gallery/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $destPath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::serverError('Failed to save file.');
        }

        $webPath = \App\Config\App::baseUrl() . '/uploads/gallery/' . $filename;

        // Delete old image
        $baseUrl = \App\Config\App::baseUrl();
        $prefix = $baseUrl . '/uploads/gallery/';
        if ($item->image_url && str_starts_with($item->image_url, $prefix)) {
            $oldPath = __DIR__ . '/../../' . ltrim($item->image_url, '/');
            if (file_exists($oldPath)) unlink($oldPath);
        }

        $item->update(['image_url' => $webPath]);

        ActivityLog::log('gallery.image_upload', $authUser->id, 'gallery', $id);

        $fresh = GalleryItem::findById($id);
        Response::success(['item' => $fresh->toArray()], 'Image uploaded.');
    }

    /**
     * PUT /gallery/{id} — update a gallery item (admin)
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::notFound('Gallery item not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $allowed = ['title', 'description', 'image_url', 'video_url', 'category', 'author_name', 'status'];
        $updateData = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        if (empty($updateData)) {
            Response::success(['item' => $item->toArray()], 'Nothing to update.');
        }

        $item->update($updateData);

        ActivityLog::log('gallery.update', $authUser->id, 'gallery', $id);

        $fresh = GalleryItem::findById($id);
        Response::success(['item' => $fresh->toArray()], 'Gallery item updated.');
    }

    /**
     * DELETE /gallery/{id} — delete a gallery item (admin)
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $item = GalleryItem::findById($id);
        if (!$item) {
            Response::notFound('Gallery item not found.');
        }

        // Delete associated image
        $baseUrl = \App\Config\App::baseUrl();
        $prefix = $baseUrl . '/uploads/gallery/';
        if ($item->image_url && str_starts_with($item->image_url, $prefix)) {
            $oldPath = __DIR__ . '/../../' . ltrim($item->image_url, '/');
            if (file_exists($oldPath)) unlink($oldPath);
        }

        $item->delete();

        ActivityLog::log('gallery.delete', $authUser->id, 'gallery', $id);

        Response::success(null, 'Gallery item deleted.');
    }
}
