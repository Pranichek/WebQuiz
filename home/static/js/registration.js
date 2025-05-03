// let listSpan = document.querySelector('.password')

// listSpan.addEventListener(
//     'click',
//     function () {
//         let passwordinput = listSpan.previousElementSibling

//         if(passwordinput.type === 'password') {
//             passwordinput.type = 'text'
//             listSpan.textContent = "👀"
//         }
//         else {
//             passwordinput.type = 'password'
//             listSpan.textContent = "🫣"
//         }
//     }
// )
let listSpan = document.querySelectorAll('.password')
let passwordInp = document.querySelector(".input_password")

for (let count = 0; count < listSpan.length; count++){
    let button = listSpan[count]
    button.addEventListener(
        'click',
        function (event){
            let input = listSpan[count].previousElementSibling
            if (input.type === 'password'){
                input.type = 'text'
                button.textContent = "👁️‍🗨️"
            }
            else{
                input.type = 'password'
                button.textContent = "🫣"
            }
        }
    )
}


