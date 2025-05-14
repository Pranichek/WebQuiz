const buttonList = document.querySelectorAll(".change");
let input;
let p;

for (let button of buttonList){
    button.addEventListener('click', ()=>{
        let button_id = button.id;
        console.log(button_id);
        input = document.querySelector(`#i-${button_id}`);
        saveButton = document.querySelector(`#b-${button_id}`);
        p = document.querySelector(`#p-${button_id}`);
        p.style.display = "none";
        button.type = "submit";
        input.style.display = "block";
        input.classList.add("change-input");
        saveButton.style.display = "block"
    })
}