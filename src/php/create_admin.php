<?php
include "errors.php";

require "utils/utils.php";
session_start();

if (check_set($_POST,'email','pass','perms','auth')) {
    require "credentials.php";
    if ($_POST['auth']==$auth) {
        $username = $_POST['email'];
        $password = $_POST['pass'];
        $permissions = $_POST['perms'];
        $password = password_hash($password, PASSWORD_DEFAULT);
        include 'db_conn.php';
        $query = $conn->prepare('SELECT email FROM users WHERE email=?');
        $query->bind_param('s',$username);
        if (!$query->execute()) {
            echo 'an unexpected error occured when checking if account username taken!';
            die(0);
        }
        $result = $query->get_result();
        if ($result->num_rows != 0) {
            echo 'user already exists!';
            die(0);
        }
        $query = $conn->prepare('INSERT INTO users (email,pass,access) VALUES (?,?,?)');
        $query->bind_param('ssi', $username, $password, $permissions);
        if (!$query->execute()) {
            echo 'an unexpected error occured while attempting to create account!';
            die(0);
        }
        $conn->close();
        echo 'created account!';
    } else {
        echo 'you dont have permission to do this action!';
    }
}
?>
<!DOCTYPE html>
<html>

<body>
    <form method="POST" href="/">
        <label>username:</label><input type=text name=email required autocomplete=off><br>
        <label>password:</label><input type=password name=pass required autocomplete=off><br>
        <label>permissions: </label><input type=number name=perms min="1" max="5" required><br>
        <label>auth: </label><input type=password name=auth required>
        <input type=submit value="create admin account">
    </form>
</body>

</html>