let detectorList = document.querySelectorAll(".detector")
// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer")
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle")

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
                console.log("kak")
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

    })
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