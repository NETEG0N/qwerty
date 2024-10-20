"use strict"

const url_server = "/server/server.php";

// Отправка формы регистрации
const reg_form = document.getElementById("registration_form");
const first_name_input = document.getElementById("first_name_input");
const second_name_input = document.getElementById("second_name_input");
const third_name_input = document.getElementById("third_name_input");
const email_input = document.getElementById("email_input");
const phone_input = document.getElementById("phone_input");
const password_input = document.getElementById("password_input");
const password_check_input = document.getElementById("password_check_input");
const error_text = document.querySelector(".form_error_text");
reg_form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (first_name_input != "" && second_name_input.value != "" && third_name_input.value != "" && email_input.value != "" && phone_input.value != "" && password_input.value != "" && password_check_input.value != "" && password_input.value == password_check_input.value) {
        first_name_input.classList.remove("error_input");
        second_name_input.classList.remove("error_input");
        third_name_input.classList.remove("error_input");
        email_input.classList.remove("error_input");
        phone_input.classList.remove("error_input");
        password_input.classList.remove("error_input");
        password_check_input.classList.remove("error_input");
        error_text.textContent = "";

        let data = new FormData();
        data.append("name", "user_reg");
        data.append("first_name", first_name_input.value);
        data.append("second_name", second_name_input.value);
        data.append("third_name", third_name_input.value);
        data.append("email", email_input.value);
        data.append("phone", email_input.value);
        data.append("password", password_input.value);
        fetch(url_server, {
            body: data,
            method: "POST"
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            if (result["status"]) {
                alert("Вы успешно зарегистрировались! " + result["id"]);
                window.location.href = "/pages/authorization.php";
            } else {
                alert.Error("Ошибка, не удалось войти в аккаунт!");
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        if (first_name_input == "" || second_name_input.value == "" || third_name_input.value == "" || email_input.value == "" || phone_input.value == "") {
            first_name_input.classList.add("error_input");
            second_name_input.classList.add("error_input");
            third_name_input.classList.add("error_input");
            email_input.classList.add("error_input");
            phone_input.classList.add("error_input");
            password_input.classList.add("error_input");
            password_check_input.classList.add("error_input");
            error_text.textContent = "*Ошибка, не все поля заполнены!";
        }

        if (password_input.value != password_check_input.value) {
            password_input.classList.add("error_input");
            password_check_input.classList.add("error_input");
            password_input.value = "";
            password_check_input.value = "";
            error_text.textContent = "*Введённые пароли не совпадают!";
        }
    }
})

// Подключение анимированного фона к странице
VANTA.GLOBE({
    el: ".interactive_bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: "#4e00cc"
});