<?php
include "errors.php";

require 'utils/utils.php';

require_set($_GET,'subject');

require 'db.php';

$author = get_author($db,$_GET['subject']);

if (!$author) {
    http_response_code(404);
    die(0);
}

session_start();

if (!has_access(3) && $author!=$_SESSION['username']) {
    http_response_code(403);
    die(0);
}

$query = $db->conn->prepare('DELETE FROM subjects WHERE subject=?');
$query->bind_param('s',$_GET['subject']);

if (!$query->execute()) {
    http_response_code(500);
}

?>