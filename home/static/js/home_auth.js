

function Profile(){
    document.querySelector(".nick").click();
}

localStorage.removeItem("selectedSortauth")
localStorage.removeItem("selectedCategoriesauth")

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let AvatarImage = document.querySelector(".avatar")
        
        console.log("AvatarImage.dataset.size =", AvatarImage.dataset.size)
        // подгружаем размер картинки тот что установил пользователь
        AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
        AvatarImage.style.height = `${AvatarImage.dataset.size}%`;

        document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
)

let submitFilter = document.querySelector(".submit-filter")

submitFilter.addEventListener(
    'click',
    () => {
        let input = document.querySelector(".filter-input")
        let inputData = input.value
        localStorage.setItem("filter_data", inputData)
        location.replace("/catalog_tests")
        // document.querySelector(".search-filter-link").href = `/filter_page?input_data=${inputData}`
        // document.querySelector(".search-filter-link").click();
    }
)

// Проверяем на нажатие enter 
let input = document.querySelector(".filter-input");

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    let inputData = input.value;
    localStorage.setItem("filter_data", inputData);
    location.replace("/catalog_tests")
    // document.querySelector(".search-filter-link").href = `/filter_page?input_data=${inputData}`;
    // document.querySelector(".search-filter-link").click();
  }
});

const cardsFloors = document.querySelectorAll(".cards")

for (let floor of cardsFloors){
    let childrenFloor = floor.children;
    for (let i = 0; i < childrenFloor.length; i++) {
        const colors = ['#D6E8FE', '#F2FBFF', '#E7F2FF', '#F5E9FF'];
        childrenFloor[i].style.backgroundColor = colors[i % colors.length];
    }
}


let showmores = document.querySelectorAll(".show-more-link")

for (let show of showmores){
    show.addEventListener(
        'click',
        () => {
            localStorage.setItem("selectedCategoriesauth", show.dataset.value)
            location.replace("/catalog_tests")
        }
    )
}