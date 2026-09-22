<?php
/**
 * Message Controller
 *
 * GET    /messages/inbox
 * GET    /messages/sent
 * POST   /messages
 * GET    /messages/{id}
 * PUT    /messages/{id}/read
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Models\Message;
use App\Models\Notification;
use App\Models\ActivityLog;

class MessageController
{
    /**
     * GET /messages/inbox
     */
    public static function inbox(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);

        $messages = Message::inbox($authUser->id, $page, $perPage);
        $unread   = Message::unreadCount($authUser->id);

        Response::success([
            'messages' => $messages,
            'unread'   => $unread,
            'page'     => $page,
            'per_page' => $perPage,
        ]);
    }

    /**
     * GET /messages/sent
     */
    public static function sent(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);

        $messages = Message::sent($authUser->id, $page, $perPage);

        Response::success([
            'messages' => $messages,
            'page'     => $page,
            'per_page' => $perPage,
        ]);
    }

    /**
     * POST /messages
     */
    public static function send(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('receiver_id')->integer('receiver_id');
        $v->required('message')->min('message', 1);

        if (!$v->passes()) {
            Response::validationError('Message sending failed.', $v->errors());
        }

        // Verify receiver exists
        $receiver = \App\Models\User::findById((int) $data['receiver_id']);
        if (!$receiver) {
            Response::validationError('Recipient not found.', ['receiver_id' => ['User does not exist.']]);
        }

        $message = Message::create([
            'sender_id'   => $authUser->id,
            'receiver_id' => (int) $data['receiver_id'],
            'subject'     => $data['subject'] ?? null,
            'message'     => $data['message'],
            'attachment'  => $data['attachment'] ?? null,
            'parent_id'   => $data['parent_id'] ?? null,
        ]);

        // Notify receiver
        $senderName = $authUser->full_name ?? $authUser->username;
        Notification::create(
            $receiver->id,
            'New Message',
            "You have a new message from {$senderName}.",
            'message',
            'message',
            $message->id
        );

        ActivityLog::log('message.send', $authUser->id, 'message', $message->id);

        Response::success(['message' => $message], 'Message sent.', 201);
    }

    /**
     * GET /messages/{id}
     */
    public static function show(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $message = Message::findById($id);
        if (!$message) {
            Response::notFound('Message not found.');
        }

        // Only sender or receiver can view
        if ($message->sender_id !== $authUser->id && $message->receiver_id !== $authUser->id) {
            Response::forbidden();
        }

        // Mark as read if receiver is viewing
        if ($message->receiver_id === $authUser->id && !$message->read_status) {
            $message->markAsRead();
        }

        $data = [
            'id'           => $message->id,
            'sender_id'    => $message->sender_id,
            'receiver_id'  => $message->receiver_id,
            'subject'      => $message->subject,
            'message'      => $message->message,
            'attachment'   => $message->attachment,
            'read_status'  => $message->read_status,
            'created_at'   => $message->created_at,
            'sender'       => $message->sender()?->toArray(),
            'receiver'     => $message->receiver()?->toArray(),
        ];

        Response::success(['message' => $data]);
    }

    /**
     * PUT /messages/{id}/read
     */
    public static function markRead(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $message = Message::findById($id);
        if (!$message) {
            Response::notFound('Message not found.');
        }

        if ($message->receiver_id !== $authUser->id) {
            Response::forbidden();
        }

        $message->markAsRead();

        Response::success(null, 'Message marked as read.');
    }

    /**
     * GET /messages/conversations
     */
    public static function conversations(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $conversations = Message::conversations($authUser->id);
        $unreadTotal   = Message::unreadCount($authUser->id);

        Response::success([
            'conversations' => $conversations,
            'unread_total'  => $unreadTotal,
        ]);
    }

    /**
     * GET /messages/conversation/{userId}
     */
    public static function conversation(int $userId): never
    {
        $authUser = AuthMiddleware::authenticate();

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);

        $partner = \App\Models\User::findById($userId);
        if (!$partner) {
            Response::notFound('User not found.');
        }

        $messages = Message::conversationMessages($authUser->id, $userId, $page, $perPage);

        Message::markConversationAsRead($authUser->id, $userId);

        Response::success([
            'messages' => $messages,
            'partner'  => [
                'id'         => $partner->id,
                'full_name'  => $partner->full_name,
                'username'   => $partner->username,
                'avatar_url' => $partner->avatar_url,
            ],
            'page'     => $page,
            'per_page' => $perPage,
        ]);
    }

    /**
     * GET /messages/search?q=query
     */
    public static function search(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $query = trim($_GET['q'] ?? '');
        if ($query === '') {
            Response::validationError('Search query is required.', ['q' => ['Search query cannot be empty.']]);
        }

        $results = Message::search($authUser->id, $query);

        Response::success(['results' => $results]);
    }

    /**
     * GET /messages/unread-count
     */
    public static function unreadCount(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $count = Message::unreadCount($authUser->id);

        Response::success(['count' => $count]);
    }
}
