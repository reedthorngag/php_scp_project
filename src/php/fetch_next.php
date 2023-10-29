<?php
include "errors.php";

require 'db.php';

if (!check_set($_GET,'skip')) {
    http_response_code(422);
    die(0);
}

$query = $db->conn->prepare('SELECT * FROM subjects LIMIT 10 SKIP ?');
$query->bind_param('i',$_GET['skip']);
if (!$query->execute()) {
    http_response_code(500);
    die(0);
}

echo json_encode($query->get_result());

?>