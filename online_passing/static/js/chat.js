let openChat = document.querySelector(".check-click")
let chatBox = document.querySelector(".chat-box")

openChat.addEventListener(
    "click",
    () => {
        if (chatBox.style.display == "none"){
            chatBox.style.display = "flex"
        }
        else{
            chatBox.style.display = "none"
        }
        
    }
)

