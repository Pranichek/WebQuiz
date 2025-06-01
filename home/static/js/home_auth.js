

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
        // console.log(inputData, "inputData")
        document.cookie = `filter_data=${inputData}; path=/;`
        let form = document.querySelector("#filter-form")
        form.submit();
    }
)

function checkEnterPress(event){
  if (event.key === 'Enter') {
    console.log(12)
    let input = document.querySelector(".filter-input")
    let inputData = input.value
    // console.log(inputData, "inputData")
    document.cookie = `filter_data=${inputData}; path=/;`
    let form = document.querySelector("#filter-form")
    form.submit();
  }
}