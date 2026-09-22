<?php
/**
 * Finance Controller
 *
 * GET    /finance/dashboard
 * GET    /finance/invoices
 * POST   /finance/invoices
 * GET    /finance/invoices/{id}
 * PUT    /finance/invoices/{id}
 * DELETE /finance/invoices/{id}
 * GET    /finance/payments
 * POST   /finance/payments
 * GET    /finance/reports
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Pdf;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\FinancialRecord;
use App\Models\FinancialPayment;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Config\Database;

class FinanceController
{
    /**
     * GET /finance/dashboard
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $totalInvoices = Invoice::countAll();
        $paymentStats = $db->query('SELECT COUNT(*),SUM(amount) FROM payments')->fetch();
        $pendingAmount = $db->query("SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status='pending' OR status='overdue'")->fetchColumn();
        $paidAmount    = $db->query("SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status='paid'")->fetchColumn();
        $overdueInvoices  = Invoice::countAll(['status' => 'overdue']);
        $paymentMethods = Payment::getTotalByMethod();
        $recentTransactions = Payment::findAll([], 1, 10);

        Response::success([
            'total_invoices'      => (int)$totalInvoices,
            'total_payments'      => (int)($paymentStats['COUNT(*)'] ?? 0),
            'total_revenue'       => (float)($paymentStats['SUM(amount)'] ?? 0),
            'pending_amount'      => (float)$pendingAmount,
            'paid_amount'         => (float)$paidAmount,
            'overdue_invoices'    => (int)$overdueInvoices,
            'payment_methods'     => $paymentMethods,
            'recent_transactions' => array_map(fn($p) => $p->toArray(), $recentTransactions),
        ]);
    }

    /**
     * GET /finance/invoices
     */
    public static function invoices(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $status  = $_GET['status'] ?? '';
        $userId  = $_GET['user_id'] ?? '';

        $filters = [];
        if ($status) $filters['status'] = $status;
        if ($userId) $filters['user_id'] = (int)$userId;

        $invoices = Invoice::findAll($filters, $page, $perPage);
        $total    = Invoice::countAll($filters);

        Response::success([
            'invoices'    => array_map(fn($i) => $i->toArray(), $invoices),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /finance/invoices
     */
    public static function createInvoice(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');
        $v->required('amount')->min('amount', 0);
        $v->required('due_date');

        if (!$v->passes()) {
            Response::validationError('Invoice creation failed.', $v->errors());
        }

        $invoiceNo = 'INV-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        $invoice = Invoice::create([
            'invoice_no' => $invoiceNo,
            'user_id'    => (int)$data['user_id'],
            'amount'     => (float)$data['amount'],
            'description' => $data['description'] ?? null,
            'due_date'   => $data['due_date'],
            'created_by' => $authUser->id,
        ]);

        ActivityLog::log('finance.invoice_create', $authUser->id, 'invoice', $invoice->id, [
            'user_id' => $data['user_id'],
            'amount'  => $data['amount'],
        ]);

        Notification::create((int)$data['user_id'], 'Invoice Created', "Invoice $invoiceNo for \${$data['amount']} is due on {$data['due_date']}.", 'info');

        Response::success(['invoice' => $invoice->toArray()], 'Invoice created successfully.');
    }

    /**
     * GET /finance/invoices/{id}
     */
    public static function getInvoice(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $invoice = Invoice::findById($id);
        if (!$invoice) {
            Response::notFound('Invoice not found.');
        }

        Response::success(['invoice' => $invoice->toArray()]);
    }

    /**
     * PUT /finance/invoices/{id}
     */
    public static function updateInvoice(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $invoice = Invoice::findById($id);
        if (!$invoice) {
            Response::notFound('Invoice not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (isset($data['status'])) {
            $paidAt = $data['status'] === 'paid' ? date('Y-m-d H:i:s') : null;
            $invoice->updateStatus($data['status'], $paidAt);

            ActivityLog::log('finance.invoice_update', $authUser->id, 'invoice', $id, [
                'status' => $data['status'],
            ]);
        }

        Response::success(['invoice' => $invoice->toArray()], 'Invoice updated.');
    }

    /**
     * DELETE /finance/invoices/{id}
     */
    public static function deleteInvoice(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $invoice = Invoice::findById($id);
        if (!$invoice) {
            Response::notFound('Invoice not found.');
        }

        $db = \App\Config\Database::getInstance();
        $db->prepare('DELETE FROM invoices WHERE id=?')->execute([$id]);

        ActivityLog::log('finance.invoice_delete', $authUser->id, 'invoice', $id);

        Response::success(null, 'Invoice deleted.');
    }

    /**
     * GET /finance/payments
     */
    public static function payments(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $method = $_GET['method'] ?? '';
        $userId  = $_GET['user_id'] ?? '';

        $filters = [];
        if ($method) $filters['method'] = $method;
        if ($userId) $filters['user_id'] = (int)$userId;

        $payments = Payment::findAll($filters, $page, $perPage);
        $total    = Payment::countAll($filters);

        Response::success([
            'payments'    => array_map(fn($p) => $p->toArray(), $payments),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /finance/payments
     */
    public static function recordPayment(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');
        $v->required('amount')->min('amount', 0);
        $v->required('method');

        if (!$v->passes()) {
            Response::validationError('Payment recording failed.', $v->errors());
        }

        $payment = Payment::create([
            'invoice_id'  => isset($data['invoice_id']) ? (int)$data['invoice_id'] : null,
            'user_id'     => (int)$data['user_id'],
            'amount'      => (float)$data['amount'],
            'method'      => $data['method'],
            'reference'   => $data['reference'] ?? null,
            'notes'       => $data['notes'] ?? null,
            'received_by' => $authUser->id,
        ]);

        if ($payment->invoice_id) {
            $invoice = Invoice::findById($payment->invoice_id);
            if ($invoice) {
                $invoice->updateStatus('paid', date('Y-m-d H:i:s'));
            }
        }

        ActivityLog::log('finance.payment_record', $authUser->id, 'payment', $payment->id, [
            'amount' => $data['amount'],
            'method' => $data['method'],
        ]);

        Response::success(['payment' => $payment->toArray()], 'Payment recorded successfully.');
    }

    /**
     * GET /finance/reports
     */
    public static function reports(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();
        $period = $_GET['period'] ?? 'monthly';

        if ($period === 'daily') {
            $revenue = $db->query(
                "SELECT DATE(created_at) AS date, SUM(amount) AS total, COUNT(*) AS count
                 FROM payments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                 GROUP BY DATE(created_at) ORDER BY date"
            )->fetchAll();
        } else {
            $revenue = $db->query(
                "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total, COUNT(*) AS count
                 FROM payments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                 GROUP BY month ORDER BY month"
            )->fetchAll();
        }

        $invoiceBreakdown = $db->query(
            "SELECT status, COUNT(*) AS count, SUM(amount) AS total FROM invoices GROUP BY status"
        )->fetchAll();

        Response::success([
            'period' => $period,
            'revenue' => $revenue,
            'invoice_breakdown' => $invoiceBreakdown,
        ]);
    }

    // ─── Financial Management (Monthly Student Payments) ────────────────────

    /**
     * GET /finance/records
     */
    public static function records(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_financial', 'super_admin', 'admin_general']);

        $records = FinancialRecord::findAll();
        $db = Database::getInstance();
        $data = array_map(function(FinancialRecord $r) use ($db) {
            $arr = $r->toArray();
            $stmt = $db->prepare('SELECT COUNT(*) FROM financial_payments WHERE record_id = ?');
            $stmt->execute([$r->id]);
            $arr['student_count'] = (int)$stmt->fetchColumn();
            $stmt2 = $db->prepare("SELECT COUNT(*) FROM financial_payments WHERE record_id = ? AND status = 'paid'");
            $stmt2->execute([$r->id]);
            $arr['paid_count'] = (int)$stmt2->fetchColumn();
            $creator = User::findById($r->created_by);
            $arr['created_by_name'] = $creator ? $creator->full_name : 'Unknown';
            return $arr;
        }, $records);

        Response::success(['records' => $data]);
    }

    /**
     * POST /finance/records
     */
    public static function createRecord(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_financial', 'super_admin', 'admin_general']);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['month_name'])) {
            Response::validationError('Month name is required.', ['month_name' => ['Please enter a month name.']]);
        }

        // Check if there's already an active record
        $active = FinancialRecord::getActive();
        if ($active) {
            $active->updateStatus('archived');
        }

        $record = FinancialRecord::create([
            'month_name' => $data['month_name'],
            'created_by' => $authUser->id,
        ]);

        // Create payment records for all students
        $db = Database::getInstance();
        $students = $db->query("SELECT id FROM users WHERE role_slug = 'student' AND status = 'active'")->fetchAll();
        foreach ($students as $student) {
            FinancialPayment::create([
                'record_id' => $record->id,
                'student_id' => (int)$student['id'],
            ]);
        }

        ActivityLog::log('finance.record_create', $authUser->id, 'financial_record', $record->id, [
            'month_name' => $data['month_name'],
            'student_count' => count($students),
        ]);

        $recordArr = $record->toArray();
        $recordArr['student_count'] = count($students);
        $recordArr['paid_count'] = 0;
        $recordArr['created_by_name'] = $authUser->full_name;

        Response::success(['record' => $recordArr], 'Monthly record created successfully.');
    }

    /**
     * GET /finance/records/{id}
     */
    public static function getRecord(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_financial', 'super_admin', 'admin_general']);

        $record = FinancialRecord::findById($id);
        if (!$record) {
            Response::notFound('Record not found.');
        }

        $payments = FinancialPayment::findByRecord($id);
        $students = [];

        foreach ($payments as $p) {
            $student = User::findById($p->student_id);
            $students[] = [
                'payment_id' => $p->id,
                'student_id' => $p->student_id,
                'student_name' => $student ? $student->full_name : 'Unknown',
                'email' => $student ? $student->email : '',
                'status' => $p->status,
                'paid_at' => $p->paid_at,
            ];
        }

        $paidCount = count(array_filter($payments, fn($p) => $p->status === 'paid'));
        $unpaidCount = count($payments) - $paidCount;

        $recordArr = $record->toArray();
        $creator = User::findById($record->created_by);
        $recordArr['created_by_name'] = $creator ? $creator->full_name : 'Unknown';
        $recordArr['total_students'] = count($students);
        $recordArr['paid_count'] = $paidCount;
        $recordArr['unpaid_count'] = $unpaidCount;

        Response::success([
            'record' => $recordArr,
            'students' => $students,
        ]);
    }

    /**
     * PUT /finance/records/{id}/payments/{studentId}
     */
    public static function togglePayment(int $id, int $studentId): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_financial', 'super_admin', 'admin_general']);

        $record = FinancialRecord::findById($id);
        if (!$record) {
            Response::notFound('Record not found.');
        }
        if ($record->status !== 'active') {
            Response::error('Cannot modify an archived record.', 400);
        }

        $payment = FinancialPayment::findByRecordAndStudent($id, $studentId);
        if (!$payment) {
            Response::notFound('Payment record not found.');
        }

        $payment->toggleStatus();

        $student = User::findById($studentId);
        ActivityLog::log('finance.payment_toggle', $authUser->id, 'financial_payment', $payment->id, [
            'record_id' => $id,
            'student_id' => $studentId,
            'new_status' => $payment->status,
        ]);

        Response::success([
            'payment' => $payment->toArray(),
            'status' => $payment->status,
        ], "Payment status updated to {$payment->status}.");
    }

    /**
     * POST /finance/records/{id}/submit
     */
    public static function submitRecord(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_financial', 'super_admin', 'admin_general']);

        $record = FinancialRecord::findById($id);
        if (!$record) {
            Response::notFound('Record not found.');
        }
        if ($record->status !== 'active') {
            Response::error('Record is already archived.', 400);
        }

        $record->updateStatus('archived');
        $record->status = 'archived';

        $payments = FinancialPayment::findByRecord($id);
        $paidCount = count(array_filter($payments, fn($p) => $p->status === 'paid'));
        $totalCount = count($payments);

        ActivityLog::log('finance.record_submit', $authUser->id, 'financial_record', $id, [
            'month_name' => $record->month_name,
            'paid' => $paidCount,
            'total' => $totalCount,
        ]);

        Response::success([
            'record' => $record->toArray(),
            'paid_count' => $paidCount,
            'total_count' => $totalCount,
        ], 'Monthly report submitted and archived.');
    }

    /**
     * GET /finance/records/{id}/pdf
     */
    public static function downloadPdf(int $id): never
    {
        AuthMiddleware::authenticate();

        $record = FinancialRecord::findById($id);
        if (!$record) {
            Response::notFound('Record not found.');
        }

        $payments = FinancialPayment::findByRecord($id);
        $students = [];
        foreach ($payments as $p) {
            $student = User::findById($p->student_id);
            $students[] = [
                'name' => $student ? $student->full_name : 'Unknown',
                'email' => $student ? $student->email : '',
                'status' => $p->status === 'paid' ? 'Paid' : 'Unpaid',
            ];
        }

        $paidCount = count(array_filter($payments, fn($p) => $p->status === 'paid'));
        $unpaidCount = count($payments) - $paidCount;
        $totalCount = count($payments);

        $pdf = new Pdf();
        $pdf->addPage();
        $pdf->title('CS15 Hub - Financial Report');
        $pdf->subtitle('Jazeera University');
        $pdf->spacer(6);
        $pdf->meta('Month:', $record->month_name);
        $pdf->meta('Generated:', date('M j, Y g:i A'));
        $pdf->meta('Status:', ucfirst($record->status));
        $pdf->spacer(10);

        // Student table
        $headers = ['#', 'Student Name', 'Email', 'Status'];
        $colWidths = [25, 185, 210, 75];
        $rows = [];
        $idx = 1;
        foreach ($students as $s) {
            $rows[] = [$idx++, $s['name'], $s['email'], $s['status']];
        }
        $pdf->table($headers, $rows, $colWidths);

        $pdf->spacer(8);
        // Summary
        $pdf->summary('Total Students', (string)$totalCount);
        $pdf->summary('Paid', (string)$paidCount);
        $pdf->summary('Unpaid', (string)$unpaidCount);

        $filename = 'financial_report_' . preg_replace('/[^a-zA-Z0-9]/', '_', $record->month_name) . '.pdf';
        $pdf->output($filename);
    }

    /**
     * GET /finance/records/{id}/csv
     */
    public static function downloadCsv(int $id): never
    {
        AuthMiddleware::authenticate();

        $record = FinancialRecord::findById($id);
        if (!$record) {
            Response::notFound('Record not found.');
        }

        $payments = FinancialPayment::findByRecord($id);

        header('Content-Type: text/csv; charset=utf-8');
        $filename = 'financial_report_' . preg_replace('/[^a-zA-Z0-9]/', '_', $record->month_name) . '.csv';
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF"); // BOM for Excel UTF-8

        // Title row
        fputcsv($out, ['CS15 Hub - Financial Report']);
        fputcsv($out, ['Month: ' . $record->month_name]);
        fputcsv($out, ['Status: ' . ucfirst($record->status)]);
        fputcsv($out, []);

        // Header row
        fputcsv($out, ['#', 'Student Name', 'Email', 'Status']);

        // Data rows
        $paidCount = 0;
        $idx = 1;
        foreach ($payments as $p) {
            $student = User::findById($p->student_id);
            $name = $student ? $student->full_name : 'Unknown';
            $email = $student ? $student->email : '';
            $status = $p->status === 'paid' ? 'Paid' : 'Unpaid';
            fputcsv($out, [$idx++, $name, $email, $status]);
            if ($p->status === 'paid') $paidCount++;
        }

        fputcsv($out, []);
        fputcsv($out, ['Summary']);
        fputcsv($out, ['Total Students', count($payments)]);
        fputcsv($out, ['Paid', $paidCount]);
        fputcsv($out, ['Unpaid', count($payments) - $paidCount]);

        fclose($out);
        exit;
    }
}
