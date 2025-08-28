// document.querySelector("#text-for-info").addEventListener(
//     'input',
//     () => {
//         if (document.querySelector("#text-for-info").value != document.querySelector("#text-for-info").dataset.name) {
//             document.querySelector(".save-changed").style.BackqroundColor = "#C48AF7"
//             document.querySelector(".save-changed").type = "button"
//         }
//     }
// )

// document.querySelector(".save-changed").addEventListener(
//     'click',
//     () => {
//         if (document.querySelector(".save-changed").type == "button") {
//             document.querySelector(".name").value = document.querySelector("#text-for-info").value
//             document.querySelector("#send-data").post()
//         }
//     }
// )


document.addEventListener(
    'DOMContentLoaded', 
    () => {
        const time = document.getElementById("time");
        const timeList = document.getElementById("timeList");
        const liList = document.querySelectorAll("#timeList li");
        const infoText = document.getElementById("text-for-info");
        const icon = document.querySelector(".show_more_velocity");

        // Постійний текст випадаючого меню
        const dropdownText = time.querySelector(".text");
        dropdownText.textContent = "Оберіть категорію тесту";  // фіксований напис

        // Показати/сховати список при кліку
        time.addEventListener(
            'click', 
            () => {
                const isHidden = timeList.classList.contains("hidden-list");

                timeList.classList.toggle("hidden-list", !isHidden);
                timeList.classList.toggle("visible", isHidden);

                icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
            }
        );

        // Обробка вибору
        liList.forEach(li => {
            li.addEventListener(
                'click', 
                () => {
                    const selectedCategory = li.textContent;

                    // Оновити верхній текст
                    infoText.textContent = selectedCategory;

                    // Сховати список
                    timeList.classList.add("hidden-list");
                    timeList.classList.remove("visible");

                    // Повернути іконку
                    icon.style.transform = "rotate(180deg)";

                    fetch('/save-category', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // body: JSON.stringify({ category: selectedCategory })
                        // }).then(response => {
                        //     if (response.ok) {
                        //         console.log("Категория успешно сохранена");
                        //     } else {
                        //         console.error("Ошибка при сохранении категории");
                        //     }
                        }
                    );

                    // change_tests.post('/save-category', (req, res) => {
                    // const { category } = req.body; // Получаем категорию из тела запроса

                    // const query = 'INSERT INTO categories (category_name) VALUES (?)'; // Замените 'categories' на свою таблицу и 'category_name' на соответствующее поле
                    // connection.query(query, [category], (error, results) => {
                    //     if (error) {
                    //     console.error('Ошибка при сохранении категории:', error);
                    //     res.status(500).send('Ошибка при сохранении категории');
                    //     } else {
                    //     console.log('Категория успешно сохранена');
                    //     res.send('Категория успешно сохранена');
                    //     }
                    // });
                    // });
                });
            }
        );

        // Відновити категорію після завантаження
        fetch('/get-category')
            .then(response => response.json())
            .then(data => {
                if (data.category) {
                    infoText.textContent = data.category;
                }
            }
        );
    }
);


document.querySelector(".edit-btn").addEventListener(
    'click',
    () => {
        if ( document.querySelector(".input_theme").disabled == true){
            document.querySelector(".input_theme").disabled = false
        }else{
            document.querySelector(".input_theme").disabled = true
        }
    }
)

document.addEventListener(
    'input',
    () => {
        let oldData = document.querySelector(".input_theme").dataset.name
        let newData = document.querySelector(".input_theme").value

        let button = document.querySelector(".save-changed")
        if (oldData != newData){
            button.style.backgroundColor = "#C48AF7"
            button.type = "button"
        }else {
            button.style.backgroundColor = "#827B88"
            button.type = "submit"
        }
    }
)

document.addEventListener(
    'click',
    () => {
        let oldCateg = document.querySelector("#text-for-info").dataset.name
        let newCateg = document.querySelector("#text-for-info").dataset.name

        let button = document.querySelector(".save-changed")
        if (oldCateg != newCateg){
            button.style.backgroundColor = "#C48AF7"
            button.type = "button"
        }else {
            button.style.backgroundColor = "#827B88"
            button.type = "submit"
        }
    }
)

button.addEventListener(
    'click',
    () => {
        if (button.type == "button"){
            document.querySelector(".name").value = document.querySelector(".input_theme").value

            document.querySelector(".input_theme").value.post()
        }
    }
)