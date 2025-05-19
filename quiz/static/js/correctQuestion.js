let inputList = document.querySelectorAll(".answer");
let tickCircleList = document.querySelectorAll(".tick-circle");
let detectorList = document.querySelectorAll(".detector");

for (let detector of detectorList){
    detector.addEventListener("click", () =>{
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