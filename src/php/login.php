<?php

if (!check_set($_POST,'email','pass')){
    http_status_code(422);
    die(0);
}

require "utils/db.php";

$result = select('users',['password','access'],$_POST,'s','email');
if ($result) {
    if (password_verify($_POST['pass'],$result['password'])) {
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['level'] = $result['access'];
        http_status_code(200);
        die(0);
    }
}

http_status_code(401);

?>