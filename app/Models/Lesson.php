<?php
namespace App\Models;
use App\Config\Database;

class Lesson {
    public int $id;
    public int $course_id;
    public ?int $folder_id;
    public string $title;
    public ?string $description;
    public string $file_path;
    public string $file_type;
    public int $file_size;
    public string $original_filename;
    public int $uploaded_by;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $d) {
        $this->id=(int)$d["id"];
        $this->course_id=(int)$d["course_id"];
        $this->folder_id=isset($d["folder_id"])?(int)$d["folder_id"]:null;
        $this->title=$d["title"];
        $this->description=$d["description"]??null;
        $this->file_path=$d["file_path"];
        $this->file_type=$d["file_type"];
        $this->file_size=(int)$d["file_size"];
        $this->original_filename=$d["original_filename"];
        $this->uploaded_by=(int)$d["uploaded_by"];
        $this->created_at=$d["created_at"];
        $this->updated_at=$d["updated_at"]??$d["created_at"];
    }

    public static function findById(int $id): ?self {
        $db=Database::getInstance();
        $stmt=$db->prepare("SELECT * FROM lessons WHERE id=? LIMIT 1");
        $stmt->execute([$id]);
        $row=$stmt->fetch();
        return $row?new self($row):null;
    }

    public static function findAll(array $filters=[], int $page=1, int $perPage=50): array {
        $db=Database::getInstance();
        $where=[];$params=[];
        if(!empty($filters["course_id"])){$where[]="course_id=?";$params[]=(int)$filters["course_id"];}
        if(!empty($filters["uploaded_by"])){$where[]="uploaded_by=?";$params[]=(int)$filters["uploaded_by"];}
        if(array_key_exists("folder_id",$filters)){$where[]="folder_id".($filters["folder_id"]===null?" IS NULL":"=?");if($filters["folder_id"]!==null)$params[]=(int)$filters["folder_id"];}
        $wc=$where?"WHERE ".implode(" AND ",$where):"";
        $offset=($page-1)*$perPage;
        $stmt=$db->prepare("SELECT * FROM lessons {$wc} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[]=$perPage;$params[]=$offset;
        $stmt->execute($params);
        return array_map(fn($r)=>new self($r),$stmt->fetchAll());
    }

    public static function countAll(array $filters=[]): int {
        $db=Database::getInstance();
        $where=[];$params=[];
        if(!empty($filters["course_id"])){$where[]="course_id=?";$params[]=(int)$filters["course_id"];}
        if(!empty($filters["uploaded_by"])){$where[]="uploaded_by=?";$params[]=(int)$filters["uploaded_by"];}
        if(array_key_exists("folder_id",$filters)){$where[]="folder_id".($filters["folder_id"]===null?" IS NULL":"=?");if($filters["folder_id"]!==null)$params[]=(int)$filters["folder_id"];}
        $wc=$where?"WHERE ".implode(" AND ",$where):"";
        $stmt=$db->prepare("SELECT COUNT(*) FROM lessons {$wc}");
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    public static function create(array $d): self {
        $db=Database::getInstance();
        $stmt=$db->prepare("INSERT INTO lessons (course_id,folder_id,title,description,file_path,file_type,file_size,original_filename,uploaded_by) VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->execute([$d["course_id"],$d["folder_id"]??null,$d["title"],$d["description"]??null,$d["file_path"],$d["file_type"],$d["file_size"],$d["original_filename"],$d["uploaded_by"]]);
        return self::findById((int)$db->lastInsertId());
    }

    public function update(array $d): bool {
        $db=Database::getInstance();
        $sets=[];$params=[];
        $allowed=["course_id","folder_id","title","description","file_path","file_type","file_size","original_filename"];
        foreach($allowed as $f){if(array_key_exists($f,$d)){$sets[]="{$f}=?";$params[]=$d[$f];}}
        if(empty($sets))return false;
        $params[]=$this->id;
        $stmt=$db->prepare("UPDATE lessons SET ".implode(",",$sets)." WHERE id=?");
        return $stmt->execute($params);
    }

    public function delete(): bool {
        $db=Database::getInstance();
        $stmt=$db->prepare("DELETE FROM lessons WHERE id=?");
        return $stmt->execute([$this->id]);
    }

    public function toArray(): array {
        return ["id"=>$this->id,"course_id"=>$this->course_id,"folder_id"=>$this->folder_id,"title"=>$this->title,"description"=>$this->description,"file_path"=>$this->file_path,"file_type"=>$this->file_type,"file_size"=>$this->file_size,"original_filename"=>$this->original_filename,"uploaded_by"=>$this->uploaded_by,"created_at"=>$this->created_at,"updated_at"=>$this->updated_at];
    }
}
