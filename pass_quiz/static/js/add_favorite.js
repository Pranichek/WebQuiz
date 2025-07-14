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