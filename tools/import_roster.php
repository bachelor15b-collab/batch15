<?php
/**
 * CLI: Import the official BTCH 15-B roster into member_profiles.
 *
 * Reads data/roster.json (regenerate by parsing assets/js/members-data.js) and
 * upserts each student as an approved, unclaimed roster entry keyed by roster_key.
 *
 * Usage: php tools/import_roster.php
 */
declare(strict_types=1);

spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../app/';
    if (str_starts_with($class, $prefix)) {
        $file = $baseDir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (file_exists($file)) require_once $file;
    }
});

use App\Models\MemberProfile;

$jsonFile = __DIR__ . '/../data/roster.json';
if (!file_exists($jsonFile)) {
    fwrite(STDERR, "Missing data/roster.json\n");
    exit(1);
}

$roster = json_decode(file_get_contents($jsonFile), true);
if (!is_array($roster) || count($roster) === 0) {
    fwrite(STDERR, "Empty/invalid roster.json\n");
    exit(2);
}

$db = \App\Config\Database::getInstance();
$slugToId = [];
foreach ($db->query("SELECT id, roster_key FROM member_profiles WHERE roster_key IS NOT NULL")->fetchAll() as $r) {
    $slugToId[$r['roster_key']] = (int) $r['id'];
}

$inserted = 0;
$updated  = 0;
$skipped  = 0;

foreach ($roster as $entry) {
    $name = trim($entry['name'] ?? '');
    $slug = $entry['slug'] ?? '';
    if ($name === '' || $slug === '') { $skipped++; continue; }

    $parts = preg_split('/\s+/', $name);
    $first = $parts[0];
    $last  = array_pop($parts);
    $middle = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : null;

    $skills = array_values(array_filter(array_map('trim', $entry['uniqueSkills'] ?? [])));
    if (!empty($entry['programming'])) $skills[] = 'Programming · ' . $entry['programming'];

    $bioBits = ['CS Batch 15-B'];
    if (!empty($entry['learningStyle'])) $bioBits[] = $entry['learningStyle'] . ' learner';
    if (!empty($entry['programming'])) $bioBits[] = 'programming ability ' . $entry['programming'];
    $bio = implode(' · ', $bioBits) . '.';

    $attrs = [
        'student_id' => null,
        'first_name' => $first,
        'middle_name' => $middle,
        'last_name'  => $last,
        'picture_url' => '',
        'level'      => $entry['learningStyle'] ?: null,
        'year'       => 'Year 3',
        'semester'   => 'Semester 5',
        'source'     => 'roster',
        'roster_key' => $slug,
        'bio'        => $bio,
        'skills'     => implode("\n", $skills) ?: null,
        'languages'  => null,
        'interests'  => implode("\n", array_filter(array_map('trim', $entry['interests'] ?? []))) ?: null,
        'status'     => 'approved',
    ];

    if (isset($slugToId[$slug])) {
        $existing = MemberProfile::findById($slugToId[$slug]);
        if ($existing && $existing->source === 'roster') {
            $existing->update($attrs);
            $updated++;
            continue;
        }
        // slug collision on a non-roster profile: generate a suffixed key
        $attrs['roster_key'] = $slug . '-' . time();
    }

    $profile = new MemberProfile($attrs);
    $profile->create();
    $inserted++;
}

echo sprintf("Roster import complete — inserted: %d, updated: %d, skipped: %d\n", $inserted, $updated, $skipped);