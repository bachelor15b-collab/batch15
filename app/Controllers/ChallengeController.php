<?php
/**
 * Challenge Controller
 *
 * GET    /challenges
 * POST   /challenges
 * GET    /challenges/{id}
 * PUT    /challenges/{id}
 * DELETE /challenges/{id}
 * POST   /challenges/{id}/submit
 * POST   /challenges/{id}/grade
 * GET    /challenges/{id}/submissions
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Challenge;
use App\Models\Submission;
use App\Models\Notification;
use App\Models\ActivityLog;

class ChallengeController
{
    /**
     * GET /challenges
     */
    public static function index(): never
    {
        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);
        $status   = $_GET['status'] ?? '';
        $difficulty = $_GET['difficulty'] ?? '';

        // Public: only open challenges
        $authUser = AuthMiddleware::optional();
        $filters = [];
        if (!$authUser) {
            $filters['status'] = 'open';
        } else {
            if ($status) $filters['status'] = $status;
        }
        if ($difficulty) $filters['difficulty'] = $difficulty;

        $challenges = Challenge::findAll($filters, $page, $perPage);
        $data = array_map(fn(Challenge $c) => $c->toArray(), $challenges);

        Response::success(['challenges' => $data, 'page' => $page, 'per_page' => $perPage]);
    }

    /**
     * POST /challenges
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'admin_general', 'super_admin'], $authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('title')->min('title', 3)->max('title', 255);
        $v->required('description');

        if (!$v->passes()) {
            Response::validationError('Challenge creation failed.', $v->errors());
        }

        $data['author_id'] = $authUser->id;
        $challenge = Challenge::create($data);

        ActivityLog::log('challenge.create', $authUser->id, 'challenge', $challenge->id);

        Response::success(['challenge' => $challenge->toArray()], 'Challenge created.', 201);
    }

    /**
     * GET /challenges/{id}
     */
    public static function show(int $id): never
    {
        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        $data = $challenge->toArray();
        $data['author'] = $challenge->author()?->toArray();

        // Count submissions
        $submissions = $challenge->submissions();
        $data['submission_count'] = count($submissions);

        Response::success(['challenge' => $data]);
    }

    /**
     * PUT /challenges/{id}
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        $allowed = ['super_admin', 'admin_educational', 'admin_general'];
        if ($challenge->author_id !== $authUser->id && !in_array($authUser->role_slug, $allowed)) {
            Response::forbidden();
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $challenge->update($data);

        ActivityLog::log('challenge.update', $authUser->id, 'challenge', $id);

        Response::success(['challenge' => Challenge::findById($id)->toArray()], 'Challenge updated.');
    }

    /**
     * DELETE /challenges/{id}
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        $allowed = ['super_admin', 'admin_educational', 'admin_general'];
        if ($challenge->author_id !== $authUser->id && !in_array($authUser->role_slug, $allowed)) {
            Response::forbidden();
        }

        $challenge->delete();
        ActivityLog::log('challenge.delete', $authUser->id, 'challenge', $id);

        Response::success(null, 'Challenge deleted.');
    }

    /**
     * POST /challenges/{id}/submit
     */
    public static function submit(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        if ($challenge->status !== 'open') {
            Response::error('This challenge is not open for submissions.', 400);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('code');

        if (!$v->passes()) {
            Response::validationError('Submission failed.', $v->errors());
        }

        $submission = Submission::create([
            'challenge_id' => $id,
            'user_id'      => $authUser->id,
            'code'         => $data['code'],
            'language'     => $data['language'] ?? 'php',
        ]);

        ActivityLog::log('challenge.submit', $authUser->id, 'submission', $submission->id);

        Response::success(['submission' => $submission], 'Solution submitted.', 201);
    }

    /**
     * POST /challenges/{id}/grade
     */
    public static function grade(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'admin_general', 'super_admin'], $authUser);

        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('submission_id')->integer('submission_id');
        $v->required('score')->numeric('score')->custom('score', fn($v) => $v >= 0 && $v <= 100, 'Score must be between 0 and 100.');

        if (!$v->passes()) {
            Response::validationError('Grading failed.', $v->errors());
        }

        $submission = Submission::findById((int) $data['submission_id']);
        if (!$submission || $submission->challenge_id !== $id) {
            Response::notFound('Submission not found for this challenge.');
        }

        $submission->grade((float) $data['score'], $data['feedback'] ?? null);

        // Notify student
        Notification::create(
            $submission->user_id,
            'Challenge Graded',
            "Your solution for '{$challenge->title}' has been graded: {$data['score']}%.",
            'challenge',
            'challenge',
            $id
        );

        ActivityLog::log('challenge.grade', $authUser->id, 'submission', $submission->id, [
            'score' => $data['score'],
        ]);

        Response::success(['submission' => Submission::findById($submission->id)], 'Submission graded.');
    }

    /**
     * GET /challenges/{id}/submissions
     */
    public static function submissions(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $challenge = Challenge::findById($id);
        if (!$challenge) {
            Response::notFound('Challenge not found.');
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);

        $submissions = $challenge->submissions($page, $perPage);

        Response::success([
            'submissions' => $submissions,
            'challenge'   => $challenge->toArray(),
        ]);
    }
}
