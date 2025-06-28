let createRooms = document.querySelectorAll(".loadroom")

for (let button of createRooms){
    button.addEventListener(
        'click',
        () => {
            location.replace(`/mentor?id_test=${button.value}&room_code=${button.dataset.test}`)
        }
    )
}

let sortInputs = document.querySelectorAll(".sort-input")

for (let input of sortInputs){
    input.addEventListener(
        'click',
        () => {
            if (input.checked){
                sortInputs.forEach(inputCheck => {
                    if (inputCheck !== input){
                        inputCheck.checked = false
                    }
                })
            }
        }
    )
}

let allInputs = document.querySelectorAll(".input-set")
let postInputCategory = document.querySelector(".by_filter_category")
let postInputSort = document.querySelector(".by_filter_sort")
    
for (let elem of allInputs){
    elem.addEventListener(
        'click',
        () => {
            if (elem.checked){
                if (elem.classList.contains("category-input")){
                    postInputCategory.value += "/" + elem.value
                }else{
                    postInputSort.value = elem.value
                }
            }else{
                if (elem.classList.contains("category-input")){
                    let listInput = postInputCategory.value.split("/")
                    if(listInput.includes(elem.value)){
                        let index = listInput.indexOf(elem.value)
                        listInput.splice(index, 1)
                        listInput.forEach(el => {
                            let idx = listInput.indexOf(el)
                            if (listInput[idx] == "/"){
                                listInput.splice(idx, 1)
                            }
                        })
                        postInputCategory.value = listInput.join("/")
                    }
                }else{
                    postInputSort.value = ''
                }
            }
            // Save filter and sort state to localStorage
            localStorage.setItem('selectedCategories', postInputCategory.value);
            localStorage.setItem('selectedSort', postInputSort.value);

            let category = postInputCategory.value.split("/")
            category.forEach(el => {
                let idx = category.indexOf(el)
                if (category[idx] == "/"){
                    category.splice(idx, 1)
                }
            })

            let allCards = document.querySelectorAll(".test")
            for (let card of allCards){
                if (category.includes(card.dataset.category)){
                    card.style.display = "flex"
                }else{
                    card.style.display = "none"
                }
            }
            console.log(category.length)
            if (category.length <= 1){
                allCards.forEach(card => {
                    card.style.display = "flex";
                })
            }

            let sortBy = postInputSort.value
            if (sortBy === "newest" || sortBy == ''){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.timecreated) - Number(a.dataset.timecreated)
                })
                let container = document.querySelector(".tests-result")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "oldest"){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(a.dataset.timecreated) - Number(b.dataset.timecreated)
                })
                let container = document.querySelector(".tests-result")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "questions"){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.questions) - Number(a.dataset.questions)
                })
                let container = document.querySelector(".tests-result")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "popular"){
               let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.popular) - Number(a.dataset.popular)
                })
                let container = document.querySelector(".tests-result")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                } 
            }
        }
    )
}


window.addEventListener(
    'DOMContentLoaded',
    () => {
        let categoryFilter = localStorage.getItem("selectedCategories").split("/")
        let sortData = localStorage.getItem("selectedSort").split("/")

        categoryFilter.forEach(el => {
            let idx = categoryFilter.indexOf(el)
            if (categoryFilter[idx] == "/"){
                categoryFilter.splice(idx, 1)
            }
        })

        sortData.forEach(el => {
            let idx = sortData.indexOf(el)
            if (sortData[idx] == "/"){
                sortData.splice(idx, 1)
            }
        })

        let allINput =Array.from(document.querySelectorAll(".input-set"))

        allINput.forEach(input => {
            if (categoryFilter.includes(input.value) || sortData.includes(input.value)){
                input.click();
            }
        })
    }
)


// --------------------------------------------------
// Знаходження тесту за ім'ям

function findResult(){
    let Inputs = document.querySelectorAll(".input-set")
    Inputs.forEach(input => {
        let searchValue = document.querySelector(".findByname").value.toLowerCase();
        let allCards = document.querySelectorAll(".test");
        allCards.forEach(card => {
            let nameData = card.dataset.name;

            let testName = '';

            if (nameData) {
                testName = nameData.toLowerCase();
            }
            if (testName.includes(searchValue)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    })
}

document.querySelector(".lupa").addEventListener(
    'click',
    () => {
        findResult()
    }
)

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    findResult()
  }
});

// открыть закрыть окно фильтров
document.querySelector(".click-filter").addEventListener(
    'click',
    () => {
        if (document.querySelector(".filter-part").classList.contains("hide")){
            document.querySelector(".filter-part").classList.remove("hide")
            document.querySelector(".show-filter").style.transform = 'rotate(180deg)'
        }else{
            document.querySelector(".filter-part").classList.add("hide")
            document.querySelector(".show-filter").style.transform = 'rotate(0deg)'
        }
    }
)

document.querySelector(".click-sort").addEventListener(
    'click',
    () => {
        if (document.querySelector(".sort-part").classList.contains("hide-sort")){
            document.querySelector(".sort-part").classList.remove("hide-sort")
            document.querySelector(".show-sort").style.transform = 'rotate(180deg)'
        }else{
            document.querySelector(".sort-part").classList.add("hide-sort")
            document.querySelector(".show-sort").style.transform = 'rotate(0deg)'
        }
    }
)

let images = document.getElementsByClassName("img")

for (let img of images){
    img.addEventListener(
        'click',
        () => {
            console.log(12)
            if (img.classList.contains("click-sort") || img.classList.contains("click-filter")){
                if (img.classList.contains("click-sort")){
                    if (document.querySelector(".filter-part").classList.contains("hide")){
                        document.querySelector(".filter-part").classList.remove("hide")
                        document.querySelector(".show-filter").style.transform = 'rotate(180deg)'
                    }else{
                        document.querySelector(".filter-part").classList.add("hide")
                        document.querySelector(".show-filter").style.transform = 'rotate(0deg)'
                    }
                }
                else{
                    if (document.querySelector(".sort-part").classList.contains("hide-sort")){
                        document.querySelector(".sort-part").classList.remove("hide-sort")
                        document.querySelector(".show-sort").style.transform = 'rotate(180deg)'
                    }else{
                        document.querySelector(".sort-part").classList.add("hide-sort")
                        document.querySelector(".show-sort").style.transform = 'rotate(0deg)'
                    }
                }
            }
        }
    )
}