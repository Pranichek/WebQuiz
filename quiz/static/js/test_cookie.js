let buttonplay = document.querySelector(".play_test")
let formPLay = document.querySelector("#play-form")

buttonplay.addEventListener(
    'click',
    () => {
        document.cookie = `test_id=${buttonplay.value}; path=/;`;
        formPLay.submit();
    }
)