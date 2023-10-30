<?php
include "errors.php";

require 'utils/utils.php';
if (!check_set($_GET,'skip')) {
    http_response_code(422);
    die(0);
}

require 'db.php';

$query = $db->conn->prepare('SELECT * FROM subjects');
//$query->bind_param('i',$_GET['skip']);
if (!$query->execute()) {
    http_response_code(500);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($query->get_result()->fetch_all());

?>