let cards = document.querySelectorAll(".card")


for (let card of cards){
    card.addEventListener(
        'click',
        () => {
            localStorage.setItem("selectedCategorieshome", card.dataset.value)
            location.replace("/select_tests")
        }
    )
}