<?php

$result = select('subjects',['*'],$_GET,'s','subject');
if (!$result) {
    http_response_code(404);
    $conn->close();
    die(0);
}

echo json_encode($result);

$conn->close();

?>