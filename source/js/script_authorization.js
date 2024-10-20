"use strict"

// Форма авторизации
const login_form = document.getElementById("login_form");

login_form.login.addEventListener("blur", (event) => {
    if (login_form.login.value == "") {
        login_form.login.classList.add("input_error");
        document.querySelector(".text_error").innerHTML = "* Не все поля заполнены!";
    } else {
        login_form.login.classList.remove("input_error");
        document.querySelector(".text_error").innerHTML = "";
    }
})

login_form.password.addEventListener("blur", (event) => {
    if (login_form.password.value == "") {
        login_form.password.classList.add("input_error");
        document.querySelector(".text_error").innerHTML = "* Не все поля заполнены!";
    } else {
        login_form.password.classList.remove("input_error");
        document.querySelector(".text_error").innerHTML = "";
    }
})

login_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (login_form.login.value != "" && login_form.password.value != "") {
        let formData = new FormData();
        formData.append('id', 'login_form');
        formData.append('login', String(login_form.login.value));
        formData.append('password', String(login_form.password.value));

        let response = await fetch('/server/server.php', {
            method: 'POST',
            body: formData
        });

        let result = await response.json();
        if (result["status"]) {      	
            window.location.href = "/index.php";
        } else {
            document.querySelector(".text_error").innerHTML = "* " + (result["error"] == "0x0") ? "ID или пароль неверен!" : "Ошибка со стороны сервера";
            login_form.login.classList.add("input_error");
            login_form.password.classList.add("input_error");
        }

    } else {
        if (login_form.login.value == "") {
            login_form.login.classList.add("input_error");
        } else {
            login_form.login.classList.remove("input_error");
        }

        if (login_form.password.value == "") {
            login_form.password.classList.add("input_error");
        } else {
            login_form.password.classList.remove("input_error");
        }

        document.querySelector(".text_error").innerHTML = "* Не все поля заполнены!";
    }
})