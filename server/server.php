<?php
    
    require_once("db.php");
    require 'vendor/autoload.php';
    use Web3\Web3; 
    use Web3\Contract; 
    use Web3\Providers\HttpProvider; 
    use GuzzleHttp\Client; 

    if ($db == true){
        if (!empty($_POST) && $_POST["name"] == "user_login") {
            // Авторизация
            $result = mysqli_query($db, "SELECT * FROM users WHERE login='".$_POST["id"]."' && password='".$_POST["password"]."';");
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if (mysqli_num_rows($result) == 1) {
                foreach ($rows as $row) {
                    echo json_encode(["status" => true]);
                }   
                session_start();
                $_SESSION["user"] = ["id" => $row["login"], "first_name" => $row["first_name"], "second_name" => $row["last_name"], "third_name" => $row["patronymic"], "email" => $row["mail"], "phone" => $row["phone"]];
            }

            else if (mysqli_num_rows($result) == 0) {
                echo json_encode(["status" => false, "error" => "0x0"]);
            }

            else {
                echo json_encode(["status" => false, "error" => "0x1"]);
            }
        }

        if (!empty($_GET) && $_GET["name"] == "log_status") {
            
            session_start();
            if (isset($_SESSION["user"])) {
              echo json_encode(["status" => true, "id" => "".$_SESSION["user"]["id"], "first_name" => "".$_SESSION["user"]["first_name"], "second_name" => "".$_SESSION["user"]["second_name"]]);
            } else {
              echo json_encode(["status" => false]);
            }
        }

        if (!empty($_POST) && $_POST["name"] == "user_logout") {
            // Выход с аккаунта
            session_start();
            unset($_SESSION["user"]);
            if (empty($_SESSION)) {
                echo json_encode(["status" => true]);
            } else {
                echo json_encode(["status" => false]);
            }
        }

        if (!empty($_POST) && $_POST["name"] == "user_reg") {
            //регистрация
            $result = mysqli_query($db, "SELECT * FROM users WHERE mail='".$_POST["email"]."' || phone='".$_POST["phone"]."';");
            
            if (mysqli_num_rows($result) == 1 || mysqli_num_rows($result) == 2) {
                echo json_encode(["status" => false, "error" => "exists"]);  
            }

            else if (mysqli_num_rows($result) == 0) {
                if (strlen($_POST["password"]) <= 50) {
                    $result = mysqli_query($db, "SELECT login FROM users ORDER BY id DESC LIMIT 1;");
                    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
                    if (mysqli_num_rows($result) == 1) {
                        foreach ($rows as $row) {
                            $last_login = $row["login"] + 1;
                        } 
                    }
                    $result = mysqli_query($db, "INSERT INTO users (first_name, last_name, patronymic, mail, login, password, phone) VALUES ('".$_POST["first_name"]."', '".$_POST["second_name"]."', '".$_POST["third_name"]."', '".$_POST["email"]."', ".$last_login.", '".$_POST["password"]."', '".$_POST["phone"]."');");
                    if ($result == 1) {
                        echo json_encode(["status" => true, "id" => "".$last_login]);
                    }
                    else {
                        echo json_encode(["status" => false, "error" => "хз"]);
                    }
                } else {
                    echo json_encode(["status" => false, "error" => ">50"]);
                }
            }

            else {
                echo json_encode(["status" => false, "error" => "хз"]);
            }
        }

        if (!empty($_POST) && $_POST["name"] == "update_profile_physical") {
            // Редактирование цпфл
            $result = mysqli_query($db, "UPDATE users SET first_name = '".$_POST["first_name"]."', last_name = '".$_POST["last_name"]."', patronymic = '".$_POST["patronymic"]."', mail = '".$_POST["mail"]."', phone = '".$_POST["phone"]."' WHERE users.id = '".$_POST["id"]."';");

            if ($result == 1) {
                echo json_encode(["status" => true]);  
            }

            else {
                echo json_encode(["status" => false, "error" => "хз"]);
            }
        }

        if (!empty($_POST) && $_POST["name"] == "update_profile_legal") {
            // Редактирование цпюл
            $result = mysqli_query($db, "UPDATE organizations SET name_organization = '".$_POST["name_organization"]."', mail = '".$_POST["mail"]."', phone = '".$_POST["phone"]."', number_wallet = '".$_POST["number_wallet"]."', user_id = '".$_POST["user_id"]."' WHERE organizations.id = '".$_POST["id"]."';");
            
            // не знаю на счёт users_id 

            if ($result == 1) {
                echo json_encode(["status" => true]);  
            }

            else {
                echo json_encode(["status" => false, "error" => "хз"]);
            }
        }

        if (!empty($_GET) && $_GET["name"] == "get_user_data") {
            $result = mysqli_query($db, "SELECT * FROM users WHERE login='1';");
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if (mysqli_num_rows($result) == 1) {
                foreach ($rows as $row) {
                    $result2 = mysqli_query($db, "SELECT * FROM documents WHERE users_id='".$row["id"]."';");
                    $rows2 = mysqli_fetch_all($result2, MYSQLI_ASSOC);
                    $row["portfolio"] = $rows2;  
                    echo json_encode(["status" => true, "id" => $row["id"], "first_name" => $row["first_name"], "second_name" => $row["last_name"], "third_name" => $row["patronymic"], "portfolio" => $row["portfolio"]]);
                }   
            }

        }
        
        if (!empty($_GET) && $_GET["name"] == "get_sertificate") {

            $result = mysqli_query($db, "SELECT * FROM documents WHERE id='".$_GET["id"]."';");
            $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
            foreach ($rows as $row) { 
                $result = mysqli_query($db, "SELECT * FROM organizations WHERE id='".$row["organizations_id"]."';");
                $rows2 = mysqli_fetch_all($result, MYSQLI_ASSOC);
                foreach ($rows2 as $row2) {
                    echo json_encode(["status" => true, "diplom" => ["id" => $row["id"], "title" => $row["name"], "description" => $row["description"], "organization" => $row2["name_organization"], "date" => $row["data"], "image" => $row["image"]]]);
                }   
            }   
        }

        if (!empty($_GET) && $_GET["name"] == "check_diplom") {

            // сверка eth и бд
            // Подключаемся к Ethereum узлу через Infura 
            $holeskyUrl = 'https://1rpc.io/holesky'; // Замените на ваш URL Infura 
            $web3 = new Web3(new HttpProvider($holeskyUrl, 10)); // Таймаут в секундах 
            
            // Адрес контракта и ID токена 
            $contractAddress = '0x04ef07f927d115e44492f86a0b0cbbccbd87c9b8'; // Вставьте адрес контракта NFT 
            $tokenId = $_GET["id"]; // Вставьте ID токена 
            
            // ABI контракта ERC-721 (минимальный ABI для взаимодействия с функцией tokenURI) 
            $abi = json_encode([ 
                [ 
                    "constant" => true, 
                    "inputs" => [["name" => "_tokenId", "type" => "uint256"]], 
                    "name" => "tokenURI", 
                    "outputs" => [["name" => "", "type" => "string"]], 
                    "type" => "function" 
                ] 
            ]); 
            
            // Инициализируем контракт 
            $contract = new Contract($web3->provider, $abi); 
            $contract->at($contractAddress)->call('tokenURI', $tokenId, function ($err, $tokenUri) { 
                if ($err !== null) { 
                    echo json_encode(["status" => false, "error" => "Ошибка при получении URI токена"]); 
                    return; 
                } 
            
                $url = ''.$tokenUri[0];
                $data = file_get_contents($url);

                if ($data === FALSE) {
                    echo json_encode(["status" => false, "error" => "Ошибка при получении данных."]);
                } else {
                    $result = mysqli_query($db, "SELECT name, data, image, users_id, organizations_id FROM documents WHERE id=".$_GET["id"].";");
                    $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
                    
                    if (mysqli_num_rows($result) == 1) {
                        foreach ($rows as $row) {
                            
                            if ((json_decode(json_encode($row))) == json_decode($data)) {
                                echo json_encode(["status" => true, "text" => "мы проверили, всё совпало"]);
                            }
                            else {
                                echo json_encode(["status" => false, "error" => "мы проверили, что-то не совпало"]);
                            }
                        }   
                    }
                }
            });
            
        }
    }
?>

