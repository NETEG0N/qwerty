"use strict"

// Кнопка выхода с аккаунта
const logout_btn = document.getElementById("logout_btn");

logout_btn.addEventListener("click", async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("id", "logout");

    let response = await fetch('/server/server.php', {
        method: 'POST',
        body: formData
    });

    let result = await response.json();
    if (result["status"]) {      
        console.log("Выход есть!");	
        window.location.reload();
    } else {
        console.error("Критическая ошибка со стороны сервера! Выйти с аккаунта не удалось!");
    }
})

// Открытие поп-окна добавить сертификат

const popup_window_btn = document.querySelector("#new_sertificate_btn");
const popup_window_btn_close = document.querySelector("#popup_close");

popup_window_btn.addEventListener("click", (event) => {
    document.querySelector(".popup_block").style.display = "block";
    document.querySelector(".popup_bg").style.display = "block";
    document.body.style.overflow = "hidden";
})

popup_window_btn_close.addEventListener("click", (event) => {
    document.querySelector(".popup_block").style.display = "none";
    document.querySelector(".popup_bg").style.display = "none";
    document.body.style.overflow = "auto";
})