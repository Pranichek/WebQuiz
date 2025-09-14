import { ShowMessage } from '/static/js/showMessage.js';

export function answerScanning(){
    let validAnswersFlag = true;

    let categoryButton = document.querySelector(".button-open")
    let typeQuestions = categoryButton.dataset.value
    let answerInputList = document.querySelectorAll(".answer");

    const button = document.getElementById("save");
    if (typeQuestions == "one-answer" || typeQuestions == "many-answers"){
        for (let input of answerInputList){
            if (input.checkVisibility()){
                button.type = "submit";
                // button.classList.remove("grey");
                // button.classList.add("purple");
                let parentNode = input.parentNode
                const checkImage = parentNode.querySelector(".for-image")
                
                if (input.value == "" && !checkImage){
                    validAnswersFlag = false;
                }
            }
        }
    }else if(typeQuestions == "input-gap"){
        const list = document.querySelector(".list")
        let count = 0

        for (let child of list.children){
            if (child.classList.contains("input-variant")){
                count++;
            }
        }

        if (count == 0){
            validAnswersFlag = false;
        }
    }


    if (validAnswersFlag == false | document.querySelector(".question").value == ""){
        button.type = "button";
        // button.style.backgroundColor = "#636262"
        try {
            button.classList.remove("purple")
        } catch (error) {
            console.log(error)
        }
        button.style.color = "#343434"
        button.classList.add("gray")
    } else{
        button.type = "submit";
        // button.style.backgroundColor = "#c591f6"
        button.style.color = "#ffff"
        try {
            button.classList.remove("gray")
        } catch (error) {
            console.log(Error)
        }
        button.classList.add("purple")
    }
}

const saveButton = document.getElementById("save")

saveButton.addEventListener(
    'click',
    () => {
        if (saveButton.type == "button"){
            ShowMessage("Упс... Виникла помилка! Перевірте, будь ласка, чи все ви заповнили")
        }
    }
)

