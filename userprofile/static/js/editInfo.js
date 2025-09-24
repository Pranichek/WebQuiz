function loadIMage(){
    document.getElementById("file-upload").click();
    ChangeSize();
}

function submitForm() {
    document.getElementById("send-picture").submit();
}

// Функція для видалення фото
function DeletePhoto(){
    document.querySelector("#delete_form").submit();
}

function MakePhoto() {
    const video = document.getElementById("camera-stream");
    const takeBtn = document.getElementById("take-photo-btn");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.style.display = "block";
            takeBtn.style.display = "inline-block"; // показать кнопку "сфоткать"
        })
        .catch(err => {
            console.error("Помилка доступу до камери:", err);
        });
}

function TakePhoto() {
    const video = document.getElementById("camera-stream");
    const canvas = document.getElementById("photo-canvas");
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block"; // показать фото
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