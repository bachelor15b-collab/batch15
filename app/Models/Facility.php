<?php
namespace App\Models;
use App\Config\Database;
class Facility {
    public int $id; public string $name; public string $type; public ?int $capacity; public ?string $location; public ?string $description; public string $status; public string $created_at; public string $updated_at;
    public function __construct(array $d) { $this->id=(int)$d['id'];$this->name=$d['name'];$this->type=$d['type'];$this->capacity=isset($d['capacity'])?(int)$d['capacity']:null;$this->location=$d['location']??null;$this->description=$d['description']??null;$this->status=$d['status'];$this->created_at=$d['created_at'];$this->updated_at=$d['updated_at']??$d['created_at']; }
    public static function findById(int $id): ?self { $db=Database::getInstance();$stmt=$db->prepare('SELECT * FROM facilities WHERE id=? LIMIT 1');$stmt->execute([$id]);$row=$stmt->fetch();return $row?new self($row):null; }
    public static function findAll(array $filters=[]): array { $db=Database::getInstance();$where=[];$params=[];if(!empty($filters['type'])){$where[]='type=?';$params[]=$filters['type'];}if(!empty($filters['status'])){$where[]='status=?';$params[]=$filters['status'];}$wc=$where?'WHERE '.implode(' AND ',$where):'';$stmt=$db->prepare("SELECT * FROM facilities {$wc} ORDER BY name");$stmt->execute($params);return array_map(fn($r)=>new self($r),$stmt->fetchAll()); }
    public static function create(array $d): self { $db=Database::getInstance();$stmt=$db->prepare('INSERT INTO facilities (name,type,capacity,location,description,status) VALUES (?,?,?,?,?,?)');$stmt->execute([$d['name'],$d['type'],$d['capacity']??null,$d['location']??null,$d['description']??null,$d['status']??'available']);return self::findById((int)$db->lastInsertId()); }
    public function updateStatus(string $status): bool { $db=Database::getInstance();$stmt=$db->prepare('UPDATE facilities SET status=? WHERE id=?');return $stmt->execute([$status,$this->id]); }
    public function toArray(): array { return ['id'=>$this->id,'name'=>$this->name,'type'=>$this->type,'capacity'=>$this->capacity,'location'=>$this->location,'description'=>$this->description,'status'=>$this->status,'created_at'=>$this->created_at]; }
}
