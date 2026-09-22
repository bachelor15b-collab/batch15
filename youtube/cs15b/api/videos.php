<?php
require_once __DIR__ . '/../config/config.php';

$page = intval($_GET['page'] ?? 1);
$limit = 20;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare(
    "SELECT v.*, s.name as skill_name, s.color as skill_color
     FROM videos v
     LEFT JOIN skills s ON v.skill_id = s.id
     WHERE v.is_active = 1 AND v.is_hidden = 0
     ORDER BY v.created_at DESC
     LIMIT ? OFFSET ?"
);
$stmt->execute([$limit, $offset]);
$videos = $stmt->fetchAll();

jsonResponse(['videos' => $videos, 'page' => $page]);
