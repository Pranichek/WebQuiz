let categoruMenu = document.querySelector(".category-questions");
let categoryButton = document.querySelector(".button-open");

categoryButton.addEventListener(
    "click",
    (event) => {
        if (categoruMenu.style.display == "none") {
            categoruMenu.style.display = "flex";
        }
        else {
            categoruMenu.style.display = "none";
        }
    }
)