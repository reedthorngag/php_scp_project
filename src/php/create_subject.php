<?php
include "errors.php";

require "utils/login.php";

// check they have creation perm, which is everyone except level 5
//require_perms_level(4);

require 'utils/utils.php';

if (!check_set($_POST,'subject','class','image','description','containment_info')) {http_response_code(422);}


require "utils/db.php";

if (insert('subjects',$_POST,'sssss','subject','class','image','description','containment_info')) {
    echo 'Success!';
    $conn->close();
    die(0);
}

http_response_code(422);
echo "You fucked up lol";
$conn->close();

?>