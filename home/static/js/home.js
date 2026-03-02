let cards = document.querySelectorAll(".card")
localStorage.setItem("check", "lobby_page");


for (let card of cards){
    card.addEventListener(
        'click',
        () => {
            localStorage.setItem("selectedCategorieshome", card.dataset.value)
            location.replace("/select_tests")
        }
    )
}