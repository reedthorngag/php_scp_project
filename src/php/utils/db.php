<?php

function insert($table,$data,$types,...$fields) {
    require_once "db_conn.php";

    $values = [];
    foreach ($fields as $field) $values += $data[$field];

    $query = $conn->prepare("INSERT INTO ".$table." (".implode(',',$fields).") VALUES (".substr(str_repeat(',?',count($fields)),1).")");
    $query->bind_param($types,...$fields);

    if ($query->execute()) {
        return true;
    }
    return false;
}
?>