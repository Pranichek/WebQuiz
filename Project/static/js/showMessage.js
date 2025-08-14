let hideTimeout;
const window = document.querySelector(".message");
const textMessage = document.querySelector(".text-message");
const cross = document.querySelector(".cross-img");

export function ShowMessage(text) {
    textMessage.textContent = text;
    window.classList.add("show");

    // чтобы сообщение все время поялвлось на 5 секунд не взависимоти от того сколько пользоватлеь раз нажал на кнопку
    if (hideTimeout) {
        clearTimeout(hideTimeout);
    }

    hideTimeout = setTimeout(() => {
        window.classList.remove("show");
    }, 5000);
}

cross.addEventListener('click', () => {
    window.classList.remove("show");

    if (hideTimeout) {
        clearTimeout(hideTimeout);
    }
});
