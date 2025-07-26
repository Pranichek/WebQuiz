document.addEventListener('DOMContentLoaded', () => {
    // --- Дропдаун для КАТЕГОРИИ (ваш новый код) ---
    const categoryList = document.getElementById("timeList"); // Ваш UL
    const categoryLiList = document.querySelectorAll("#timeList li"); // Все LI внутри этого UL
    const categoryP = document.getElementById("categorySelect"); // Ваш P элемент, который служит кнопкой
    const categoryTextSpan = document.getElementById("categoryText"); // SPAN внутри P для текста
    const categoryArrow = categoryP.querySelector(".category-arrow"); // Иконка стрелки

    // Обработчик клика по "кнопке" категории
    categoryP.addEventListener("click", (event) => {
        event.stopPropagation(); // Предотвращаем всплытие, чтобы не закрывалось сразу от document.click

        const isListOpen = categoryList.classList.contains("show-list");

        categoryList.classList.toggle("show-list");
        categoryP.classList.toggle("active"); // Для вращения стрелки

        if (!isListOpen) {
            categoryList.style.maxHeight = categoryList.scrollHeight + "px";
        } else {
            categoryList.style.maxHeight = "0";
        }
    });

    // Обработчик клика по каждому элементу списка категорий
    for (let li of categoryLiList) {
        li.addEventListener("click", (event) => {
            event.stopPropagation(); // Предотвращаем всплытие

            // Обновляем текст в "кнопке"
            categoryTextSpan.textContent = li.textContent;
            
            // Сохраняем категорию в куки
            document.cookie = `category=${li.dataset.category}; path=/;`;
            
            // Закрываем список после выбора
            categoryList.style.maxHeight = "0";
            categoryList.classList.remove("show-list");
            categoryP.classList.remove("active"); // Возвращаем стрелку

            // Вызов вашей функции ChangePhoto
            ChangePhoto(text_li = li.textContent); 
        });
    }

    // --- Ваша функция ChangePhoto (без изменений, но убедитесь, что она доступна) ---
    // Если ChangePhoto определена ниже в файле или в отдельном файле, это нормально.
    // Если она находится внутри DOMContentLoaded, убедитесь, что она видна.
    function ChangePhoto(text_li){
        let testImage = document.querySelector(".test-cover");

        const da = testImage.src.split("/");

        if (!da.includes("cash_test")){
            let mathPhoto = document.querySelector(".math-photo").getAttribute("data-math")
            let englishPhoto = document.querySelector(".english-photo").getAttribute("data-english")
            let programingPhoto = document.querySelector(".programin-photo").getAttribute("data-programing")
            let historyPhoto = document.querySelector(".history-photo").getAttribute("data-history")
            let physicsPhoto = document.querySelector(".physics-photo").getAttribute("data-physics")
            let chemistryPhoto = document.querySelector(".chemistry-photo").getAttribute("data-chemistry")
            let another = document.querySelector(".another-photo").getAttribute("data-another")

            let massive = [
                mathPhoto,
                englishPhoto,
                programingPhoto,
                historyPhoto,
                physicsPhoto,
                chemistryPhoto,
                another
            ]

            // Важно: liList в этой функции ссылался на document.getElementsByTagName("li")
            // Здесь нужно быть уверенным, что index_li соответствует порядку в massive.
            // Если liList используется только в контексте ChangePhoto для получения индекса
            // на основе текста, то текущая реализация OK.
            let index_li = Array.from(document.querySelectorAll("#timeList li")).findIndex(li => li.textContent === text_li);


            let imageName = null; 

            if (document.cookie.match("test_url")){
                imageName = document.cookie.split("test_url=")[1].split(";")[0];
            }

            if (imageName){
                if (massive.includes(imageName)){
                    document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = `test_url=${massive[index_li]}; path=/;`;
                    testImage.src = massive[index_li];
                }
            } else {
                document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = `test_url=${massive[index_li]}; path=/;`;
                testImage.src = massive[index_li];
            }
        }
    }

    // --- Ваша функция DeleteImage (без изменений) ---
    function DeleteImage(){
        let cookies = document.cookie.match("test_url")
        document.querySelector("#del_form").submit();
        if (cookies){
            document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }


    // --- Обработчик загрузки страницы (window.load) ---
    // time.textContent в этом блоке должен ссылаться на categoryTextSpan, а не на time
    window.addEventListener('load', () => {
        let cookies = document.cookie.match("category")
        if (cookies){
            let cookiename = document.cookie.split("category=")[1].split(";")[0];
            categoryTextSpan.textContent = cookiename; // ИЗМЕНЕНО: теперь обновляем categoryTextSpan
        } else {
            categoryTextSpan.textContent = "оберіть категорію тесту "; // ИЗМЕНЕНО
        }
    });

    // --- Дополнительный обработчик: Закрывать список при клике вне его ---
    document.addEventListener('click', (event) => {
        const typeContainer = document.querySelector('.type'); // Контейнер для этого дропдауна
        if (!typeContainer.contains(event.target) && categoryList.classList.contains('show-list')) {
            categoryList.style.maxHeight = '0';
            categoryList.classList.remove('show-list');
            categoryP.classList.remove('active');
        }
    });
});