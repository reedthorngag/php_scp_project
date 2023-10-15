<?php

if (!check_set($_POST,'email','pass')){
    http_status_code(422);
    die(0);
}

require "utils/db.php";
?>