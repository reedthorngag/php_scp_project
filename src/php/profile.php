<?php
include "errors.php";

require 'utils/utils.php';

require 'db.php';

require_login();

start_session();

$result = $db->select('users',['username','email'],'s',['username'=>$_SESSION['username']]);
if (!$result) {
    http_response_code(404);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($result->fetch_assoc());

?>