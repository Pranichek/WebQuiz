

function Profile(){
    document.querySelector(".nick").click();
}

window.addEventListener(
    'load',
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
        document.querySelector(".search-filter-link").href = `/filter_page?input_data=${inputData}`
        document.querySelector(".search-filter-link").click();
    }
)

// Проверяем на нажатие enter 
let input = document.querySelector(".filter-input");

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    let inputData = input.value;
    localStorage.setItem("filter_data", inputData);
    document.querySelector(".search-filter-link").href = `/filter_page?input_data=${inputData}`;
    document.querySelector(".search-filter-link").click();
  }
});