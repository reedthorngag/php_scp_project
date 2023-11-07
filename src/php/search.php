<?php
include "errors.php";

require 'utils/utils.php';
if (!check_set($_GET,'param','skip')) {
    http_response_code(422);
    die(0);
}

require 'db.php';

$query = $db->conn->prepare('SELECT * FROM subjects WHERE description LIKE ? OR subject LIKE ? LIMIT 10 OFFSET ?');
$query->bind_param('si','*'.$_GET['param'].'*',$_GET['skip']);
if (!$query->execute()) {
    http_response_code(422);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($query->get_result()->fetch_all(MYSQLI_ASSOC));

?>