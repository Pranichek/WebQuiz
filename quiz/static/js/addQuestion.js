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

for (let deleteButton of deleteButtonList) {
    deleteButton.addEventListener("click", () => {
        let id = deleteButton.id;

        for (let answerBlock of allAnswerBlocks) {
            const hiddenAnswerBlocks = document.querySelectorAll(".answer-block.hidden");
            if (answerBlock.id === id) {
                if (hiddenAnswerBlocks.length <= 1){
                    inputAnswerList = document.querySelectorAll(".answer");

                    for (let i = 0; i < inputAnswerList.length; i++) {
                        const input = inputAnswerList[i];
                        if (input.id === id) {
                            // Очистити localStorage
                            localStorage.removeItem(`answer-${i}`);
                            input.value = ""; // також очистимо поле

                            // Логіка приховування
                            if (input.classList.contains("correct")) {
                                correctAnswerList = document.querySelectorAll(".correct");
                                if (correctAnswerList.length > 1) {
                                    input.classList.remove("correct");
                                    answerBlock.classList.add("hidden");
                                }
                            } else {
                                answerBlock.classList.add("hidden");
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
