<?php
include "errors.php";

require "utils/utils.php";

if (check_set($_POST,'email','pass')){
    require "db.php";

    $result = $db->select('users',['*'],'s',['email'=>$_POST['email']]);
    if ($result) {
        $result = $result->fetch_assoc();
        http_response_code(500);
        echo 'here';
        die(0);
        if (password_verify($_POST['pass'],$result['pass'])) {
            session_start();
            $_SESSION['logged_in'] = true;
            $_SESSION['level'] = $result['access'];
            $_SESSION['username'] = $result['username'];
            echo $result['username'].'\n'.$result['level'];
            die(0);
        }
    }
    http_response_code(401);
    echo 'incorrect credentials!';
    return;
}

?>