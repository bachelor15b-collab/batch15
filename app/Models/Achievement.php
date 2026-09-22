<?php
namespace App\Models;
use App\Config\Database;
class Achievement {
    public int $id; public string $name; public ?string $description; public ?string $icon; public int $xp_reward; public ?string $criteria; public string $created_at;
    public function __construct(array $d) { $this->id=(int)$d['id'];$this->name=$d['name'];$this->description=$d['description']??null;$this->icon=$d['icon']??null;$this->xp_reward=(int)$d['xp_reward'];$this->criteria=$d['criteria']??null;$this->created_at=$d['created_at']; }
    public static function findAll(): array { $db=Database::getInstance();return array_map(fn($r)=>new self($r),$db->query('SELECT * FROM achievements ORDER BY name')->fetchAll()); }
    public static function findById(int $id): ?self { $db=Database::getInstance();$stmt=$db->prepare('SELECT * FROM achievements WHERE id=? LIMIT 1');$stmt->execute([$id]);$row=$stmt->fetch();return $row?new self($row):null; }
    public static function create(array $d): self { $db=Database::getInstance();$stmt=$db->prepare('INSERT INTO achievements (name,description,icon,xp_reward,criteria) VALUES (?,?,?,?,?)');$stmt->execute([$d['name'],$d['description']??null,$d['icon']??null,$d['xp_reward']??0,$d['criteria']??null]);return self::findById((int)$db->lastInsertId()); }
    public function toArray(): array { return ['id'=>$this->id,'name'=>$this->name,'description'=>$this->description,'icon'=>$this->icon,'xp_reward'=>$this->xp_reward,'criteria'=>$this->criteria,'created_at'=>$this->created_at]; }
}
