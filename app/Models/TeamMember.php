<?php
namespace App\Models;
use App\Config\Database;
class TeamMember {
    public int $id; public int $team_id; public int $user_id; public string $role; public string $joined_at;
    public function __construct(array $d) { $this->id=(int)$d['id'];$this->team_id=(int)$d['team_id'];$this->user_id=(int)$d['user_id'];$this->role=$d['role'];$this->joined_at=$d['joined_at']; }
    public static function findByTeam(int $teamId): array { $db=Database::getInstance();$stmt=$db->prepare('SELECT tm.*,u.username,u.full_name FROM team_members tm JOIN users u ON u.id=tm.user_id WHERE tm.team_id=?');$stmt->execute([$teamId]);return $stmt->fetchAll(); }
    public static function addMember(int $teamId,int $userId,string $role='player'): bool { $db=Database::getInstance();$stmt=$db->prepare('INSERT IGNORE INTO team_members (team_id,user_id,role) VALUES (?,?,?)');return $stmt->execute([$teamId,$userId,$role]); }
    public static function removeMember(int $teamId,int $userId): bool { $db=Database::getInstance();$stmt=$db->prepare('DELETE FROM team_members WHERE team_id=? AND user_id=?');return $stmt->execute([$teamId,$userId]); }
}
