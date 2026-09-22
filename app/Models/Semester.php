<?php
namespace App\Models;
use App\Config\Database;

class Semester {
    public int $id; public string $name; public string $code; public string $start_date; public string $end_date; public int $is_current; public string $created_at;
    public function __construct(array $d) { $this->id=(int)$d['id'];$this->name=$d['name'];$this->code=$d['code'];$this->start_date=$d['start_date'];$this->end_date=$d['end_date'];$this->is_current=(int)$d['is_current'];$this->created_at=$d['created_at']; }
    public static function findById(int $id): ?self { $db=Database::getInstance();$stmt=$db->prepare('SELECT * FROM semesters WHERE id=? LIMIT 1');$stmt->execute([$id]);$row=$stmt->fetch();return $row?new self($row):null; }
    public static function getCurrent(): ?self { $db=Database::getInstance();$stmt=$db->prepare('SELECT * FROM semesters WHERE is_current=1 LIMIT 1');$stmt->execute();$row=$stmt->fetch();return $row?new self($row):null; }
    public static function findAll(): array { $db=Database::getInstance();return array_map(fn($r)=>new self($r),$db->query('SELECT * FROM semesters ORDER BY start_date DESC')->fetchAll()); }
    public static function create(array $d): self { $db=Database::getInstance();$stmt=$db->prepare('INSERT INTO semesters (name,code,start_date,end_date,is_current) VALUES (?,?,?,?,?)');$stmt->execute([$d['name'],$d['code'],$d['start_date'],$d['end_date'],$d['is_current']??0]);return self::findById((int)$db->lastInsertId()); }
    public function toArray(): array { return ['id'=>$this->id,'name'=>$this->name,'code'=>$this->code,'start_date'=>$this->start_date,'end_date'=>$this->end_date,'is_current'=>$this->is_current,'created_at'=>$this->created_at]; }
}
