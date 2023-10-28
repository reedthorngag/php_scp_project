<?php
include "errors.php";

require "utils/login.php";

// check they have creation perm, which is everyone except level 5 (level 4 is default)
require_perms_level(4);

require 'utils/utils.php';

if (!check_set($_POST,'subject','class','image','description','containment_info')) {
    http_response_code(422);
    die(0);
}


require "db.php";

if ($db->insert('subjects','sssss',['subject'=>$_POST['subject'],'class'=>$_POST['class'],'image'=>$_POST['image'],
        'description'=>$_POST['description'],'containment_info'=>$_POST['containment_info']])) {
    echo 'Success!';
    die(0);
}

http_response_code(422);
echo "You fucked up lol";

?>