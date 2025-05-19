// Отримуємо кнопку "Додати відповідь"
const buttonPlus = document.getElementById("addQuestion");
// Беремо всі блоки з відповідями
let allAnswerBlocks = document.querySelectorAll(".answer-block");
let hiddenAnswerBlocks;

// Беремо усі кнпоки "Видалити відповідь"
const deleteButtonList = document.querySelectorAll(".delete-answer");

// Створюємо подію яка буде спрацьовувати при натисканні на кнопку 
buttonPlus.addEventListener("click", ()=>{
    // Беремо блоки які ще сховані
    hiddenAnswerBlocks = document.querySelectorAll(".hidden");
    console.log("hiddenAnswerBlocks", hiddenAnswerBlocks)

    // Якщо блоків які сховані менше або дорівнює 2, та якщо є хоча б один блок
    if (hiddenAnswerBlocks.length <= 2 && hiddenAnswerBlocks.length >= 1){
        // Видаляємо клас "hidden" у блока
        hiddenAnswerBlocks[0].classList.remove("hidden");
        // Якщо користувач досягнув ліміту із блоків, то кнопку "додати відповідь ховаємо"
        if (hiddenAnswerBlocks.length == 1){
            buttonPlus.classList.add("hidden-button");
        }
    }
})

// Робимо перебор списку де зберігаються кнопки "Видалити відповідь"
for (let deleteButton of deleteButtonList){
    // Створюємо подію яка буде спрацьовувати при натисканні на кнопку "Видалити відповідь"
    deleteButton.addEventListener("click", ()=>{
        // Беремо блоки які ще сховані
        hiddenAnswerBlocks = document.querySelectorAll(".hidden");

        // Робимо перевірку чи можна видалити блок, якщо так, то видаляємо
        if (hiddenAnswerBlocks.length <= 1){
            // Отримуємо id кнопки на яку натиснули
            let id = deleteButton.id;

            // Робимо цикл, де повинні знайти блок на якій знаходиться ця кнопка щоб видалити
            for (let answerBlock of allAnswerBlocks){
                if (answerBlock.id == id){
                    answerBlock.classList.add("hidden");
                }
            }
            // Якщо користувач видалив блок, то кнопку "додати відповідь" показуємо
            hiddenAnswerBlocks = document.querySelectorAll(".hidden");
            if (hiddenAnswerBlocks.length <= 3){
                buttonPlus.classList.remove("hidden-button");
            }
        }
    })
}