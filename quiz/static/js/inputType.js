let addButton = document.querySelector(".button-answer")
let allVarinats;


function check(){
    let countCh = document.querySelectorAll(".input-variant").length
    const view = document.querySelector(".views-answs")

    if (countCh == 0){
        view.innerHTML = ""
        for (let symb of document.querySelector(".new-answer").value){
            const block = document.createElement("div")
            block.textContent = symb
            if (symb == " "){
                block.className = "empty-block"
            }else{
                block.className = "block-symb"
            }
            view.appendChild(block)
        }
    }else{
        const prevInput = document.createElement("input")
        prevInput.className = "prev-input"
        prevInput.value = document.querySelector(".new-answer").value
        prevInput.disabled = true
        view.innerHTML = ""
        view.appendChild(prevInput)
    }
}



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



        document.querySelector(".views-answs").innerHTML = ""

        paragraph.addEventListener('click', () => {
            let idParagraph = paragraph.id
            let paragraphs = document.querySelectorAll(".input-variant")
            
            for (let el of list.childNodes){
                if (el.id == idParagraph){
                    list.removeChild(el)

                    check()
                    
                    let updatedData = []
                    for (let el of list.childNodes) {
                        if (el.className === "input-variant") {
                            updatedData.push(el.textContent);
                        }
                    }
                    

                    for (let i = 0; i < list.childElementCount; i++){
                        list.children[i].id = `${i}`;
                    }
                    if (!document.querySelector(".change_type")){
                        localStorage.setItem("input-data", updatedData.join(" "));
                    }
                    break;
                }
            
            }
        })

        let savedData = localStorage.getItem("input-data")

        if (savedData !== null) {
            savedData = savedData + " " + inputText
        } else {
            savedData = inputText
        }
        if (!document.querySelector(".change_type")){
            localStorage.setItem("input-data", savedData)
        }

        data.value = ""

        allVarinats = document.querySelectorAll(".input-data")        
    }
)

window.addEventListener(
    'DOMContentLoaded',
    () => {
        if (!document.querySelector(".change_type")){
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

                        check()

                        let updatedData = []
                        for (let el of list.childNodes) {
                            if (el.className === "input-variant") {
                                updatedData.push(el.textContent);
                            }
                        }

                        for (let i = 0; i < list.childElementCount; i++){
                            list.children[i].id = `${i}`;
                        }
                        if (!document.querySelector(".change_type")){
                            localStorage.setItem("input-data", updatedData.join(" "));
                        }

                        break;

                        }
                        }
                        
                    })
                })
            }
        }
    }
)


// удаление когда пользователь хчоет изменить вопрос
let paragraphs = document.querySelectorAll(".input-variant")

for (let paragraph of paragraphs){
    paragraph.addEventListener(
        'click',
        () => {
            const list = document.querySelector(".list");
            let paragraphs = document.querySelectorAll(".input-variant");
            for (let el of list.childNodes) {
                if (el.id == paragraph.id) {
                    list.removeChild(el);

                    check()

                    // Update IDs
                    for (let i = 0; i < list.childElementCount; i++) {
                        list.children[i].id = `${i}`;
                    }

                    if (!document.querySelector(".change_type")) {
                        localStorage.setItem("input-data", updatedData.join(" "));
                    }
                    break;
                }
            }
            
        }
    )
}
