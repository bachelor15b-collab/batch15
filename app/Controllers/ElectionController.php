<?php
/**
 * Election Controller
 *
 * GET    /elections
 * POST   /elections
 * GET    /elections/{id}
 * PUT    /elections/{id}
 * DELETE /elections/{id}
 * POST   /elections/{id}/vote
 * GET    /elections/{id}/results
 * GET    /elections/{id}/candidates
 * POST   /elections/{id}/candidates
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use App\Models\Notification;
use App\Models\ActivityLog;
use App\Models\Alert;

class ElectionController
{
    /**
     * GET /elections
     */
    public static function index(): never
    {
        $page   = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $status = $_GET['status'] ?? '';

        $elections = Election::findAll($status, $page, $perPage);
        $data = array_map(fn(Election $e) => [
            'id'          => $e->id,
            'title'       => $e->title,
            'description' => $e->description,
            'status'      => $e->status,
            'start_date'  => $e->start_date,
            'end_date'    => $e->end_date,
            'created_at'  => $e->created_at,
            'total_votes' => Vote::totalVotes($e->id),
        ], $elections);

        Response::success(['elections' => $data, 'page' => $page, 'per_page' => $perPage]);
    }

    /**
     * POST /elections
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['admin_general', 'super_admin'], $authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('title')->min('title', 3);
        $v->required('start_date')->date('start_date');
        $v->required('end_date')->date('end_date');

        if (!$v->passes()) {
            Response::validationError('Election creation failed.', $v->errors());
        }

        $data['created_by'] = $authUser->id;
        $election = Election::create($data);

        ActivityLog::log('election.create', $authUser->id, 'election', $election->id);

        Response::success(['election' => $election], 'Election created.', 201);
    }

    /**
     * GET /elections/{id}
     */
    public static function show(int $id): never
    {
        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        $authUser = AuthMiddleware::optional();

        $candidates = array_map(function($c) {
            $c['vote_count'] = Vote::countByCandidate((int) $c['id']);
            return $c;
        }, $election->candidates());

        $data = [
            'id'          => $election->id,
            'title'       => $election->title,
            'description' => $election->description,
            'status'      => $election->status,
            'start_date'  => $election->start_date,
            'end_date'    => $election->end_date,
            'created_at'  => $election->created_at,
            'total_votes' => Vote::totalVotes($election->id),
            'candidates'  => $candidates,
        ];

        if ($authUser) {
            $data['has_voted'] = $election->hasVoted($authUser->id);
            if ($data['has_voted']) {
                $data['voters'] = Vote::votersByCandidate($election->id);
            }
        }

        Response::success(['election' => $data]);
    }

    /**
     * PUT /elections/{id}
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['admin_general', 'super_admin'], $authUser);

        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $election->update($data);

        ActivityLog::log('election.update', $authUser->id, 'election', $id);

        Response::success(['election' => Election::findById($id)], 'Election updated.');
    }

    /**
     * DELETE /elections/{id}
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['admin_general', 'super_admin'], $authUser);

        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        $election->delete();
        ActivityLog::log('election.delete', $authUser->id, 'election', $id);

        Response::success(null, 'Election deleted.');
    }

    /**
     * GET /elections/{id}/candidates
     */
    public static function candidates(int $id): never
    {
        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        Response::success(['candidates' => $election->candidates()]);
    }

    /**
     * POST /elections/{id}/candidates
     */
    public static function addCandidate(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['admin_general', 'super_admin'], $authUser);

        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');

        if (!$v->passes()) {
            Response::validationError('Failed to add candidate.', $v->errors());
        }

        $candidate = Candidate::create([
            'election_id' => $id,
            'user_id'     => (int) $data['user_id'],
            'manifesto'   => $data['manifesto'] ?? null,
            'position'    => $data['position'] ?? null,
        ]);

        ActivityLog::log('election.add_candidate', $authUser->id, 'candidate', $candidate->id);

        Response::success(['candidate' => $candidate], 'Candidate added.', 201);
    }

    /**
     * POST /elections/{id}/vote
     */
    public static function vote(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require('student', $authUser);

        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        if ($election->status !== 'active') {
            Response::error('This election is not active.', 400);
        }

        if ($election->hasVoted($authUser->id)) {
            Alert::create([
                'title'    => 'Duplicate Vote Attempt',
                'message'  => "User #{$authUser->id} ({$authUser->username}) attempted to vote again in election '{$election->title}' (ID: {$id}).",
                'severity' => 'high',
            ]);
            Response::error('You have already voted in this election.', 400);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('candidate_id')->integer('candidate_id');

        if (!$v->passes()) {
            Response::validationError('Voting failed.', $v->errors());
        }

        $vote = Vote::cast($id, $authUser->id, (int) $data['candidate_id']);
        if (!$vote) {
            Alert::create([
                'title'    => 'Invalid Vote Attempt',
                'message'  => "User #{$authUser->id} ({$authUser->username}) failed to cast vote in election '{$election->title}' (ID: {$id}) with candidate_id={$data['candidate_id']}.",
                'severity' => 'medium',
            ]);
            Response::error('Unable to cast vote. Please verify the candidate ID.', 400);
        }

        Notification::create(
            $authUser->id,
            'Vote Recorded',
            "Your vote in '{$election->title}' has been successfully cast.",
            'election',
            'election',
            $id
        );

        ActivityLog::log('election.vote', $authUser->id, 'vote', $vote->id);

        Response::success(null, 'Your vote has been recorded.');
    }

    /**
     * GET /elections/{id}/results
     */
    public static function results(int $id): never
    {
        $election = Election::findById($id);
        if (!$election) {
            Response::notFound('Election not found.');
        }

        $results       = Vote::results($id);
        $participation = Vote::voterParticipation($id);
        $totalVotes    = Vote::totalVotes($id);
        $votersByCand  = Vote::votersByCandidate($id);

        $results = array_map(function ($c) use ($votersByCand) {
            $cid = (int) $c['candidate_id'];
            $c['voters'] = $votersByCand[$cid] ?? [];
            return $c;
        }, $results);

        Response::success([
            'election'      => $election,
            'results'       => $results,
            'total_votes'   => $totalVotes,
            'participation' => $participation,
        ]);
    }
}
