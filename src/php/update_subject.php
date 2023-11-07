<?php
include "errors.php";

require 'utils/utils.php';

if (!check_set($_GET,'subject')) {
    http_response_code(422);
    die(0);
}

require 'db.php';
$db = new DB();

$result = $db->update('subjects','s',['subject'=>$_GET['subject']]);
if (!$result) {
    http_response_code(404);
    die(0);
}

echo "done!";

?>