const allvariants = document.querySelectorAll(".input-variant")

document.querySelector(".new-answer").addEventListener(
    'input',
    () => {
        const list = document.querySelector(".list")
        const count = list.children.length
        const view = document.querySelector(".views-answs")

        if (count == 0){
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
)

window.addEventListener(
    'DOMContentLoaded',
    () => {
        const list = document.querySelector(".list")
        const count = list.children.length
        const view = document.querySelector(".views-answs")

        if (count > 0){
            const prevInput = document.createElement("input")
            prevInput.className = "prev-input"
            prevInput.disabled = true
            view.innerHTML = ""
            view.appendChild(prevInput)
        }
    }
)


for (let variant of allvariants){
    variant.addEventListener(
        'click',
        () => {
            console.log("meow")
            const list = document.querySelector(".list")
            const count = list.children.length
            const view = document.querySelector(".views-answs")

            if (count == 0){
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
    )
}