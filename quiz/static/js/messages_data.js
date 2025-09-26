import { ShowMessage } from '/static/js/showMessage.js';

const socket = io()

document.querySelector(".copy-test-button").addEventListener(
    'click',
    () => {
        socket.emit("copy_test", 
            {test_id:document.querySelector(".copy-test-button").value}
        )
    }
)

socket.on("your_test",
    () => {
        ShowMessage("Ви створили цей тест, тому не можете його копіювати.")
    }
)

socket.on("excellent",
    () => {
        ShowMessage("Тест успішно скопійований.")
    }
)