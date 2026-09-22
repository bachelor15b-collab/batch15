<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Project;
use App\Models\ActivityLog;

class ProjectController
{
    private const MANAGE_ROLES = ['super_admin', 'admin_general', 'admin_educational'];

    /**
     * GET /projects — list student projects
     * Public listing with status/search filters and pagination.
     */
    public static function index(): never
    {
        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);
        $status  = $_GET['status'] ?? '';
        $search  = $_GET['search'] ?? '';

        $filters = [];
        if (in_array($status, ['planning', 'in_progress', 'completed'], true)) {
            $filters['status'] = $status;
        }
        if ($search) $filters['search'] = $search;

        $items = Project::findAll($filters, $page, $perPage);
        $total = Project::countAll($filters);

        Response::success([
            'items'       => array_map(fn($i) => $i->toArray(), $items),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /projects/{id} — show a single project
     */
    public static function show(int $id): never
    {
        $item = Project::findById($id);
        if (!$item) {
            Response::notFound('Project not found.');
        }

        Response::success(['item' => $item->toArray()]);
    }

    /**
     * POST /projects — create a project (any logged-in user)
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['title'])) {
            Response::validationError('Title is required.', ['title' => ['Required.']]);
        }

        $status = $data['status'] ?? 'planning';
        if (!in_array($status, ['planning', 'in_progress', 'completed'], true)) {
            $status = 'planning';
        }

        $tech = $data['tech'] ?? [];
        $item = new Project([
            'title'       => trim((string)$data['title']),
            'description' => $data['description'] ?? null,
            'tech'        => $tech,
            'github_url'  => $data['github_url'] ?? null,
            'demo_url'    => $data['demo_url'] ?? null,
            'status'      => $status,
            'author_id'   => $authUser->id,
            'author_name' => $data['author_name'] ?? $authUser->full_name ?? $authUser->username,
        ]);

        $item->create();

        ActivityLog::log('project.create', $authUser->id, 'project', $item->id);

        $fresh = Project::findById($item->id);
        Response::success(['item' => $fresh->toArray()], 'Project created.', 201);
    }

    /**
     * PUT /projects/{id} — update a project (owner or admin)
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $item = Project::findById($id);
        if (!$item) {
            Response::notFound('Project not found.');
        }

        $isOwner = $item->author_id !== null && (int)$item->author_id === (int)$authUser->id;
        $isAdmin = RoleMiddleware::hasAnyRole($authUser, self::MANAGE_ROLES);
        if (!$isOwner && !$isAdmin) {
            Response::forbidden('You can only edit your own projects.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $allowed = ['title', 'description', 'tech', 'github_url', 'demo_url', 'status'];
        $updateData = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($updateData['status'])
            && !in_array($updateData['status'], ['planning', 'in_progress', 'completed'], true)) {
            Response::validationError('Project update failed.', ['status' => ['Invalid status.']]);
        }

        if (empty($updateData)) {
            Response::success(['item' => $item->toArray()], 'Nothing to update.');
        }

        $item->update($updateData);

        ActivityLog::log('project.update', $authUser->id, 'project', $id);

        $fresh = Project::findById($id);
        Response::success(['item' => $fresh->toArray()], 'Project updated.');
    }

    /**
     * DELETE /projects/{id} — delete a project (owner or admin)
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $item = Project::findById($id);
        if (!$item) {
            Response::notFound('Project not found.');
        }

        $isOwner = $item->author_id !== null && (int)$item->author_id === (int)$authUser->id;
        $isAdmin = RoleMiddleware::hasAnyRole($authUser, self::MANAGE_ROLES);
        if (!$isOwner && !$isAdmin) {
            Response::forbidden('You can only delete your own projects.');
        }

        $item->delete();

        ActivityLog::log('project.delete', $authUser->id, 'project', $id);

        Response::success(null, 'Project deleted.');
    }
}