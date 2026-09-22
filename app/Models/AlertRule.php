<?php
namespace App\Models;
use App\Config\Database;
class AlertRule {
    public static function findAll(bool $enabledOnly = false): array {
        $db = Database::getInstance();
        $sql = 'SELECT * FROM alert_rules';
        if ($enabledOnly) $sql .= ' WHERE enabled=1';
        return $db->query($sql . ' ORDER BY name')->fetchAll();
    }
    public static function create(array $data): void {
        $db = Database::getInstance();
        $s = $db->prepare('INSERT INTO alert_rules (name,metric,condition,threshold,severity,enabled,created_by) VALUES (?,?,?,?,?,?,?)');
        $s->execute([$data['name'],$data['metric'],$data['condition'],$data['threshold'],$data['severity']??'medium',$data['enabled']??1,$data['created_by']]);
    }
    public static function update(int $id, array $data): bool {
        $db = Database::getInstance(); $sets=[]; $params=[];
        $allowed=['name','metric','condition','threshold','severity','enabled'];
        foreach ($allowed as $f) { if (array_key_exists($f, $data)) { $sets[]="$f=?"; $params[]=$data[$f]; } }
        if (empty($sets)) return false;
        $params[]=$id;
        $s=$db->prepare('UPDATE alert_rules SET '.implode(',',$sets).' WHERE id=?');
        return $s->execute($params);
    }
    public static function delete(int $id): bool {
        $db = Database::getInstance();
        $s = $db->prepare('DELETE FROM alert_rules WHERE id=?');
        return $s->execute([$id]);
    }
}
