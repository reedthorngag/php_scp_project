<?php
include "credentials.php";
$conn = new mysqli($host, $user, $pass, $db) or die("Connect failed: %s\n" . $conn->error);
?>
