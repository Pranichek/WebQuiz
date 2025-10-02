const socket = io()

const buttonGenCode = document.querySelector(".generate-btn")
const generatedCodeText = document.querySelector(".generated-code")

buttonGenCode.addEventListener("click", () =>{
    socket.emit("generate_code")
})

socket.on("generate_code", data =>{
    let generatedCode = data.generated_code
    generatedCodeText.value = generatedCode
})