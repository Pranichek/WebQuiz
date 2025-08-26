let input_search = document.querySelector(".inp")
let all_classes = document.querySelectorAll(".classs")

input_search.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let search = input_search.value.toLowerCase()

        for (let clas of all_classes){
            
            let name = clas.querySelector(".name-class").textContent.toLowerCase()

            if (name.startsWith(search)){
                clas.style.display = "flex"
            }else{
                clas.style.display = "none"
            }
        }
    }
})
