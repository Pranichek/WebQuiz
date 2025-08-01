const buttonPlus = document.getElementById("addQuestion");
let allAnswerBlocks = document.querySelectorAll(".answer-block");
let hiddenAnswerBlocks;
let correctAnswerList;
let inputAnswerList;
// Створюємо список де збергаються усі картинки з галочками
let tickCircleListtwo = document.querySelectorAll(".tick-circle");
const deleteButtonList = document.querySelectorAll(".delete-answer");

function settingsAddButton(){
    let answerBlocks = document.querySelectorAll(".answer-block")
    let count = 0

    for (let block of answerBlocks){
        console.log(block.classList)
        if (block.classList.contains("hidden")){
            count++
        }
    }
    if (buttonPlus){
        if (count == 0){
            buttonPlus.style.display = "none"
        }else{
            buttonPlus.style.display = "flex"
        }
    }
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        settingsAddButton()
    }
)

if (buttonPlus){
    buttonPlus.addEventListener("click", ()=>{
        hiddenAnswerBlocks = document.querySelectorAll(".hidden");
        if (hiddenAnswerBlocks.length <= 2 && hiddenAnswerBlocks.length >= 1){
            hiddenAnswerBlocks[0].classList.remove("hidden");
            hiddenAnswerBlocks[0].classList.remove("correct")
            
            settingsAddButton()
        }
    })
}

for (let deleteButton of deleteButtonList) {
    deleteButton.addEventListener("click", () => {
        let id = deleteButton.id;

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
                            
                            if (correctIndex !== null){
                                let indexToRemove = correctIndex.indexOf(input.id);
                                if (indexToRemove !== -1) {
                                    correctIndex.splice(indexToRemove, 1);
                                }

                                let newString = ''

                                for (let letter of correctIndex){
                                    newString += ' ' + letter
                                }
                                localStorage.setItem("rightIndexes", newString)
                            }
                            
                            
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
 
                                }
                            } else {
                                answerBlock.classList.add("hidden");
                                localStorage.removeItem(`answer-${i}`);
                                input.value = ""; 
                                if (answerBlock.querySelector(".inside-data").querySelector(".for-image")){
                                    answerBlock.querySelector(".inside-data").querySelector(".for-image").remove()
                                    answerBlock.querySelector("textarea").style.fontSize = "3vh"
                                }
                                

                                let icons = answerBlock.querySelectorAll(".load_img")
                                for (let icon of icons){
                                    if (icon.classList.contains("invisible")){
                                        icon.classList.remove("invisible")
                                        icon.dataset.state = "load"
                                    }else{
                                        icon.classList.add("invisible")
                                        icon.dataset.state = "load"
                                    }
                                }


                                for (let tick of tickCircleListtwo) {
                                    if (tick.id === input.id) {
                                        tick.style.display = "none";
                                    }
                                }

                            }

                            settingsAddButton()
                        }
                    }
                }
            }
        }

    });
}
