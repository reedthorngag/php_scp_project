<?php
include "errors.php";

require "utils/utils.php";

require_set($_POST,'username','email','pass');

require 'db.php';

if ($db->select('users',['username'],'s',['username'=>$_POST['username']])->num_rows != 0) {
    http_response_code(409);
    echo 'username taken!';
    die(0);
}

if ($db->select('users',['email'],'s',['email'=>$_POST['email']])->num_rows != 0) {
    http_response_code(409);
    echo 'email already in use!';
    die(0);
}

if (!$db->insert('users','ss',['username'=>$_POST['username'],'email'=>$_POST['email'],'pass'=>password_hash($_POST['pass'],PASSWORD_DEFAULT)])) {
    http_response_code(422);
    echo 'user creation failed, probably your fault.';
}

?>