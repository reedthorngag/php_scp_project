<?php

function check_set(array $arr,string ...$fields) {
    foreach ($fields as $field) {
        if (!isset($arr[$field])) return false;
    }
    return true;
}

function require_set(array $arr,string ...$fields) {
    if (!check_set($arr,...$fields)) {
        http_response_code(422);
        echo 'missing required field(s)!';
        die(0);
    }
}

function require_login() {
    if (!isset($_SESSION))
        session_start();

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        http_response_code(401);
        die(0);
    }
}

function require_level($level) {
    require_login();

    if ($_SESSION['level']>$level) {
        http_response_code(403);
        die(0);
    }
}

function has_access($level) {
    if (!isset($_SESSION))
        start_session();

    return $_SESSION['level']<=$level;
}

function subject_exists(DB $db,string $subject) {
    $result = $db->select('subjects',['subject'],'s',['subject'=>$subject])->num_rows;

    return $result;
}

function get_author(DB $db,string $subject) {
    $author = $db->select('subjects',['author'],'s',['subject'=>$subject]);

    if (!$author->num_rows) {
        return null;
    }

    return $author['author'];
}
?>