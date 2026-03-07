import { lobbyStudent } from './student.js';
import { renderStudentPassing } from './passing_test.js'
import { loadUsers } from './load_users.js'

export async function removeOldCSS() {
    const oldStyles = document.querySelectorAll('link.dynamic-css');
    
    oldStyles.forEach(link => {
        link.remove(); 
    });
}

export async function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) {
        return Promise.resolve(); 
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.className = 'dynamic-css'; 

        link.onload = () => {
            resolve();
        };
        
        link.onerror = () => reject(new Error(`Style load error: ${href}`));

        document.head.appendChild(link);
    });
}

export async function loadLobby(){    
    const mainBlock = document.querySelector(".main")
    const urlParams = new URLSearchParams(window.location.search);
    const id_test = urlParams.get('id_test');


    return fetch('/student_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_id: id_test }), 
    })
    .then(response => response.json())
    .then(async (data) => {
        mainBlock.innerHTML = `
            <p style="display: none;" data-id="${data.user_id}" class="id"></p>
            <div class="window-choice">
                <h1>Видалити учасника з кімнати</h1>
                <p>Ви впевнені, що хочете видалити цього учасника з кімнати?</p>
                <div>
                    <p class="decline">Скасувати</p>
                    <p class="remove_user">Видалити</p>
                </div>
            </div>
            <div class="outline-data">
                <div class="test-container">

                    <h1 class="test-title">Тест: ${ data.title_test }</h1>

                    <div class="test-info">

                        <div class="info-row">
                            <span class="label">Ваше ім'я</span>
                            <span class="value">${ data.username }</span>
                        </div>

                        <div class="info-row">
                            <span class="label">Кількість балів</span>
                            <span class="value">${ data.points }</span>
                        </div>

                        <div class="info-row">
                            <span class="label">Кількість питант</span>
                            <span class="value">${ data.count_question }</span>
                        </div>

                        <div class="info-row">
                            <span class="label">Код приєднання</span>
                            <span class="value code" id="code">${ data.code_test }</span>
                        </div>
                    
                    </div>
                </div>
            </div>

            <div class="open-menu" id="openMenuBtn">
                <img src="${data.click_img}">
            </div>
        `

        await loadCSS('/mentor/static/css/student.css');
        await loadCSS('/mentor/static/css/chat.css');
        
        await lobbyStudent();
    })
}

//  <div class="data-users users">

// </div>

socket.on("start_test", (data) => {
    if (window.checkStatusInterval) {
        clearInterval(window.checkStatusInterval);
        window.checkStatusInterval = null;
    }

    socket.off("update_user")

    localStorage.setItem("check", "passing_page");
    localStorage.setItem("checkOportunity", "able");


    if (parseInt(data.index) != 0){
        for (let index = parseInt(localStorage.getItem("index_question")); index <= parseInt(data.index); index++){
            let chekcookies = localStorage.getItem("users_answers")
            if (chekcookies){
                let oldCookie = localStorage.getItem("users_answers")
                let cookieList = oldCookie.split(",")   

                if (cookieList.length < parseInt(data.index)){
                    cookieList.push("∅")

                    localStorage.setItem("users_answers", cookieList)
                }
            }else{
                localStorage.setItem("users_answers", "∅")
            }

        }
    }

    localStorage.setItem("index_question", data.index)

    loadPassingStudent()
})

socket.on(
    'start_passing',
    data => {
        socket.off("update_users");
        socket.off("load_chat");
        socket.off("join_room");
        localStorage.setItem("check", "passing_page");
        localStorage.setItem("checkOportunity", "able");
        loadPassingStudent()
    }
)

socket.on("next_question",
    data => {
        if (localStorage.getItem("check") != "lobby_page"){
            socket.off("side_users")
            localStorage.setItem("next_page", "result_student")

            let midletime = localStorage.getItem("wasted_time")
            midletime = (parseInt(localStorage.getItem("timeData")))
            localStorage.setItem("wasted_time", midletime);

            localStorage.setItem("timeData", "0")
            localStorage.setItem("time_question", "set")
            
            localStorage.setItem("next_page", "none")
            localStorage.setItem("index_question", parseInt(data.index_question))
            localStorage.setItem("check", "passing_page");
            localStorage.setItem("checkOportunity", "able");
            loadPassingStudent()
        }
    }
)

export async function loadPassingStudent(){
    await removeOldCSS();

    socket.off("last-end");      
    socket.off("finish_student")

    if (window.checkStatusInterval) {
        clearInterval(window.checkStatusInterval);
        window.checkStatusInterval = null;
    }

    if (window.lobbyInterval) clearInterval(window.lobbyInterval);

    const mainBlock = document.querySelector(".main")

    await fetch('/passing_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(async (data) => {
        const usernameEl = document.querySelector(".side-menu .username");
        if (usernameEl && data.username) { 
            usernameEl.textContent = data.username;
        }

        mainBlock.innerHTML = `
            <p style="display: none;" data-id="${data.user_id}" class="id"></p>

            <img class="sad_robot" src="${data.sad_robot}" alt="">
            <img class="happy_robot" src="${data.happy_robot}" alt="">

            <div class="right-answer">
                <div class="blur"></div>
                <p class="correct-text">ПРАВИЛЬНО!</p>
            </div>

            <div class="uncorrect-answer">
                <div class="red-blur"></div>
                <p class="uncorrect-text">НЕПРАВИЛЬНО!</p>
            </div>

            <div class="skip-answer">
                <div class="gray-blur"></div>
                <p class="uncorrect-text">НЕ ВСТИГЛИ!</p>
            </div>

            <div class="main-part">
                <div class="head-part">
                    <div class="bonus-block">
                        <div class="full-bonus" id="bonus"></div>
                        <p class="text-bonus">бонус</p>
                    </div>

                    <div class="timer-section phone-timer">
                        <div class="timer-box">
                            <span class="timer-display" id="timer-display">00:00</span>
                        </div>
                    </div>

                    <div class="open-menu" id="openMenuBtn">
                        <img src="${data.click_img}" alt="">
                    </div>
                </div>

                <div class="modal"></div>

                <div class="coin-anim">
                    <img class="first-coin" src="${ data.coin }" alt="">
                    <img class="second-coin" src="${ data.coin }" alt="">
                    <img class="third-coin" src="${ data.coin }" alt="">
                    <img class="fourth-coin" src="${ data.coin }" alt="">
                    <img class="fifth-coin" src="${ data.coin }" alt="">
                    <img class="sighn-plus" src="${data.plus_img}" alt="">
                </div>

                <div class= 'question'>
                    
                </div>


                <div id="image-container"></div>

                <div class= "answers">
                    
                </div>
            </div>
        `

        await renderStudentPassing();
        await loadUsers();

        // когда ментор досрочно завершает тест
        socket.on("last-end", (data) => {
            localStorage.setItem('time_question', "set");

            let midletime = localStorage.getItem("wasted_time");
            

            socket.emit('answered', {
                code: localStorage.getItem("room_code"),
                total_time: localStorage.getItem("default_time"),
                wasted_time: midletime,
                right_answered: "not",
                id_test: localStorage.getItem("test_id"),
                index: localStorage.getItem("index_question"),
                lastanswers: "∅",
                users_answers: localStorage.getItem("users_answers"),
                finish: true
            });


        });

        socket.on("finish_student", () => {
            location.replace("/online_finish");
        });

        let openMenuBtn = document.getElementById("openMenuBtn")
        let closeMenuBtn = document.getElementById("closeMenuBtn")
        let sideMenu = document.querySelector(".side-menu")

        if (openMenuBtn && closeMenuBtn && sideMenu) {
            openMenuBtn.addEventListener("click", function() {
                sideMenu.classList.add("active-menu")
            })

            closeMenuBtn.addEventListener("click", function() {
                sideMenu.classList.remove("active-menu")
            })
        }
    })
}