let opener = document.querySelector(".listener");
console.log(opener);
let sideBar = document.querySelector(".panel");

opener.addEventListener("click", () => {
    console.log(sideBar);
    console.log(sideBar.classList);
    if (sideBar.classList.contains("closed")){
        sideBar.classList.remove("closed");
        sideBar.classList.add("opened");
    }else if (sideBar.classList.contains("opened")){
        sideBar.classList.remove("opened");
        sideBar.classList.add("closed");
    };
    console.log(sideBar);
});