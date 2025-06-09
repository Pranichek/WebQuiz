// const category = document.getElementById("time");
// const testTitle = document.querySelector(".test-title-input");
const createTestButtons = document.getElementsByClassName("add-test");

// function dataValidation(){
//     // console.log("Value = ", testTitle.value);
//     if (document.cookie.match("inputname") && document.cookie.split("inputname=")[1].split(";")[0] != ""){
//         console.log(":", document.cookie.match("category"));
//         if (document.cookie.match("category")){
//         //     console.log("category.textContent =", category.textContent)
//             for (let createTestButton of createTestButtons){
//                 createTestButton.classList.remove("grey");
//                 createTestButton.type = "submit";
//             }
//         }
//     }
// }

function dataValidation() {
    const hasName = document.cookie.match("inputname") && document.cookie.split("inputname=")[1].split(";")[0] != "";
    const alternatineNameValidation = document.querySelector(".test-title-input").textContent != "";
    const hasCategory = document.cookie.match("category") && document.cookie.split("category=")[1].split(";")[0] != "";

    for (let createTestButton of createTestButtons) {
        if (hasName && hasCategory || alternatineNameValidation && hasCategory){
            createTestButton.classList.remove("grey");
            createTestButton.type = "submit";
        } else {
            createTestButton.classList.add("grey");
            createTestButton.type = "button";
        }
    }
}

function buttonColorChanging(){
    for (let createTestButton of createTestButtons){
        if (createTestButton.type == "button"){
            createTestButton.classList.add("grey");
        }
    }
}

document.addEventListener("click", ()=>{
    dataValidation();
})
document.addEventListener("keydown", ()=>{
    dataValidation();
})
document.addEventListener("DOMContentLoaded", ()=>{
    console.log("content loaded");
    dataValidation();
})

document.addEventListener("DOMContentLoaded", ()=>{
    buttonColorChanging();
})
document.addEventListener("click", ()=>{
    buttonColorChanging();
})
document.addEventListener("keydown", ()=>{
    buttonColorChanging();
})