let validatorUsername = [
    { regex: /^.{2,20}$/ },     
    { regex: /^[a-zA-Zа-яА-Я ]+$/ }
]

let usernameRules = document.querySelectorAll(".username-item")
let usernameInput = document.querySelector(".username_input")

usernameInput.addEventListener('keyup', () => {
    usernameInput.value = usernameInput.value.replace(/[^a-zA-Zа-яА-Я ]/g, '');

    validatorUsername.forEach((item, index) => {
        let isValid = item.regex.test(usernameInput.value)

        if (isValid) {
            usernameRules[index].classList.add("checked");

            if (index === 0) {
                const line = document.querySelector(".username-line1");
                line.style.opacity = "1";
                line.style.width = "88%";
                document.querySelector(".username-like1").style.display = "flex";
                document.querySelector(".username-dislike1").style.display = "none";
            }

            if (index === 1) {
                const line = document.querySelector(".username-line2");
                line.style.opacity = "1";
                line.style.width = "92%";
                document.querySelector(".username-like2").style.display = "flex";
                document.querySelector(".username-dislike2").style.display = "none";
            }
        } else {
            usernameRules[index].classList.remove("checked");

            if (index === 0) {
                const line = document.querySelector(".username-line1");
                line.style.opacity = "1";
                line.style.width = "0%";
                document.querySelector(".username-like1").style.display = "none";
                document.querySelector(".username-dislike1").style.display = "flex";
            }

            if (index === 1) {
                const line = document.querySelector(".username-line2");
                line.style.opacity = "1";
                line.style.width = "0%";
                document.querySelector(".username-like2").style.display = "none";
                document.querySelector(".username-dislike2").style.display = "flex";
            }
        }
    })
})
