<?php
require_once __DIR__ . '/../config/config.php';

$skills = getSkills();
$result = array_map(function($s) {
    return [
        'id' => $s['id'],
        'name' => $s['name'],
        'slug' => $s['slug'],
        'icon' => $s['icon'] ?? 'code',
        'color' => $s['color'],
        'description' => $s['description'],
    ];
}, $skills);

jsonResponse(['skills' => $result]);
