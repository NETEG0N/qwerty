<?php
    // Проверка на авторизацию
    session_start();
    if (isset($_SESSION["user"])) {
        header("Location: /index.php");
        exit; 
    }

    else {
        $html_content = file_get_contents("components/registration.html");
    }

    echo $html_content;
?>