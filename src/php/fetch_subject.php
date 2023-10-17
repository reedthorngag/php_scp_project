<?php
include "errors.php";

$result = select('subjects',['*'],$_GET,'s','subject');
if (!$result) {
    http_response_code(404);
    die(0);
}

echo json_encode($result);

?>