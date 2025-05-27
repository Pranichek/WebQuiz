const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const inputImg = document.getElementById("imgInput");
const pk = document.getElementById("pk").textContent
let answers;
let questions;
let timeC;
let imageC;

button.addEventListener("click", ()=>{
    console.log(document.cookie.match("questions"))
    for (let input of answerInputList){
        if (input.checkVisibility()){
            console.log(input.value);
            if (input.classList.contains("correct")){
                console.log("right:", input.value);
                answers += `(?%+${input.value}+%?)`;
            }else{
                console.log("wrong:", input.value);
                answers += `(?%-${input.value}-%?)`;
            }
        }
    }
    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");

    questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
    questionCookie[pk] = question.value;
    questionCookie = questionCookie.join("?%?")

    timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
    timeC = timeP.dataset.time;
    timeC = timeC.replace("⏱ ", "");
    timeC = timeC.replace(" ˅", "");
    timeCookie[pk] = timeC;
    timeCookie = timeCookie.join("?#?")

    imgCookie = document.cookie.split("images=")[1].split(";")[0].split("?&?");
    try{
        imgCookie[pk] = inputImg.files[0].name;
    } catch{
        imgCookie[pk] = "";
    }
    imgCookie = imgCookie.join("?&?")

    answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
    answerCookie[pk] = answers;
    answerCookie = answerCookie.join("?@?")

    document.cookie = `questions=${questionCookie}; path=/;`;

    document.cookie = `time=${timeCookie}; path=/;`;

    document.cookie = `images=${imgCookie}; path=/;`;

    document.cookie = `answers=${answerCookie}; path=/;`;
    answers = null;
})

