let addButton = document.querySelector(".button-answer")
let allVarinats;


addButton.addEventListener(
    'click',
    () => {

        let datainput = localStorage.getItem("input-data")
        if (datainput){
            let oldData = datainput.split(" ")
        }else{
            let oldData = []
        }

        const data = document.querySelector(".new-answer")
        const list = document.querySelector(".list")
        let inputText = data.value

        const paragraph = document.createElement("p")
        paragraph.textContent = inputText
        paragraph.className = "input-variant"
        paragraph.id = `${list.childElementCount}`
        list.appendChild(paragraph)

        paragraph.addEventListener('click', () => {
            let idParagraph = paragraph.id
                for (let el of list.childNodes){
                    if (el.id == idParagraph){
                        list.removeChild(el)
                        
                        let updatedData = []
                        for (let el of list.childNodes) {
                            if (el.className === "input-variant") {
                                updatedData.push(el.textContent);
                            }
                        }
                        

                        for (let i = 0; i < list.childElementCount; i++){
                            list.children[i].id = `${i}`;
                        }

                        localStorage.setItem("input-data", updatedData.join(" "));
                    }
                }
        })

        let savedData = localStorage.getItem("input-data")

        if (savedData !== null) {
            savedData = savedData + " " + inputText
        } else {
            savedData = inputText
        }

        localStorage.setItem("input-data", savedData)

        data.value = ""

        allVarinats = document.querySelectorAll(".input-data")        
    }
)

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let data = localStorage.getItem("input-data")
        if (data){
            let dataArray = data.split(" ")
            const list = document.querySelector(".list")

            dataArray.forEach(text => {
                const paragraph = document.createElement("p")
                paragraph.textContent = text
                paragraph.className = "input-variant"
                paragraph.id = `${list.childElementCount}`  
                list.appendChild(paragraph)
                paragraph.addEventListener('click', () => {
                    let idParagraph = paragraph.id
                    for (let el of list.childNodes){
                        if (el.id == idParagraph){
                            list.removeChild(el)

                            let updatedData = []
                            for (let el of list.childNodes) {
                                if (el.className === "input-variant") {
                                    updatedData.push(el.textContent);
                                }
                            }

                            for (let i = 0; i < list.childElementCount; i++){
                                list.children[i].id = `${i}`;
                            }

                            localStorage.setItem("input-data", updatedData.join(" "));
                        }
                    }
                })
            })
            
            
        }
    }
)


