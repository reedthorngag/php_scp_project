<?php
include "errors.php";

require 'utils/utils.php';

require_set($_GET,'subject');

require 'db.php';

$result = $db->select('subjects',['*'],'s',['subject'=>$_GET['subject']]);
if (!$result) {
    http_response_code(404);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($result->fetch_assoc());

?>