<?php
include "errors.php";

require 'utils/utils.php';

require_set($_GET,'param','skip');

require 'db.php';

$query = $db->conn->prepare('SELECT * FROM subjects WHERE description LIKE ? OR subject LIKE ? LIMIT 10 OFFSET ?');
$a = '*'.$_GET['param'].'*';
$query->bind_param('ssi',$a,$a,$_GET['skip']);
if (!$query->execute()) {
    http_response_code(422);
    die(0);
}

header('Content-Type: application/json');
echo json_encode($query->get_result()->fetch_all(MYSQLI_ASSOC));

?>