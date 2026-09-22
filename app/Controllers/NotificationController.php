<?php
/**
 * Notification Controller
 *
 * GET  /notifications
 * PUT  /notifications/{id}/read
 * PUT  /notifications/read-all
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\Notification;

class NotificationController
{
    /**
     * GET /notifications
     */
    public static function index(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);

        $notifications = Notification::findForUser($authUser->id, $page, $perPage);
        $unread        = Notification::unreadCount($authUser->id);

        Response::success([
            'notifications' => $notifications,
            'unread'        => $unread,
            'page'          => $page,
            'per_page'      => $perPage,
        ]);
    }

    /**
     * GET /notifications/unread-count
     */
    public static function unreadCount(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $unread   = Notification::unreadCount($authUser->id);

        Response::success(['count' => $unread]);
    }

    /**
     * PUT /notifications/{id}/read
     */
    public static function markRead(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        Notification::markAsRead($id, $authUser->id);
        Response::success(null, 'Notification marked as read.');
    }

    /**
     * PUT /notifications/read-all
     */
    public static function markAllRead(): never
    {
        $authUser = AuthMiddleware::authenticate();

        Notification::markAllAsRead($authUser->id);
        Response::success(null, 'All notifications marked as read.');
    }
}
