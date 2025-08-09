const cookieBox = document.querySelector(".wrapper"),
buttons = document.querySelectorAll(".button");

const executeCodes = () => {
  //if cookie contains codinglab it will be returned and below of this code will not run
  if (document.cookie.includes("planet.quiz")) return;
  cookieBox.classList.add("show");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      cookieBox.classList.remove("show");
      //if button has acceptBtn id
      if (button.id == "acceptBtn") {
        //set cookies for 1 month. 60 = 1 min, 60 = 1 hours, 24 = 1 day, 30 = 30 days
        document.cookie = "cookieBy=planet.quiz; max-age=" + 60 * 60 * 24 * 30;
      }
    });
  });
};
//executeCodes function will be called on webpage load
window.addEventListener("load", executeCodes);


document.addEventListener("DOMContentLoaded", () => {
    const cookieModal = document.getElementById("cookieModal");
    const acceptBtn = document.getElementById("acceptBtn");
    const declineBtn = document.getElementById("declineBtn");

    // Проверка, есть ли уже cookie
    if (!document.cookie.includes("cookieBy=planet.quiz")) {
        cookieModal.classList.add("show");
    }

    // Принять cookies
    acceptBtn.addEventListener("click", () => {
        document.cookie = "cookieBy=planet.quiz; max-age=" + 60 * 60 * 24 * 30;
        cookieModal.classList.remove("show");
    });

    // Отклонить cookies
    declineBtn.addEventListener("click", () => {
        cookieModal.classList.remove("show");
    });

    // Очистка localStorage при клике на историю тестов
    const createdTestLink = document.querySelector(".created-test");
    if (createdTestLink) {
        createdTestLink.addEventListener("click", () => {
            localStorage.removeItem("selectedCategories");
            localStorage.removeItem("selectedSort");
        });
    }
});
