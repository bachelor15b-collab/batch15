<?php
require_once __DIR__ . '/../config/config.php';

$query = sanitize($_GET['q'] ?? '');
$results = [];

if (!empty($query) && strlen($query) >= 2) {
    $searchTerm = '%' . $query . '%';
    $stmt = $pdo->prepare(
        "SELECT v.id, v.title, v.slug, v.duration, v.thumbnail, v.views, v.instructor,
                s.name as skill_name, s.color as skill_color
         FROM videos v
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE v.is_active = 1 AND v.is_hidden = 0
         AND (v.title LIKE ? OR v.description LIKE ? OR v.instructor LIKE ? OR s.name LIKE ?)
         ORDER BY v.views DESC
         LIMIT 10"
    );
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    $results = $stmt->fetchAll();
}

jsonResponse(['results' => $results, 'query' => $query]);
