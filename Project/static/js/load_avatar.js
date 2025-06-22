window.addEventListener(
    'DOMContentLoaded',
    () => {
        let AvatarImage = document.querySelector(".avatar")
        let finish = document.querySelector(".img-achiv")
        
        if (AvatarImage){
            // подгружаем размер картинки тот что установил пользователь
            AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
            AvatarImage.style.height = `${AvatarImage.dataset.size}%`;
            console.log(AvatarImage.dataset.size, "abradakadav ")

            document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        if (finish){
            // подгружаем размер картинки тот что установил пользователь
            finish.style.width = `${finish.dataset.size}%`;
            finish.style.height = `${finish.dataset.size}%`;
            console.log(finish.dataset.size, "abradakadav ")

            document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }
)