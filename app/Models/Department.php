<?php
namespace App\Models;
use App\Config\Database;

class Department {
    public int $id; public string $name; public string $code; public ?string $description; public ?int $head_user_id; public string $created_at;
    public function __construct(array $d) { $this->id=(int)$d['id'];$this->name=$d['name'];$this->code=$d['code'];$this->description=$d['description']??null;$this->head_user_id=isset($d['head_user_id'])?(int)$d['head_user_id']:null;$this->created_at=$d['created_at']; }
    public static function findById(int $id): ?self { $db=Database::getInstance();$stmt=$db->prepare('SELECT * FROM departments WHERE id=? LIMIT 1');$stmt->execute([$id]);$row=$stmt->fetch();return $row?new self($row):null; }
    public static function findAll(): array { $db=Database::getInstance();return array_map(fn($r)=>new self($r),$db->query('SELECT * FROM departments ORDER BY name')->fetchAll()); }
    public static function create(array $d): self { $db=Database::getInstance();$stmt=$db->prepare('INSERT INTO departments (name,code,description,head_user_id) VALUES (?,?,?,?)');$stmt->execute([$d['name'],$d['code'],$d['description']??null,$d['head_user_id']??null]);return self::findById((int)$db->lastInsertId()); }
    public function toArray(): array { return ['id'=>$this->id,'name'=>$this->name,'code'=>$this->code,'description'=>$this->description,'head_user_id'=>$this->head_user_id,'created_at'=>$this->created_at]; }
}
