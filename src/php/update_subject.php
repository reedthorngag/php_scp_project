<?php
include "errors.php";

require 'utils/utils.php';

require_set($_POST,'subject','type','image','class','description','containment_info');

require 'db.php';

$author = get_author($db,$_POST['subject']);

if (!$author) {
    http_response_code(404);
    echo 'subject does\'nt exist!';
    die(0);
}

session_start();

if (!has_access(3) && ($author!=$_SESSION['username'] || $_SESSION['level']>5)) {
    http_response_code(403);
    die(0);
}

$result = $db->update('subjects','sssssss',[
        'type'=>$_POST['type'],
        'image'=>$_POST['image'],
        'author'=>$_SESSION['username'],
        'community'=>'scp-foundation',
        'class'=>$_POST['class'],
        'description'=>$_POST['description'],
        'containment_info'=>$_POST['containment_info']
    ],'s',
    ['subject'=>$_POST['subject']]);

if (!$result) {
    http_response_code(422);
    echo 'invalid data!';
    die(0);
}

echo "done!";

?>