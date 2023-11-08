<?php
include "errors.php";

require "utils/login.php";

// check they have creation perm, which is everyone except level 5 & 6 (level 4 is default)
require_level(4);

require 'utils/utils.php';

require_set($_POST,'subject','class','image','description','containment_info');

require_perms(4);

require "db.php";

if ($db->insert('subjects','sssss',['subject'=>$_POST['subject'],'author'=>$_SESSION['username'],
        'community'=>'scp-foundation','class'=>$_POST['class'],'image'=>$_POST['image'],
        'description'=>$_POST['description'],'containment_info'=>$_POST['containment_info']])) {
    echo 'Success!';
    die(0);
}

http_response_code(422);
echo "You fucked up lol";

?>