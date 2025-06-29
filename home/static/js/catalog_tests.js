let createRooms = document.querySelectorAll(".loadroom")

// створення localstorage для відсліджування у якій вкладці зараз користувач
// recently-passed - недавнопройдені тести
// saved - збережені
// created - створені тести

let pageInfo = localStorage.getItem("pageindex")
if (!pageInfo){
    localStorage.setItem("pageindex", "created")
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        document.querySelectorAll('.text-filter a').forEach(link => {
        
        if (link.classList.contains(localStorage.getItem("pageindex"))){
                document.querySelector(".page-type").value = link.className
                link.classList.add("active")
            }
        })
    }
)

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
            localStorage.setItem('selectedCategoriesauth', postInputCategory.value);
            localStorage.setItem('selectedSortauth', postInputSort.value);

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
            }


            console.log(category.length)
            console.log(postInputSort.value, "soska")
            allCards = document.querySelectorAll(".card");
            if (category.length == 1){
                allCards.forEach(card => {
                    card.style.display = "flex";
                    document.querySelector(".sad-robot").classList.add("hidden")
                    document.querySelector(".error-text").classList.add("hidden")
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
        let inputText = localStorage.getItem("filter_data")
        if (inputText){
            console.log("piraty")
            document.querySelector(".findByname").textContent = inputText
            document.querySelector(".findByname").value = inputText
            document.querySelector(".lupa").click()
            localStorage.clear("filter_data")
        }

        let categoryFilter = localStorage.getItem("selectedCategoriesauth")
        if (categoryFilter){
            categoryFilter = categoryFilter.split("/")

            categoryFilter.forEach(el => {
                let idx = categoryFilter.indexOf(el)
                if (categoryFilter[idx] == "/"){
                    categoryFilter.splice(idx, 1)
                }
            })
        }else{
            categoryFilter = []
        }
        console.log(categoryFilter, 'sdcds')
        let sortData = localStorage.getItem("selectedSortauth")
        if (sortData){
            sortData = sortData.split("/")

            sortData.forEach(el => {
            let idx = sortData.indexOf(el)
            if (sortData[idx] == "/"){
                sortData.splice(idx, 1)
            }
        })
        }else{
            sortData = []
        }

        

        

        let allINput = Array.from(document.querySelectorAll(".input-check"))

        allINput.forEach(input => {
            console.log(input.value, 12)
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
        // e.preventDefault();

        document.querySelectorAll('.text-filter a').forEach(el => {
            el.classList.remove('active')
            this.classList.add('active')
            localStorage.setItem("pageindex", this.classList[0])
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



document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
});

