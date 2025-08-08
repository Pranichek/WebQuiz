// Для зберігання списку відповідей використовується localstorage answerList

const plusButton = document.querySelector(".button-answer");
const input = document.querySelector(".new-answer");
const checkAnswer1 = document.querySelector('.check-answer');
const checkAnswer2 = document.querySelector('.check-cubic-answer');
const answerListElement = document.querySelector(".list");


let answer = "";
console.log("input =", input);

answerListElement.addEventListener("click", ()=>{
    console.log("localstorage may be empty...");
    if (localStorage.getItem("input-data") == null || localStorage.getItem("input-data") == ''){
        console.log("localstorage is empty");
        answer = '';
        checkAnswer2.style.display = "none";
        checkAnswer2.innerHTML = '';
        checkAnswer1.style.display = "none";
    }
})

input.addEventListener("input", ()=>{
    console.log("oninput", `${localStorage.getItem("input-data")}`, input.value);

    if (localStorage.getItem("input-data") != null && localStorage.getItem("input-data") != ''){
        checkAnswer1.style.display = "flex";
        answer = input.value;
        checkAnswer1.textContent = answer;
    }else{
        checkAnswer2.style.display = "flex";
        if (answer.length < input.value.length){
            console.log(answer, input.value);
            answer = input.value;
            let p = document.createElement("p")
            p.textContent = answer[answer.length - 1];
            checkAnswer2.appendChild(p);
        }else{
            checkAnswer2.removeChild(checkAnswer2.lastElementChild);
            answer = input.value;
        }
    }
});

plusButton.addEventListener("click", ()=>{
    answer = "";
    checkAnswer2.style.display = "none";
    checkAnswer2.innerHTML = '';
    checkAnswer1.style.display = "none";
//     if(answer != ""){
//         try{
//             previousAnswers = localStorage.getItem("answerList");
//             localStorage.setItem("answerList", previousAnswers.append(answer));
//         } catch{
//             localStorage.setItem("answerList", [answer]);
//         }
//         console.log("localstorage answers:", localStorage.getItem("answerList"));
//     }
    
//     let p = document.createElement("p");
//     p.textContent = localStorage.getItem("answerList");
//     answerListElement.appendChild(p)
})