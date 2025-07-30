let addButton = document.querySelector(".button-answer")

addButton.addEventListener(
    'click',
    () => {
        const data = document.querySelector(".new-answer")
        const list = document.querySelector(".list")
        let inputText = data.value

        const paragraph = document.createElement("p");
        paragraph.textContent = inputText
        list.appendChild(paragraph)

        data.value = ""
    }
)

