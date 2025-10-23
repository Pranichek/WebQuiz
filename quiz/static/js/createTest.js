import { ShowMessage } from '/static/js/showMessage.js';

const createTestButtons = document.getElementsByClassName("add-test")
const StartButton = document.getElementById("create_test_buttin")

StartButton.addEventListener(
    'click',
    () => {
        if (StartButton.type == "button"){
            ShowMessage("Упс.. Виникла помилка!Перевірте будь-ласка, чи все ви відмітили")
        }
    }
)


function dataValidation() {
    const hasName = document.cookie.match("inputname") && document.cookie.split("inputname=")[1].split(";")[0] != "";
    const alternatineNameValidation = document.querySelector(".test-title-input").textContent != "";
    const hasCategory = document.cookie.match("category") && document.cookie.split("category=")[1].split(";")[0] != "";

    for (let createTestButton of createTestButtons) {
        if (hasName && hasCategory || alternatineNameValidation && hasCategory){
            createTestButton.classList.remove("grey");
            createTestButton.type = "submit";
        } else {
            createTestButton.classList.add("grey");
            createTestButton.type = "button";
        }
    }
}

function buttonColorChanging(){
    for (let createTestButton of createTestButtons){
        if (createTestButton.type == "button"){
            createTestButton.classList.add("grey");
        }
    }
}

document.addEventListener("click", ()=>{
    dataValidation();
    buttonColorChanging();
})
document.addEventListener("keydown", ()=>{
    dataValidation();
    buttonColorChanging();
})
document.addEventListener("DOMContentLoaded", ()=>{
    dataValidation();
    buttonColorChanging();
})

