const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const inputImg = document.getElementById("imgInput");
const pk = document.getElementById("pk").textContent;
let answers;
let questions;
let timeC;
let imageC;
let validAnswersFlag = false;

function buttonColorChanging(){
    if (button.type == "button"){
        button.classList.add("grey");
    }
}

function answerScanning(){
    validAnswersFlag = true;
    let filledCount = 0;

    for (let input of answerInputList){
        if (input.checkVisibility()){
            if (input.value.trim() === ""){
                validAnswersFlag = false;
            } else {
                filledCount++;
            }
        }
    }

    if (!validAnswersFlag || filledCount < 2 || question.value.trim() === ""){
        button.type = "button";
        button.classList.add("grey");
        button.classList.remove("purple");
    } else {
        button.type = "submit";
        button.classList.remove("grey");
        button.classList.add("purple");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buttonColorChanging();
    answerScanning();
});
document.addEventListener("click", () => {
    buttonColorChanging();
    answerScanning();
});
document.addEventListener("keydown", () => {
    buttonColorChanging();
});
document.addEventListener("keyup", () => {
    answerScanning();
});

button.addEventListener("click", () => {
    if (button.type !== "submit") return;  

    for (let input of answerInputList){
        if (input.checkVisibility()){
            if (input.value != ""){
                if (input.classList.contains("correct")){
                    answers += `(?%+${input.value}+%?)`;
                } else {
                    answers += `(?%-${input.value}-%?)`;
                }
            }
        }
    }

    answers = answers?.replace("undefined", "").replace("answers", "").replace("null", "");

    questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
    questionCookie[pk] = question.value;
    questionCookie = questionCookie.join("?%?");

    timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
    timeC = timeP.dataset.time.replace("⏱ ", "").replace(" ˅", "");
    timeCookie[pk] = timeC;
    timeCookie = timeCookie.join("?#?");

    answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
    answerCookie[pk] = answers;
    answerCookie = answerCookie.join("?@?");

    document.cookie = `questions=${questionCookie}; path=/;`;
    document.cookie = `time=${timeCookie}; path=/;`;
    document.cookie = `answers=${answerCookie}; path=/;`;
    answers = null;
});

// ⏱ Встановлення тексту таймера
window.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#time").dataset.time !== "not"){
        if (parseInt(document.querySelector("#time").dataset.time) < 60){
            document.querySelector("#time").textContent = `⏱ ${document.querySelector("#time").dataset.time} секунд ˅`;
        }else{
            document.querySelector("#time").textContent = `⏱ ${parseInt(document.querySelector("#time").dataset.time) / 60} хвилин ˅`;
        }
    }else{
        document.querySelector("#time").textContent = `⏱ Без часу ˅`;
    }
});


// Файл який перевіряє яка відповдь є правильною чи ні

// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer");
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle");
// Беремо усі кружечки у лівому куту кожної відповіді(блоку з відповіддю)
let detectorList = document.querySelectorAll(".detector");
// зміна де зберігаються дані правильних варіантів відповідей через localstorage
let rightblock;

// Робимо перебір по списку з кружечками
for (let detector of detectorList){
    // Перевірямо чи натиснули на кружечок(додали подію)
    detector.addEventListener("click", () =>{
        // Робимо перебір по списку з відповідями
        // Якщо натиснули на кружечок, то перевіряємо чи є у відповіді клас correct
        // Якщо є, то видаляємо клас correct у відповіді
        // Якщо немає, то добавляємо клас correct у відповіді
        for (let input of inputList){
            if (input.id == detector.id){
                for (let tick of tickCircleList){
                    if (tick.id == detector.id){
                        if (input.classList.contains("correct")){
                            let checkCorrectList = document.querySelectorAll(".correct");
                            console.log(checkCorrectList, "bugaga")
                            if (checkCorrectList.length > 1){
                                console.log("correct:", input.id);
                                tick.style.display = "none";
                                input.classList.remove("correct");
                            }
                        }else {
                            tick.style.display = "flex";
                            input.classList.add("correct");
                        }
                    }
                }
            }
        }
    })
}


window.addEventListener(
    'DOMContentLoaded',
    () => {
        let blocks = document.querySelectorAll(".answer")
        let detector = document.querySelectorAll(".tick-circle")

        for (let block of blocks){
            console.log(block.classList, "lolsd")
            if (block.classList.contains("correct")){
                detector[parseInt(block.id) - 1].style.display = "flex";
            }
        }
    }
)


