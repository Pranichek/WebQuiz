import { ShowMessage } from '/static/js/showMessage.js';

let addButton = document.querySelector(".add-favorite")
const queryString2 = window.location.search; 
const urlParams2 = new URLSearchParams(queryString2);

addButton.addEventListener(
    "click",
    () => {
        let test_id = urlParams2.get("test_id");
        if (!test_id){
            socket.emit("add_favorite", {
            test_id: testId
            }) 
        }else{
            socket.emit("add_favorite", {
                test_id: test_id
            })
        }
    }
)

socket.on("didn't add",
    () => {
        ShowMessage("❌ Не вдалося додати у вибрані тести.🔑 Будь ласка, зареєструйтесь або увійдіть, щоб скористатися цією функцією.")
    }
)

socket.on("add",
    () => {
        ShowMessage("Тест успішно додано до вибраних!")
    }
)