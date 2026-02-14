// Файл який перевіряє яка відповдь є правильною чи ні
import { answerScanning } from './answers_scaning.js';


// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer")
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle")
// Беремо усі кружечки у лівому куту кожної відповіді(блоку з відповіддю)
let detectorList = document.querySelectorAll(".detector")
// зміна де зберігаються дані правильних варіантів відповідей через localstorage
let rightblock

// Робимо перебір по списку з кружечками
for (let detector of detectorList){
    // Перевірямо чи натиснули на кружечок(додали подію)
    detector.addEventListener("click", () =>{
        // Робимо перебір по списку з відповідями
        // Якщо натиснули на кружечок, то перевіряємо чи є у відповіді клас correct
        // Якщо є, то видаляємо клас correct у відповіді
        // Якщо немає, то добавляємо клас correct у відповіді
        
        let type_question = document.querySelector(".button-open").dataset.value
        let detector_id = detector.id

        let input = document.getElementById(detector_id) 
        let tick = document.querySelector(`.tick-circle[id="${detector_id}"]`)

        

        if (type_question !== "one-answer") {
            let count = 0
            let answers = document.querySelectorAll(".answer")
            for (let tick of tickCircleList){
                if (tick.style.display == "flex"){
                    count += 1
                }
            }

            if (count > 1 && input.classList.contains("correct")){
                tick.style.display = "none"
                input.classList.remove("correct")
            } else  {
                tick.style.display = "flex"
                input.classList.add("correct")
            }

        } else {
            for (let inp of inputList) {
                inp.classList.remove("correct")
            }
            for (let t of tickCircleList) {
                t.style.display = "none"
            }

            tick.style.display = "flex"
            input.classList.add("correct")
        }

        corretIndexes()
    })
}


function corretIndexes(){
    let indexes = []
    let checkCorrectList = document.querySelectorAll(".tick-circle")

    for (let tick of checkCorrectList){
        if (tick.style.display == "flex"){
            indexes.push(tick.id)
        }
    }
    localStorage.setItem("rightIndexes", indexes.join(" "))
}


window.addEventListener(
    'DOMContentLoaded',
    () => {
        let checkCorrectList = document.querySelectorAll(".answer")
        let correctindexes = localStorage.getItem("rightIndexes")

        
        if(correctindexes !== null){
            let lsitIndexes = correctindexes.split(" ")
            
            checkCorrectList.forEach(
            (input, index) => {
                    if (lsitIndexes.includes(input.id)){
                        if (input){
                            tickCircleList[index].style.display = `flex`
                            input.classList.add("correct")
                        }else{
                            if (input.id != 1 && input.id != "1" && lsitIndexes.length != 1 && lsitIndexes.includes("1")){
                                tickCircleList[index].style.display = `none`
                            }
                        }
                    }else{
                        tickCircleList[index].style.display = `none`
                    }
                }
            )
        }
        // let count = 0
        // let answers = document.querySelectorAll(".answer")
        // for (let tick of tickCircleList){
        //     if (tick.style.display == "flex"){
        //         count += 1
        //     }
        // }

        // if (count === 0){
        //     tickCircleList[0].style.display = `flex`
        //     answers[0].classList.add("correct")
        // }
    }
)

