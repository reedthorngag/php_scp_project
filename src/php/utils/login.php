<?php

function require_login() {
    start_session();

    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        http_status_code(401);
        die(0);
    }
}

function require_perms_level($level) {
    require_login();

    if ($_SESSION['level']>$level) {
        http_status_code(403);
        die(0);
    }
}
?>