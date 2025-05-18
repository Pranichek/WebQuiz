// const buttonList = document.querySelectorAll(".change");
// let input;
// let p;

// for (let button of buttonList){
//     button.addEventListener('click', ()=>{
//         let button_id = button.id;
//         console.log(button_id);
//         input = document.querySelector(`#i-${button_id}`);
//         saveButton = document.querySelector(`#b-${button_id}`);
//         p = document.querySelector(`#p-${button_id}`);
//         p.style.display = "none";
//         button.type = "submit";
//         input.style.display = "block";
//         input.classList.add("change-input");
//         saveButton.style.display = "block"
//     })
// }


function loadIMage(){
    document.getElementById("file-upload").click();
    ChangeSize();
}

function submitForm() {
    document.getElementById("send-picture").submit();
}

// функция которая смотрит если польователь выбрал дефолтную картинку то показывается галочка
let defalutAvatars = document.querySelectorAll(".img")
let agreeds = document.querySelectorAll(".agree")

for (let image of defalutAvatars){
    image.addEventListener(
        'click',
        () => {
            let image_id = image.id;
            for (let agree of agreeds){
                if (agree.id == image_id){
                    agree.style.display = "block";
                }else{
                    agree.style.display = "none";
                }
            }
        }   
    )
}

// функция которая будет отправлять id дефолтной картинки в input и тем самым програма понимает какуб дефолтную картинку выбрал пользователь
let input_data = document.querySelector(".data_avatar")

for (let agree of agreeds){
    agree.addEventListener(
        'click',
        () => {
            if (agree.style.display == "block"){
                input_data.value = String(agree.id)
                document.getElementById("default_avatar").submit();
            }
        }
    )
}

// если пользователь нажал на кнопку загрузить картинку то открывалось окно редактирования картинки
window.addEventListener(
    'load',
    () => {
        const modal = document.querySelector(".confirm-changing");
        const style = window.getComputedStyle(modal);

        console.log(style.display)

        if (document.querySelector(".confirm-changing").classList.contains("show")){
            document.querySelector(".confirm-changing").style.display = "flex";
        }

        let AvatarImage = document.querySelector(".avatar")
        
        console.log("AvatarImage.dataset.size =", AvatarImage.dataset.size)
        // подгружаем размер картинки тот что установил пользователь
        AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
        AvatarImage.style.height = `${AvatarImage.dataset.size}%`;

    }
)

// фунция которая поосле обновлени страницы будет отправлять форму чтобы очистились данные и лишний раз окно со сменой автарки не ылезало
if (performance.navigation.type === 1) {
    console.log("Страница обновлена");
    document.querySelector(".back-image").submit();
}

// function ShowAva(){
//     let ava = document.querySelector(".confirm-changing")
//     console.log("da")
//     console.log("da")
//     if (ava.classList.contains(".show")){
//         ava.style.display = "none";
//     }else{
//         ava.style.display = 'flex';
//     }
// }

// функция изменения размера картинки
function ChangeSize() {
    const inputRange = document.querySelector(".size");
    const scale = inputRange.value / 100;

    const image = document.querySelector(".bg-image");
    const insideimage = document.querySelector(".inside");
    
    // задаем скрытому инпутому точно такое же значение как и у основного инпута
    // чтобы потом отправить его на сервер
    // и сервер знал какой размер картинки выбрал пользователь
    document.querySelector(".hide-size").value = inputRange.value;

    console.log("scale =", scale)
    image.style.transform = `translate(-50%, -50%) scale(${scale})`;
    insideimage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}


// функция применения картинки которую загрузил пользователь

function SubmitPhoto(){
    document.querySelector("#apply_image_form").submit();
}