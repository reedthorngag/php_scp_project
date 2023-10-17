<?php
include "errors.php";

require "utils/utils.php";

if (!check_set($_POST,'email','pass')){
    //http_response_code(422);
    //die(0);
    return;
}

require "utils/db.php";

$result = select('users',['password','access'],$_POST,'s','email');
if ($result) {
    if (password_verify($_POST['pass'],$result['password'])) {
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['level'] = $result['access'];
        http_response_code(200);
        $conn->close();
        die(0);
    }
}
$conn->close();
http_response_code(401);

?>
<form method=POST>
    <input type=text name=email>
    <input type=password name=pass>
    <input type=submit>
</form>