"use strict";

function parseQueryString(queryString) {
    // Удаляем начальный вопросительный знак, если он есть
    const cleanedString = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    const pairs = cleanedString.split('&');

    // Преобразуем пары в ассоциативный массив (объект)
    const resultObject = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            resultObject[decodeURIComponent(key)] = value ? decodeURIComponent(value) : null; // Декодируем ключ и значение }
    }});
    return resultObject;
}

// Получение данных с сервера
let get_data = parseQueryString(window.location.search);

const url_server = "/server/server.php";
fetch(url_server + "?name=get_user_data&profile=" + get_data["user"])
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(result => {
    if (result["status"]) {
        document.querySelector(".full_name").textContent = result["second_name"] + " " + result["first_name"] + " " + result["third_name"];
        const cardsContainer = document.querySelector(".portfolio .cards");
        for (let i = 0; i < result["portfolio"].length; i++) {
            cardsContainer.innerHTML += `
                                            <div data-id="${result["portfolio"][i]["id"]}" class="card" data-hystmodal="#allSertif">
                                                <div class="card_inner flex">
                                                    <div class="top">
                                                        <div class="image" style="background: url('${result["portfolio"][i]["image"]}') center/cover;"></div>
                                                    </div>
                                                    <div class="bottom">
                                                        <h5 class="card_heading">${result["portfolio"][i]["name"]}</h5>
                                                        <p class="description">${result["portfolio"][i]["description"]}</p>
                                                    </div>
                                                </div>
                                            </div>
            `;
        }
    }
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

// Используем делегирование событий
document.querySelector(".portfolio .cards").addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card) {
        fetch(url_server + "?name=get_sertificate&id=" + card.getAttribute("data-id"))
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            document.getElementById("namePortfolio").textContent = result["diplom"]["title"];
            document.getElementById("image_full").setAttribute("src", result["diplom"]["image"]);
            document.querySelector("#description_portfolio span").textContent = result["diplom"]["description"];
            document.querySelector("#organization_owner span.nameOrg").textContent = result["diplom"]["organization"];
            document.querySelector("#organization_owner span.data").textContent = result["diplom"]["date"];
            document.querySelector("#hash_diplom span").textContent = result["diplom"]["id"];
            document.querySelector(".form_btn_1.btn").setAttribute("data-id", result["diplom"]["id"]);
        })
    }
});

document.getElementById("super_btn").addEventListener("click", (event) => {
    let id = event.target.getAttribute("data-id");
    fetch(url_server + "?name=check_diplom&id=" + id)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
        if (result["status"]) {
            alert(result["answer"]);
        } else {
            alert("Ошибка! " + result["answer"]);
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
})

const myModal = new HystModal({
    linkAttributeName: "data-hystmodal",
    // настройки (не обязательно), см. API
});
