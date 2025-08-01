import { clear_answer } from "./one_answer.js"

let categoruMenu = document.querySelector(".category-questions");
let categoryButton = document.querySelector(".button-open");
let buttonsTypes = document.querySelectorAll(".check-type-question")
let ulTypes = document.querySelectorAll(".type-ul")

categoryButton.addEventListener(
    "click",
    (event) => {
        if (categoruMenu.style.display == "none") {
            categoruMenu.style.display = "flex";
        }
        else {
            categoruMenu.style.display = "none";
        }
    }
)

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let type;
        if (!categoryButton.classList.contains("change_type")){
            type = localStorage.getItem("type")
            if (categoryButton.dataset.value == ""){
                if (!type){
                    localStorage.setItem("type", "one-answer")
                    type = localStorage.getItem("type")
                }

                categoryButton.dataset.value = type
            }
        }else{
            type = categoryButton.dataset.value
        }

        const textType = document.querySelector(".text-type");
        const blocks = document.querySelector(".blocks");
        
        const inputType = document.querySelector(".input-type");
        if (type != "input-gap") {
            textType.style.display = "flex";
            blocks.style.display = "flex";
            inputType.style.display = "none";
            console.log("barbos")
        }else if (type === "input-gap"){
            textType.style.display = "none";
            blocks.style.display = "none";
            inputType.style.display = "flex";
        }
    
        for (let buttonType of buttonsTypes){
            if (buttonType.dataset.value == categoryButton.dataset.value){
                categoryButton.textContent = buttonType.textContent
                let input = buttonType.querySelector('input')
                input.checked = true;
            }
        }
    } 
)

for (let inputul of ulTypes){
    inputul.addEventListener(
        'click',
        () => {
            let li = inputul.querySelector("li")
            let radio = inputul.querySelector("input")
            radio.click()

            if (!document.querySelector(".button-open").classList.contains("change_type")){
                localStorage.setItem("type", li.dataset.value)
            }

            categoryButton.dataset.value = li.dataset.value
            categoryButton.textContent = li.textContent

            let type;

            if (!document.querySelector(".button-open").classList.contains("change_type")) {
                type = localStorage.getItem("type");
            } else {
                type = categoryButton.dataset.value;
            }

            
            const textType = document.querySelector(".text-type");
            const blocks = document.querySelector(".blocks");
           
            const inputType = document.querySelector(".input-type");

            if (type === "one-answer") {
                clear_answer();
                textType.style.display = "flex";
                blocks.style.display = "flex";
                inputType.style.display = "none";
            }else if (type === "input-gap"){
                textType.style.display = "none";
                blocks.style.display = "none";
                inputType.style.display = "flex";
            }else if(type == "many-answers"){
                textType.style.display = "flex";
                blocks.style.display = "flex";
                inputType.style.display = "none";
            }
        }
    )
}

// закртие окон когда нажали по экрану но не по ним
const targetElement = document.querySelector('.category-questions'); 
const openButton = document.querySelector('.button-open');

document.addEventListener('click', (event) => {
    if (targetElement && !targetElement.contains(event.target) && !openButton.contains(event.target)) {
        targetElement.style.display = "none";
    }
});

const timeButton = document.querySelector('.timer-p');

document.addEventListener('click', (event) => {
    if (timeList && !timeList.contains(event.target) && !timeButton.contains(event.target)) {
        timeList.classList.add('hidden-list'); 
    }
});
