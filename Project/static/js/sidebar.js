let opener = document.querySelector(".listener");
let sideBar = document.querySelector(".panel");

opener.addEventListener("click", () => {
    if (sideBar.classList.contains("closed")){
        sideBar.classList.remove("closed");
        sideBar.classList.add("opened");
    }else if (sideBar.classList.contains("opened")){
        sideBar.classList.remove("opened");
        sideBar.classList.add("closed");
    };
});

document.addEventListener("click", (event) => {
    if (
        sideBar.classList.contains("opened") &&
        !sideBar.contains(event.target) &&
        !opener.contains(event.target)
    ) {
        sideBar.classList.remove("opened");
        sideBar.classList.add("closed");
    }
});