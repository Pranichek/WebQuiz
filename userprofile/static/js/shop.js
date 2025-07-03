// let buyButtons = document.querySelectorAll(".butButton")
// let amountmoney = document.querySelector(".userMoney").textContent

// for ( let button in buyButtons){
//     'click',
//     () => {
//         const pricepet = parseInt(button.value)

//         let formsend = document.querySelector("")
//         formsend.submit();
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
    const buyButtons = document.querySelectorAll(".butButton");
    const moneyDisplay = document.querySelector(".userMoney");
    const petDisplay = document.getElementById("own-pet");

    buyButtons.forEach(button => {
        button.addEventListener("click", () => {
            const petData = button.getAttribute("data-pet"); // пример: 3/25

            fetch("/buy_gift", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `buy_gift=${encodeURIComponent(petData)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);

                    // Обновляем монеты
                    if (moneyDisplay) {
                        moneyDisplay.innerHTML = `${data.new_money} <img src="/profile/static/images/robo-money.png" alt="">`;
                    }

                    if (petDisplay) {
                        petDisplay.src = `/profile/static/images/pets_id/${data.pet_id}.png`;
                    }
                } else {
                    alert(data.message);
                }
            })
        });
    });
});