import { answerScanning } from "./answers_scaning.js"

const socket = io();

const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const pk = document.getElementById("pk").textContent;
let answers;
let questions;
let timeC;
let imageC;
let validAnswersFlag = false;


document.addEventListener("input", answerScanning);
document.addEventListener("click", answerScanning);
document.addEventListener("change", answerScanning);
document.addEventListener("keydown", answerScanning);
document.addEventListener("DOMContentLoaded", answerScanning);

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
        const list = document.querySelector(".list")
        let dataArray = []
        for (let child of list.children){
            if (child.classList.contains("input-variant")){
                dataArray.push(child.textContent)
            }
        }
        dataArray.forEach(data => {
            answers += `(?%+${data}+%?)`;
        })
        localStorage.removeItem("input-data")
    }


    answers = answers?.replace("undefined", "").replace("answers", "").replace("null", "");

    let questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
    questionCookie[pk] = question.value;
    questionCookie = questionCookie.join("?%?");

    let timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
    timeC = timeP.dataset.time.replace("⏱ ", "").replace(" ˅", "");
    timeCookie[pk] = timeC;
    timeCookie = timeCookie.join("?#?");

    let typesQuestion = document.cookie.split("typeQuestions=")[1].split(";")[0].split("?$?");
    typesQuestion[pk] = document.querySelector(".button-open").dataset.value
    typesQuestion = typesQuestion.join("?$?")

    let answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
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
