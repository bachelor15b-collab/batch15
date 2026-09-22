<?php
/**
 * Operations Controller (Facilities & Bookings)
 *
 * GET    /operations/dashboard
 * GET    /operations/facilities
 * POST   /operations/facilities
 * GET    /operations/facilities/{id}
 * PUT    /operations/facilities/{id}/status
 * GET    /operations/bookings
 * POST   /operations/bookings
 * GET    /operations/bookings/{id}
 * PUT    /operations/bookings/{id}/approve
 * PUT    /operations/bookings/{id}/reject
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Facility;
use App\Models\Booking;
use App\Models\ActivityLog;
use App\Config\Database;

class OperationsController
{
    /**
     * GET /operations/dashboard
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $totalFacilities = $db->query('SELECT COUNT(*) FROM facilities')->fetchColumn();
        $availableFacilities = $db->query("SELECT COUNT(*) FROM facilities WHERE status='available'")->fetchColumn();
        $pendingBookings   = $db->query("SELECT COUNT(*) FROM bookings WHERE status='pending'")->fetchColumn();
        $approvedBookings  = $db->query("SELECT COUNT(*) FROM bookings WHERE status='approved'")->fetchColumn();

        $facilities = Facility::findAll();
        $upcoming = Booking::findAll(['status' => 'approved'], 1, 10);

        Response::success([
            'total_facilities'     => (int)$totalFacilities,
            'available_facilities' => (int)$availableFacilities,
            'pending_bookings'     => (int)$pendingBookings,
            'approved_bookings'    => (int)$approvedBookings,
            'facilities'           => array_map(fn($f) => $f->toArray(), $facilities),
            'upcoming_bookings'    => array_map(fn($b) => $b->toArray(), $upcoming),
        ]);
    }

    /**
     * GET /operations/facilities
     */
    public static function facilities(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $type   = $_GET['type'] ?? '';
        $status = $_GET['status'] ?? '';

        $filters = [];
        if ($type) $filters['type'] = $type;
        if ($status) $filters['status'] = $status;

        $facilities = Facility::findAll($filters);

        Response::success([
            'facilities' => array_map(fn($f) => $f->toArray(), $facilities),
        ]);
    }

    /**
     * POST /operations/facilities
     */
    public static function createFacility(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('name');
        $v->required('type');

        if (!$v->passes()) {
            Response::validationError('Facility creation failed.', $v->errors());
        }

        $facility = Facility::create($data);
        ActivityLog::log('operations.facility_create', $authUser->id, 'facility', $facility->id);

        Response::success(['facility' => $facility->toArray()], 'Facility created.');
    }

    /**
     * GET /operations/facilities/{id}
     */
    public static function getFacility(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $facility = Facility::findById($id);
        if (!$facility) {
            Response::notFound('Facility not found.');
        }

        Response::success(['facility' => $facility->toArray()]);
    }

    /**
     * PUT /operations/facilities/{id}/status
     */
    public static function updateFacilityStatus(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['status'])) {
            Response::validationError('Status is required.');
        }

        $facility = Facility::findById($id);
        if (!$facility) {
            Response::notFound('Facility not found.');
        }

        $facility->updateStatus($data['status']);
        ActivityLog::log('operations.facility_status', $authUser->id, 'facility', $id, [
            'status' => $data['status'],
        ]);

        Response::success(['facility' => $facility->toArray()], 'Facility status updated.');
    }

    /**
     * GET /operations/bookings
     */
    public static function bookings(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $status  = $_GET['status'] ?? '';
        $facilityId = $_GET['facility_id'] ?? '';

        $filters = [];
        if ($status) $filters['status'] = $status;
        if ($facilityId) $filters['facility_id'] = (int)$facilityId;

        $bookings = Booking::findAll($filters, $page, $perPage);

        Response::success([
            'bookings' => array_map(fn($b) => $b->toArray(), $bookings),
        ]);
    }

    /**
     * POST /operations/bookings
     */
    public static function createBooking(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('facility_id')->integer('facility_id');
        $v->required('title');
        $v->required('start_time');
        $v->required('end_time');

        if (!$v->passes()) {
            Response::validationError('Booking failed.', $v->errors());
        }

        $data['user_id'] = $authUser->id;

        $db = Database::getInstance();
        $stmt = $db->prepare(
            "SELECT COUNT(*) FROM bookings WHERE facility_id=? AND status IN ('pending','approved')
             AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))"
        );
        $stmt->execute([$data['facility_id'], $data['end_time'], $data['start_time'], $data['end_time'], $data['start_time']]);
        $conflicts = (int)$stmt->fetchColumn();

        if ($conflicts > 0) {
            Response::validationError('This time slot conflicts with an existing booking.');
        }

        $booking = Booking::create($data);
        ActivityLog::log('operations.booking_create', $authUser->id, 'booking', $booking->id);

        Response::success(['booking' => $booking->toArray()], 'Booking created.');
    }

    /**
     * GET /operations/bookings/{id}
     */
    public static function getBooking(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $booking = Booking::findById($id);
        if (!$booking) {
            Response::notFound('Booking not found.');
        }

        Response::success(['booking' => $booking->toArray()]);
    }

    /**
     * PUT /operations/bookings/{id}/approve
     */
    public static function approveBooking(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $booking = Booking::findById($id);
        if (!$booking) {
            Response::notFound('Booking not found.');
        }

        $booking->approve($authUser->id);
        ActivityLog::log('operations.booking_approve', $authUser->id, 'booking', $id);

        Response::success(['booking' => $booking->toArray()], 'Booking approved.');
    }

    /**
     * PUT /operations/bookings/{id}/reject
     */
    public static function rejectBooking(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $booking = Booking::findById($id);
        if (!$booking) {
            Response::notFound('Booking not found.');
        }

        $booking->reject($authUser->id);
        ActivityLog::log('operations.booking_reject', $authUser->id, 'booking', $id);

        Response::success(['booking' => $booking->toArray()], 'Booking rejected.');
    }
}
