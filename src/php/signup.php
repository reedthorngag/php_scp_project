<?php

if(!check_set($_POST,'email','password')) {
    http_response_code(422);
    die(0);
}



?>