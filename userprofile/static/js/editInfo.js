const buttonList = document.querySelectorAll(".change");
let input;
let p;

for (let button of buttonList){
    button.addEventListener('click', ()=>{
        let button_id = button.id;
        console.log(button_id);
        input = document.querySelector(`#i-${button_id}`);
        saveButton = document.querySelector(`#b-${button_id}`);
        p = document.querySelector(`#p-${button_id}`);
        p.style.display = "none";
        button.type = "submit";
        input.style.display = "block";
        input.classList.add("change-input");
        saveButton.style.display = "block"
    })
}

function loadIMage(){
    document.getElementById("file-upload").click();
}

function submitForm() {
    document.getElementById("send-picture").submit();
}


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


window.addEventListener(
    'load',
    () => {
        const modal = document.querySelector(".confirm-changing");
        const style = window.getComputedStyle(modal);

        console.log(style.display)

        if (document.querySelector(".confirm-changing").classList.contains("show")){
            document.querySelector(".confirm-changing").style.display = "flex";
        }
    }
)

if (performance.navigation.type === 1) {
    console.log("Страница обновлена (F5 или кнопка)");
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

