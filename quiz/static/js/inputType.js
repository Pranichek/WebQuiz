let addButton = document.querySelector(".button-answer")
let allVarinats

function check() {
    let countCh = document.querySelectorAll(".input-variant").length
    const view = document.querySelector(".views-answs")

    if (countCh == 0) {
        view.innerHTML = ""

        for (let symb of document.querySelector(".new-answer").value) {
            const block = document.createElement("div")
            block.textContent = symb

            if (symb == " ") {
                block.className = "empty-block"
            } else {
                block.className = "block-symb"
            }

            view.appendChild(block)
        }
    } else {
        const prevInput = document.createElement("input")
        prevInput.className = "prev-input"
        prevInput.value = document.querySelector(".new-answer").value
        prevInput.disabled = true

        view.innerHTML = ""
        view.appendChild(prevInput)
    }
}

addButton.addEventListener("click", () => {

    const data = document.querySelector(".new-answer")
    const list = document.querySelector(".list")

    let inputText = data.value.trim()

    if (inputText === "") {
        data.value = ""
        return
    }

    const paragraph = document.createElement("p")
    paragraph.textContent = inputText
    paragraph.className = "input-variant"
    paragraph.id = `${list.childElementCount}`

    list.appendChild(paragraph)

    document.querySelector(".views-answs").innerHTML = ""

    let savedData = localStorage.getItem("input-data")

    if (savedData && savedData.trim() !== "") {
        savedData = savedData + " " + inputText
    } else {
        savedData = inputText
    }

    if (!document.querySelector(".change_type")) {
        localStorage.setItem("input-data", savedData)
    }

    data.value = ""

    paragraph.addEventListener("click", () => {
        paragraph.remove()
        check()
        updateStorage()
    })
})

function updateStorage() {
    let updatedData = []

    document.querySelectorAll(".input-variant").forEach(el => {
        if (el.textContent.trim() !== "") {
            updatedData.push(el.textContent.trim())
        }
    })

    document.querySelectorAll(".input-variant").forEach((el, index) => {
        el.id = `${index}`
    })

    if (!document.querySelector(".change_type")) {
        localStorage.setItem("input-data", updatedData.join(" "))
    }
}

window.addEventListener("DOMContentLoaded", () => {

    if (document.querySelector(".change_type")) return

    let data = localStorage.getItem("input-data")

    if (!data) return

    const list = document.querySelector(".list")

    let dataArray = data.split(" ").filter(x => x.trim() !== "")

    dataArray.forEach(text => {

        const paragraph = document.createElement("p")
        paragraph.textContent = text.trim()
        paragraph.className = "input-variant"
        paragraph.id = `${list.childElementCount}`

        list.appendChild(paragraph)

        paragraph.addEventListener("click", () => {
            paragraph.remove()
            check()
            updateStorage()
        })
    })
})
