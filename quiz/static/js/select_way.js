/* 
    . - клас
    # - по айді

    const - незмінна зміна
    let - для створення локальних та глобальних змін 
    var - для створення локальних та глобальних змін 

    function in js

    function namefunction(){} 
    function (){} 
    () => {} 
*/


let link = document.querySelector(".link");
let testBlock = document.querySelector(".blueCard");


testBlock.addEventListener(
    'click',
    () => {
        console.log("123")
        link.click();
    }
)
