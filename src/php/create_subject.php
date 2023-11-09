<?php
include "errors.php";

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