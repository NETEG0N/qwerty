"use strict"

const url_server = "/server/server.php";
// Отправка формы авторизации
const log_form = document.getElementById("authorization_form");
const id_input = document.getElementById("id_input");
const password_input = document.getElementById("password_input");
const error_text = document.querySelector(".form_error_text");
log_form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (id_input.value != "" && password_input != "") {
        id_input.classList.remove("error_input");
        password_input.classList.remove("password_input");
        error_text.textContent = "";

        let data = new FormData();
        data.append("name", "user_login");
        data.append("id", id_input.value);
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
                window.location.reload();
                console.log(result);
            } else {
                alert.Error("Ошибка, не удалось войти в аккаунт!");
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        id_input.classList.add("error_input");
        password_input.classList.add("error_input");
        error_text.textContent = "*Ошибка, не все поля заполнены!";
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
