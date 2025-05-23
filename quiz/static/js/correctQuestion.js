// Файл який перевіряє яка відповдь є правильною чи ні

// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer");
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle");
// Беремо усі кружечки у лівому куту кожної відповіді(блоку з відповіддю)
let detectorList = document.querySelectorAll(".detector");

// Робимо перебір по списку з кружечками
for (let detector of detectorList){
    // Перевірямо чи натиснули на кружечок(додали подію)
    detector.addEventListener("click", () =>{
        // Робимо перебір по списку з відповідями
        // Якщо натиснули на кружечок, то перевіряємо чи є у відповіді клас correct
        // Якщо є, то видаляємо клас correct у відповіді
        // Якщо немає, то добавляємо клас correct у відповіді
        for (let input of inputList){
            if (input.id == detector.id){
                for (let tick of tickCircleList){
                    if (tick.id == detector.id){
                        if (input.classList.contains("correct")){
                            let checkCorrectList = document.querySelectorAll(".correct");
                            if (checkCorrectList.length > 1){
                                console.log("correct:", input.id);
                                tick.style.display = "none";
                                input.classList.remove("correct");
                            }
                        } else {
                            tick.style.display = "flex";
                            input.classList.add("correct");
                        }
                    }
                }
            }
        }
    })
}