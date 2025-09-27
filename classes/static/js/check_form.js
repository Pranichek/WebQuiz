import { ShowMessage } from "/static/js/showMessage.js";

const createButton = document.getElementById("createClassBtn");
// отримуємо усі інпути
let checkName = document.querySelector(".class_name")
let checkNumber = document.querySelector(".sel1")
let checkLetter = document.querySelector(".sel2")
let checkLesson = document.querySelector(".obj")

// отримаємо форму
let exampleForm = document.querySelector(".main_form")

createButton.addEventListener(
    "click", 
    () => {
        if (!checkName.value.trim()){
            ShowMessage("Упс, введіть назву класу!")
            return
        }
        else if (checkNumber.textContent === "№"){
            ShowMessage("Упс, введіть номер класу!")
            return
        }
        else if (checkLetter.textContent === "А..."){
            ShowMessage("Упс, введіть літеру класу!")
            return
        }
        else if (checkLesson.textContent === "Оберіть предмет класу"){
            ShowMessage("Упс, оберіть предмет!")
            return
        }  

        exampleForm.submit()
    }
);
