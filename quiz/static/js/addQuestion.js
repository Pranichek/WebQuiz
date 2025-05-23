const buttonPlus = document.getElementById("addQuestion");
let allAnswerBlocks = document.querySelectorAll(".answer-block");
let hiddenAnswerBlocks;
let correctAnswerList;
let inputAnswerList;

const deleteButtonList = document.querySelectorAll(".delete-answer");

buttonPlus.addEventListener("click", ()=>{
    hiddenAnswerBlocks = document.querySelectorAll(".hidden");
    console.log("hiddenAnswerBlocks", hiddenAnswerBlocks)
    if (hiddenAnswerBlocks.length <= 2 && hiddenAnswerBlocks.length >= 1){
        hiddenAnswerBlocks[0].classList.remove("hidden");
        if (hiddenAnswerBlocks.length == 1){
            buttonPlus.classList.add("hidden-button");
        }
    }
})

for (let deleteButton of deleteButtonList){
    deleteButton.addEventListener("click", ()=>{
        hiddenAnswerBlocks = document.querySelectorAll(".hidden");
        if (hiddenAnswerBlocks.length <= 1){
            let id = deleteButton.id;
            for (let answerBlock of allAnswerBlocks){
                if (answerBlock.id == id){
                    inputAnswerList = document.querySelectorAll(".answer")
                    for (let input of inputAnswerList){
                        if (input.id == id){
                            console.log("input.className =", input.className);
                            if (input.classList.contains("correct")){
                                correctAnswerList = document.querySelectorAll(".correct");
                                console.log("correctAnswerList =", correctAnswerList);
                                if (correctAnswerList.length > 1){
                                    input.classList.remove("correct");
                                    answerBlock.classList.add("hidden");
                                }
                            } else{
                                answerBlock.classList.add("hidden");
                            }
                        }
                    }
                }
            }
            hiddenAnswerBlocks = document.querySelectorAll(".hidden");
            if (hiddenAnswerBlocks.length <= 3){
                buttonPlus.classList.remove("hidden-button");
            }
        }
    })
}
