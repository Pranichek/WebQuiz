const password1Input = document.querySelector('#password1');
const eyeIcons1List = document.querySelectorAll("#eye1");
let hidden1Icon;

for (let eye1Icon of eyeIcons1List){
    eye1Icon.addEventListener(
        'click',
        function () {
            if(password1Input.type === 'password') {
                password1Input.type = 'text';
            }else {
                password1Input.type = 'password';
            }
            hidden1Icon = document.querySelector(".hidden1");
            console.log("15 hidden1 =", hidden1Icon)
            eye1Icon.classList.add("hidden1");
            console.log("eye1Icon.classList =", eye1Icon.classList)
            console.log("querySelectorAll('.hidden1') =", document.querySelectorAll(".hidden1"))
            hidden1Icon.classList.remove("hidden1");
            console.log("eye1Icon =", eye1Icon, "hidden1 =", hidden1Icon);
        }
    )
}


const password2Input = document.querySelector('#password2');
const eyeIcons2List = document.querySelectorAll("#eye2");
let hidden2Icon;

for (let eye2Icon of eyeIcons2List){
    eye2Icon.addEventListener(
        'click',
        function () {
            if(password2Input.type === 'password') {
                password2Input.type = 'text';
            }else {
                password2Input.type = 'password';
            }
            hidden2Icon = document.querySelector(".hidden2");
            console.log("15 hidden2 =", hidden2Icon)
            eye2Icon.classList.add("hidden2");
            console.log("eye2Icon.classList =", eye2Icon.classList)
            console.log("querySelectorAll('.hidden2') =", document.querySelectorAll(".hidden2"))
            hidden2Icon.classList.remove("hidden2");
            console.log("eye2Icon =", eye2Icon, "hidden2 =", hidden2Icon);
        }
    )
}

