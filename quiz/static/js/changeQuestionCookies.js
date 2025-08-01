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

const socket = io();

function buttonColorChanging(){
    if (button.type == "button"){
        button.classList.add("grey");
    }
}

function answerScanning(){
    validAnswersFlag = true;
    for (let input of answerInputList){
        if (input.checkVisibility()){
            button.type = "submit";
            button.classList.remove("grey");
            button.classList.add("purple");
            let parentNode = input.parentNode
            const checkImage = parentNode.querySelector(".for-image")
            
            if (input.value == "" && !checkImage){
                validAnswersFlag = false;
            }
        }
    }

    if (validAnswersFlag == false | document.querySelector(".question").value == ""){
        button.type = "button";
        button.classList.add("grey");
        button.classList.remove("purple");
    } else{
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

    let allBlocks = document.querySelectorAll(".answer-block")
    let checkdel = document.querySelector(".check_del")

    allBlocks.forEach((block) => {
        if (!block.checkVisibility()){
            let currentValue = checkdel.value.split(" ")
            currentValue.push(block.id)
            checkdel.value = currentValue.join(" ")
        }
    })

    

    if (document.querySelector(".is-image").style.display == "none"){
        socket.emit("delImage", {
            "pk": pk
        });
    }


    let ticks = document.querySelectorAll(".tick-circle")
    let type = document.querySelector(".button-open").dataset.value

    if (type == "one-answer" || type=="many-answers"){
        answerInputList.forEach((input, index) => {
            let ParentTag = input.parentNode
            const checkImageCreate = ParentTag.querySelector(".for-image")
            if (input.checkVisibility()){
                if (input.value != ''){
                    if (ticks[index].style.display == "flex"){
                    answers += `(?%+${input.value}+%?)`;
                    }else{
                        answers += `(?%-${input.value}-%?)`;
                    }
                }else{
                    if (ticks[index].style.display == "flex"){
                        answers += `(?%+image?#$?image+%?)`;
                    }else{
                        answers += `(?%-image?#$?image-%?)`;
                    }
                }
                
            }
        });
    }else if(type == "input-gap"){
        let data = localStorage.getItem("input-data")
        let arrayData = data.split(" ")
        arrayData.forEach(data => {
            answers += `(?%+${data}+%?)`;
        })
        localStorage.removeItem("input-data")
    }


    answers = answers?.replace("undefined", "").replace("answers", "").replace("null", "");

    questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
    questionCookie[pk] = question.value;
    questionCookie = questionCookie.join("?%?");

    timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
    timeC = timeP.dataset.time.replace("⏱ ", "").replace(" ˅", "");
    timeCookie[pk] = timeC;
    timeCookie = timeCookie.join("?#?");

    typesQuestion = document.cookie.split("typeQuestions=")[1].split(";")[0].split("?$?");
    typesQuestion[pk] = document.querySelector(".button-open").dataset.value
    typesQuestion = typesQuestion.join("?$?")

    answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
    answerCookie[pk] = answers;
    answerCookie = answerCookie.join("?@?");

    document.cookie = `questions=${questionCookie}; path=/;`;
    document.cookie = `time=${timeCookie}; path=/;`;
    document.cookie = `answers=${answerCookie}; path=/;`;
    document.cookie = `typeQuestions=${typesQuestion}; path=/;`
    answers = null;
});


window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("time-text").dataset.time !== "not"){
        if (parseInt(document.getElementById("time-text").dataset.time) < 60){
            document.getElementById("time-text").textContent = `${document.getElementById("time-text").dataset.time} секунд`;
        }else{
            document.getElementById("time-text").textContent = `${parseInt(document.getElementById("time-text").dataset.time) / 60} хвилин`;

        }
    }else{
        document.getElementById("time-text").textContent = `Без часу`;

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
                            if (checkCorrectList.length > 1){
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
            if (block.classList.contains("correct")){
                detector[parseInt(block.id) - 1].style.display = "flex";
            }
        }
    }
)

