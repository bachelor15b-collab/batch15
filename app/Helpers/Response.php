<?php
/**
 * HTTP response helper.
 */
namespace App\Helpers;

class Response
{
    /**
     * Send a JSON response.
     */
    public static function json(mixed $data, int $statusCode = 200, array $headers = []): never
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        foreach ($headers as $key => $value) {
            header("{$key}: {$value}");
        }

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Send a success response.
     */
    public static function success(mixed $data = null, string $message = 'Success', int $statusCode = 200): never
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * Send an error response.
     */
    public static function error(string $message = 'Error', int $statusCode = 400, mixed $errors = null): never
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $statusCode);
    }

    /**
     * Send a 401 Unauthorized response.
     */
    public static function unauthorized(string $message = 'Unauthorized'): never
    {
        self::error($message, 401);
    }

    /**
     * Send a 403 Forbidden response.
     */
    public static function forbidden(string $message = 'Forbidden'): never
    {
        self::error($message, 403);
    }

    /**
     * Send a 404 Not Found response.
     */
    public static function notFound(string $message = 'Resource not found'): never
    {
        self::error($message, 404);
    }

    /**
     * Send a 422 Validation Error response.
     */
    public static function validationError(string $message = 'Validation failed', array $errors = []): never
    {
        self::error($message, 422, $errors);
    }

    /**
     * Send a 429 Too Many Requests response.
     */
    public static function serverError(string $message = 'Internal server error'): never
    {
        self::error($message, 500);
    }

    public static function tooManyRequests(string $message = 'Too many requests'): never
    {
        self::error($message, 429);
    }

    /**
     * Send a plain text response.
     */
    public static function text(string $content, int $statusCode = 200): never
    {
        http_response_code($statusCode);
        header('Content-Type: text/plain; charset=utf-8');
        echo $content;
        exit;
    }
}
