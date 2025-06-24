// Файл який перевіряє яка відповдь є правильною чи ні

// Беремо усі відповідь на питання по класу answer"
let inputList = document.querySelectorAll(".answer");
// Створюємо список де збергаються усі картинки з галочками
let tickCircleList = document.querySelectorAll(".tick-circle");
// Беремо усі кружечки у лівому куту кожної відповіді(блоку з відповіддю)
let detectorList = document.querySelectorAll(".detector");
// зміна де зберігаються дані правильних варіантів відповідей через localstorage
let rightblock;

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
                            console.log(checkCorrectList, "bugaga")
                            if (checkCorrectList.length > 1){
                                console.log("correct:", input.id);
                                tick.style.display = "none";
                                input.classList.remove("correct");
                            }
                        }else {
                            tick.style.display = "flex";
                            input.classList.add("correct");
                        }
                        corretIndexes();
                    }
                }
            }
        }
    })
}


function corretIndexes(){
    let checkCorrectList = document.querySelectorAll(".answer");

    let stringIndexes = ''

    for (let input of checkCorrectList){
        if (input.classList.contains("correct")){
            stringIndexes += ' ' + input.id
        }
    }

    localStorage.setItem("rightIndexes", stringIndexes)
}


window.addEventListener(
    'load',
    () => {
        let checkCorrectList = document.querySelectorAll(".answer");
        let correctindexes = localStorage.getItem("rightIndexes")

        
        if(correctindexes !== null){
            let lsitIndexes = correctindexes.split(" ")
            
            lsitIndexes.splice(0, 1)

            checkCorrectList.forEach(
            (input, index) => {
                    console.log(index, "input Index")
                    if (lsitIndexes.includes(input.id)){
                        if (input.value != ""){
                            tickCircleList[index].style.display = `flex`;
                            input.classList.add("correct");
                        }else{
                            if (input.id != 1 && input.id != "1" && lsitIndexes.length != 1 && lsitIndexes.includes("1")){
                                tickCircleList[index].style.display = `none`;
                            }
                        }
                    }
                }
            )
        }
        let count = 0;
        let answers = document.querySelectorAll(".answer")
        for (let tick of tickCircleList){
            if (tick.style.display == "flex"){
                count += 1;
            }
        }

        if (count === 0){
            tickCircleList[0].style.display = `flex`;
            answers[0].classList.add("correct")
        }
    }
)