<?php
include "errors.php";

require "utils/utils.php";

if (check_set($_POST,'email','pass')){
    require "db.php";

    $result = $db->select('users',['pass','access'],'s',['email'=>$_POST['email']]);
    if ($result) {
        $result = $result->fetch_assoc();
        if (password_verify($_POST['pass'],$result['pass'])) {
            session_start();
            $_SESSION['logged_in'] = true;
            $_SESSION['level'] = $result['access'];
            http_response_code(200);
            echo 'logged in!';
            die(0);
        }
    }
    http_response_code(401);
    echo 'incorrect credentials!';
    return;
}

?>
<form method=POST>
    <input type=text name=email>
    <input type=password name=pass>
    <input type=submit>
</form>