let createRooms = document.querySelectorAll(".loadroom")

// створення localstorage для відсліджування у якій вкладці зараз користувач
// recently-passed - недавнопройдені тести
// saved - збережені
// created - створені тести



window.addEventListener('DOMContentLoaded', () => {
    let pageInfo = localStorage.getItem("pageindex");
    let cookieCheck = document.cookie.split('; ').find(row => row.startsWith('pageindex='));

    if (!pageInfo) {
        pageInfo = "created";
        localStorage.setItem("pageindex", pageInfo);
    }

    if (!cookieCheck) {
        document.cookie = `pageindex=${pageInfo}; path=/`;
        location.reload()
    }

    document.querySelectorAll('.text-filter a').forEach(link => {
        console.log(cookieCheck.split("=")[1], "lololo")
        if (link.classList.contains(cookieCheck.split("=")[1])) {
            link.classList.add("active");
            document.querySelector(".page-type").value = cookieCheck.split("=")[1];
        } else {
            link.classList.remove("active");
        }
    });
});


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

let allInputs = document.querySelectorAll(".input-check")
let postInputCategory = document.querySelector(".by_filter_category")
let postInputSort = document.querySelector(".by_filter_sort")
    
for (let elem of allInputs){
    elem.addEventListener(
        'click',
        () => {
            document.querySelector(".sad-robot").classList.add("hidden")
            document.querySelector(".error-text").classList.add("hidden")
            document.querySelector(".cards-outline").style.flexDirection = "row";
            document.querySelector(".cards-outline").style.gap = "1.25vw"


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

            let allCards = document.querySelectorAll(".card");
            let countValue = 0
            for (let card of allCards){
                if (category.includes(card.dataset.category)){       
                    card.style.display = "flex";
                    countValue += 1
                    
                }else{
                    card.style.display = "none";
                }
            }

            if (countValue == 0){
                document.querySelector(".sad-robot").classList.remove("hidden")
                document.querySelector(".error-text").classList.remove("hidden")
                document.querySelector(".cards-outline").style.flexDirection = "column";
                document.querySelector(".cards-outline").style.gap = "0"

            }


            console.log(category.length)
            console.log(postInputSort.value, "soska")
            allCards = document.querySelectorAll(".card");
            if (category.length == 1){
                allCards.forEach(card => {
                    card.style.display = "flex";
                    document.querySelector(".sad-robot").classList.add("hidden")
                    document.querySelector(".error-text").classList.add("hidden")
                    document.querySelector(".cards-outline").style.flexDirection = "row";
                    document.querySelector(".cards-outline").style.gap = "1.25vw"

                })
            }

            let sortBy = postInputSort.value
            allCards = document.querySelectorAll(".card");
            if (sortBy === "newest" || sortBy == ''){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.timecreated) - Number(a.dataset.timecreated)
                })
                let container = document.querySelector(".cards-outline")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "oldest"){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(a.dataset.timecreated) - Number(b.dataset.timecreated)
                })
                let container = document.querySelector(".cards-outline")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "questions"){
                let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.questions) - Number(a.dataset.questions)
                })
                let container = document.querySelector(".cards-outline")
                if (container) {
                    cardsArray.forEach(card => container.appendChild(card))
                }
            }else if(sortBy == "popular"){
               let cardsArray = Array.from(allCards)
                cardsArray.sort((a, b) => {
                    return Number(b.dataset.popular) - Number(a.dataset.popular)
                })
                let container = document.querySelector(".cards-outline")
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
        let categoryFilter = (localStorage.getItem("selectedCategories") || "").split("/");
        let sortData = (localStorage.getItem("selectedSort") || "").split("/");


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

        let allINput = Array.from(document.querySelectorAll(".input-check"))

        allINput.forEach(input => {
            if (categoryFilter.includes(input.value) || sortData.includes(input.value)){
                input.click()

            }
        })
    }
)

// --------------------------------------------------
// Знаходження тесту за ім'ям
function findResult(){
    let searchValue = document.querySelector(".findByname").value.toLowerCase();
    let allCards = document.querySelectorAll(".card");
    let count = 0
    document.querySelector(".sad-robot").classList.add("hidden")
    document.querySelector(".cards-outline").style.flexDirection = "row"
    document.querySelector(".cards-outline").style.gap = "1.25vw"
    document.querySelector(".error-text").classList.add("hidden")

    allCards.forEach(card => {
        let nameData = card.dataset.name;

        let testName = '';

        if (nameData) {
            testName = nameData.toLowerCase();
        }
        if (testName.includes(searchValue)) {
            card.style.display = "flex";
            count += 1
            
        } else {
            card.style.display = "none";
        }
    });

    if (count == 0){
        document.querySelector(".sad-robot").classList.remove("hidden")
        document.querySelector(".error-text").classList.remove("hidden")
        document.querySelector(".cards-outline").style.flexDirection = "column";
        document.querySelector(".cards-outline").style.gap = "0"
    }
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





document.querySelectorAll('.text-filter a').forEach(link => {
    link.addEventListener('click', function(e) {

        document.querySelectorAll('.text-filter a').forEach(el => {
            el.classList.remove('active')
            this.classList.add('active')
            localStorage.setItem("pageindex", this.classList[0])
            document.cookie = `pageindex=${this.classList[0]}; path=/;`;
        })
    });
});

const inputField = document.querySelector('.findByname');

inputField.addEventListener('input', () => {
    if (inputField.value.trim().length > 0) {
        inputField.style.backgroundColor = '#6e6e6e';
    } else {
        inputField.style.backgroundColor = '#7b7b7b';
    }
});




// убирать выбранные тесты из профиля
let heartButtons = document.querySelectorAll(".heart")

for (let button of heartButtons){
    button.addEventListener(
        'click',
        () => {
            let testId = button.dataset.value
            document.querySelector(".save-id").value = testId
           
            document.querySelector(".invisible-button").submit()
        }
    )
}