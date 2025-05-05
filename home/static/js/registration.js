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
let listSpan = document.querySelectorAll('.password');

for (let count = 0; count < listSpan.length; count++){
    let button = listSpan[count];
    button.addEventListener(
        'click',
        function (event){
            let input = listSpan[count].previousElementSibling;
            if (input.type === 'password'){
                input.type = 'text';
                if(button.id == "simple-password") {
                    document.getElementById("password-eye").src =  document.getElementById("password-eye").dataset.open;
                }else {
                    document.getElementById("confirm-eye").src =  document.getElementById("confirm-eye").dataset.open;
                }
            }
            else{
                input.type = 'password';
                if(button.id == "simple-password") {
                    document.getElementById("password-eye").src =  document.getElementById("password-eye").dataset.close;
                }else {
                    document.getElementById("confirm-eye").src =  document.getElementById("confirm-eye").dataset.close;
                }
            }
        }
    )
}


