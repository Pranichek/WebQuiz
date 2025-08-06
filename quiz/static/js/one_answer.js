// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer");
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle");
// Беремо усі кружечки у лівому куту кожної відповіді(блоку з відповіддю)
let detectorList = document.querySelectorAll(".detector");
// зміна де зберігаються дані правильних варіантів відповідей через localstorage
let rightblock;


export function clear_answer(){
    for (let detector of detectorList){
        // Перевірямо чи натиснули на кружечок(додали подію)
        // Робимо перебір по списку з відповідями
        // Якщо натиснули на кружечок, то перевіряємо чи є у відповіді клас correct
        // Якщо є, то видаляємо клас correct у відповіді
        // Якщо немає, то добавляємо клас correct у відповіді

        let input = document.getElementById("1") 
        let tick = document.querySelector(`.tick-circle[id="${1}"]`)


        for (let inp of inputList) {
            inp.classList.remove("correct")
        }
        for (let t of tickCircleList) {
            t.style.display = "none"
        }

        tick.style.display = "flex"
        input.classList.add("correct")
        

        corretIndexes()
        
    }
}

function corretIndexes(){
    let indexes = []
    let checkCorrectList = document.querySelectorAll(".tick-circle")

    for (let input of checkCorrectList){
        if (input.style.display == "flex"){
            indexes.push(input.id)
        }
    }
    localStorage.setItem("rightIndexes", indexes.join(" "))
}
