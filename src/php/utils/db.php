<?php

function insert($table,$data,$types,...$fields) {
    require_once "db_conn.php";

    $values = array();
    foreach ($fields as $field) $values[] = $data[$field];

    $query = $conn->prepare("INSERT INTO ".$table." (".implode(',',$fields).") VALUES (".substr(str_repeat(',?',count($fields)),1).")");
    $query->bind_param($types,...$values);

    if ($query->execute()) {
        return true;
    }
    return false;
}

function update($table,$data,$types,...$fields) {
    echo 'implement this';
    die(0);
}


function select($table,$select_fields,$data,$types,...$fields) {
    require_once "db_conn.php";

    $values = array();
    foreach ($fields as $field) $values[] = $data[$field];

    $query = $conn->prepare("SELECT ".implode(',',$select_fields)." FROM ".$table." WHERE ".implode('=? OR ',$fields)."=?");
    $query->bind_param($types,...$values);

    if ($query->execute()) {
        return $query->get_result()->fetch_assoc();
    }
    return false;
}
?>