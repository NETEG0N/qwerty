<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Главная | Aurora Profile</title>
        <link rel="stylesheet" type="text/css" href="/src/css/base.css">
        <link rel="stylesheet" type="text/css" href="/src/css/main-page.css">
        <link rel="stylesheet" type="text/css" href="/src/css/form-kit.css">
        <link rel="stylesheet" type="text/css" href="/src/css/font.css">
    </head>
    <?php
            // Проверка на авторизацию
            session_start();
            if (isset($_SESSION["user"])) {
                $html_content = file_get_contents("pages/components/main-login.html");
            }

            else {
                $html_content = file_get_contents("pages/components/main-nologin.html");
            }

            echo $html_content;
    ?>
</html>