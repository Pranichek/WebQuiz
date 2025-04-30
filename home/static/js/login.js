let listSpan = document.querySelector('.password')

listSpan.addEventListener(
    'click',
    function () {
        let passwordinput = listSpan.previousElementSibling

        if(passwordinput.type === 'password') {
            passwordinput.type = 'text'
            listSpan.textContent = "👀"
        }
        else {
            passwordinput.type = 'password'
            listSpan.textContent = "🫣"
        }
    }
)