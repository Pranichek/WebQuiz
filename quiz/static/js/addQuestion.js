const buttonPlus = document.getElementById("addQuestion");
let allAnswerBlocks = document.querySelectorAll(".answer-block");
let hiddenAnswerBlocks;
let correctAnswerList;
let inputAnswerList;
// Створюємо список де збергаються усі картинки з галочками
let tickCircleListtwo = document.querySelectorAll(".tick-circle");

const deleteButtonList = document.querySelectorAll(".delete-answer");

buttonPlus.addEventListener("click", ()=>{
    hiddenAnswerBlocks = document.querySelectorAll(".hidden");
    console.log("hiddenAnswerBlocks", hiddenAnswerBlocks)
    if (hiddenAnswerBlocks.length <= 2 && hiddenAnswerBlocks.length >= 1){
        hiddenAnswerBlocks[0].classList.remove("hidden");
        hiddenAnswerBlocks[0].classList.remove("correct")
        
        if (hiddenAnswerBlocks.length == 1){
            buttonPlus.classList.add("hidden-button");
        }
    }
})

for (let deleteButton of deleteButtonList) {
    deleteButton.addEventListener("click", () => {
        let id = deleteButton.id;
        console.log("zahodit")

        let correctIndex = localStorage.getItem("rightIndexes")

        if (correctIndex !== null){
            correctIndex = correctIndex.split(" ")
            correctIndex.splice(0, 1)
        }
        

        for (let answerBlock of allAnswerBlocks) {
            const hiddenAnswerBlocks = document.querySelectorAll(".answer-block.hidden");
            if (answerBlock.id === id) {
                if (hiddenAnswerBlocks.length <= 1){
                    inputAnswerList = document.querySelectorAll(".answer");
                    for (let i = 0; i < inputAnswerList.length; i++) {
                        const input = inputAnswerList[i];
                        if (input.id === id) {
                            
                            let indexToRemove = correctIndex.indexOf(input.id);
                            if (indexToRemove !== -1) {
                                correctIndex.splice(indexToRemove, 1);
                            }
                            console.log(input.id, "offfnik")

                            let newString = ''

                            for (let letter of correctIndex){
                                newString += ' ' + letter
                            }
                            localStorage.setItem("rightIndexes", newString)
                            input.value = ""; 
                            if (input.classList.contains("correct")) {
                                correctAnswerList = document.querySelectorAll(".correct");
                                if (correctAnswerList.length > 1) {
                                    input.classList.remove("correct");
                                    answerBlock.classList.add("hidden");
                                    localStorage.removeItem(`answer-${i}`);
                                   
                                    for (let tick of tickCircleListtwo) {
                                        if (tick.id === input.id) {
                                            tick.style.display = "none";
                                        }
                                    }
                                    if (buttonPlus.classList.contains("hidden-button")){
                                        buttonPlus.classList.remove("hidden-button");
                                    }   
                                }
                            } else {
                                answerBlock.classList.add("hidden");
                                localStorage.removeItem(`answer-${i}`);
                                // input.value = "";
                                if (buttonPlus.classList.contains("hidden-button")){
                                    buttonPlus.classList.remove("hidden-button");
                                }   

                                for (let tick of tickCircleListtwo) {
                                    if (tick.id === input.id) {
                                        tick.style.display = "none";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        // Оновлюємо кнопку "додати"
        // hiddenAnswerBlocks = document.querySelectorAll(".hidden");
        // if (hiddenAnswerBlocks.length <= 3) {
        //     buttonPlus.classList.remove("hidden-button");
        // }
    });
}
