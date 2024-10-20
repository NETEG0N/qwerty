"use strict"

// Проверка на авторизированность
const url_server = "/server/server.php"
fetch(url_server + "?name=log_status")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(result => {
    if (result["status"]) {
        document.getElementById("forFirstName").textContent = result["first_name"];
    }
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

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

// Нажатие кнопки - Создать цифровой профиль
const onRegistration = () => {
    window.location.href = "/pages/registration.php";
}

// Нажатие кнопки - Войти
const onAuthorization = () => {
    window.location.href = "/pages/authorization.php";
}

// Нажатие кнопки - Выйти
const logout = () => {
    let data = new FormData();
    data.append("name", "user_logout");
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
        } else {
            alert.Error("Не удалось выйти с аккаунта!")
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Нажатие кнопки - Перейти на платформу
const onProfile = () => {
    window.location.href = "/pages/chto-to.php";
}