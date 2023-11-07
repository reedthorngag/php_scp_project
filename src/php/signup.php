<?php

if(!check_set($_POST,'email','password')) {
    http_response_code(422);
    die(0);
}

require 'db.php';

if ($db->select('users',['email'],'s',['email'=>$_POST['email']])->num_rows != 0) {
    http_response_code(409);
    echo 'email already in use!';
}

if (!$db->insert('users','ss',['email'=>$_POST['email'],'password'=>password_hash($_POST['password'])])) {
    http_response_code(422);
    echo 'user creation failed, probably your fault.';
}

?>