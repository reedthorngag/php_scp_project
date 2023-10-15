<?php

function check_set($arr,...$vars) {
    foreach ($vars as $var) {
        if (!isset($arr[$var])) return false;
    }
    return true;
}
?>