// Для зберігання списку відповідей використовується localstorage answerList

const plusButton = document.querySelector(".button-answer");
const input = document.querySelector(".new-answer");
const checkAnswer1 = document.querySelector('.check-answer');
const checkAnswer2 = document.querySelector('.check-cubic-answer');
const answerListElement = document.querySelector(".list");


let answer = "";

answerListElement.addEventListener("click", ()=>{
    if (localStorage.getItem("input-data") == null || localStorage.getItem("input-data") == ''){
        answer = '';
        checkAnswer2.style.display = "none";
        checkAnswer2.innerHTML = '';
        checkAnswer1.style.display = "none";
    }
})

input.addEventListener("input", ()=>{

    if (localStorage.getItem("input-data") != null && localStorage.getItem("input-data") != ''){
        checkAnswer1.style.display = "flex";
        answer = input.value;
        checkAnswer1.textContent = answer;
    }else{
        checkAnswer2.style.display = "flex";
        checkAnswer2.innerHTML = '';
        for (let letter of input.value){
            let p = document.createElement("p")
            p.textContent = letter;
            checkAnswer2.appendChild(p);
        }
    }
});

plusButton.addEventListener("click", ()=>{
    answer = "";
    checkAnswer2.style.display = "none";
    checkAnswer2.innerHTML = '';
    checkAnswer1.style.display = "none";
})