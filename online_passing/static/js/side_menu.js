document.addEventListener("DOMContentLoaded", function() {
    const openMenuBtn = document.getElementById("openMenuBtn")
    const closeMenuBtn = document.getElementById("closeMenuBtn")
    const sideMenu = document.querySelector(".side-menu")

    if (openMenuBtn && closeMenuBtn && sideMenu) {
        openMenuBtn.addEventListener("click", function() {
            sideMenu.classList.add("active-menu")
        })

        closeMenuBtn.addEventListener("click", function() {
            sideMenu.classList.remove("active-menu")
        })
    }
})

