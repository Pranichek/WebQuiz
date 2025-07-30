// отображение картинок которых он подргрузил к ответу
let inputsImages = document.querySelectorAll(".input_load")
let answerBlocks = document.querySelectorAll(".inside-data")
let textAreas = document.querySelectorAll("textarea")
let loadButtons = document.querySelectorAll(".load_img")

for (let input of inputsImages){
    input.addEventListener(
        'change',
        function(event) {
            let currentBlock
            for (let block of answerBlocks){
                if (block.id == input.id){
                    currentBlock = block
                }
            }
            const file = event.target.files[0]
            const imageURL = URL.createObjectURL(file);

            const div = document.createElement('div');
            div.className = "for-image"
            const img = document.createElement('img');
            img.src = imageURL;
            div.appendChild(img)

            currentBlock.appendChild(div)

            textAreas.forEach((textarea) => {
                if (textarea.id == input.id){
                    textarea.style.fontSize = "2vh"
                    textarea.style.height = "30%"
                }
            })

            loadButtons.forEach((button) => {
                if (button.id == input.id){
                    if (button.classList.contains('invisible')){
                        button.classList.remove("invisible")
                        button.dataset.state = "delete"
                    }else{
                        button.classList.add("invisible")
                        button.dataset.state = "delete"
                    }
                }
            })

            answerScanning()
        }
    )
}



for (let buttonLoad of loadButtons){
    buttonLoad.addEventListener(
        'click',
        () => {
            
            let inputCLick

            inputsImages.forEach((input) => {
                if (input.id == buttonLoad.id){
                    inputCLick = input
                }
            })


            if (buttonLoad.dataset.state == "load"){
                inputCLick.click()
            }else{
                inputCLick.value = ''
                answerBlocks.forEach((block) => {
                    if (block.id == buttonLoad.id){
                        const imageDiv = block.querySelector(".for-image")
                        if (imageDiv) {
                            block.removeChild(imageDiv)
                        }
                    }
                })
                textAreas.forEach((textarea) => {
                    if (textarea.id == buttonLoad.id){
                        textarea.style.fontSize = "3vh"
                        textarea.style.height = "80%"
                    }
                })
                loadButtons.forEach((button) => {
                    if (button.id == buttonLoad.id){
                        if (button.classList.contains('invisible')){
                            button.classList.remove("invisible")
                            button.dataset.state = "load"
                        }else{
                            button.classList.add("invisible")
                            button.dataset.state = "load"
                        }
                    }
                })
                let inputs = document.querySelectorAll(".check")
                inputs.forEach((input) => {
                    if (input.id == buttonLoad.id){
                        input.value = "delete"
                    }
                })
            }
        }
    )
}
