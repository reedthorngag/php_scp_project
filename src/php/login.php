<?php
include "errors.php";

require "utils/utils.php";

var_dump($_POST);

if (check_set($_POST,'email','pass')){
    require "db.php";

    $result = $db->select('users',['username','pass','access'],'s',['email'=>$_POST['email']]);
    if ($result) {
        $result = $result->fetch_assoc();
        if (password_verify($_POST['pass'],$result['pass'])) {
            session_start();
            $_SESSION['logged_in'] = true;
            $_SESSION['level'] = $result['access'];
            $_SESSION['username'] = $result['username'];
            echo 'logged in!';
            die(0);
        }
    }
    //http_response_code(401);
    echo 'incorrect credentials!';
    return;
}

echo 'what?';

?>