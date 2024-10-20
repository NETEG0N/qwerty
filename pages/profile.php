<?php
    // Проверка на авторизацию
    session_start();
    if (isset($_SESSION["user"])) {
        $html_content = file_get_contents("components/profile_owner.html");
    }
    
    else {
        $html_content = file_get_contents("components/profile_use.html");
    }
    
    echo $html_content;
?>