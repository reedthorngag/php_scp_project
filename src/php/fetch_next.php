<?php
include "errors.php";

require 'utils/utils.php';

require_set($_GET,'skip');

require 'db.php';

$query = $db->conn->prepare('SELECT * FROM subjects LIMIT 10 OFFSET ?');
$query->bind_param('i',$_GET['skip']);
if (!$query->execute()) {
    http_response_code(500);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($query->get_result()->fetch_all(MYSQLI_ASSOC));

?>