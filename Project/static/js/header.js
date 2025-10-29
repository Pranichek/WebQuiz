let header = document.querySelector(".js-header")
let headerH = document.querySelector(".js-header").clientHeight


document.onscroll = function() {
    let scroll = window.scrollY

    if (scroll > 0){
        header.classList.add("fixed")
    }else{
        header.classList.remove("fixed")
    }
}