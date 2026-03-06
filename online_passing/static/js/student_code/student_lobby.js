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
            <div class="blur-wrapper">
                <div class="background-blur"></div>
            </div>

            <div class="user-data">
                <div class="outline">
                    <div class="top-data">
                        <div class="main-data">
                            <div class="cont-ava">
                                <img data-size="" class="avatar" src="${data.avatar_url}" alt="avatar">
                            </div>
                            <div class="text-data">
                                <p class="user-nickname" data-value="${ data.username }">${ data.username }</p>
                                <p class="gmail-text email" data-value="${ data.email }">${ data.email }</p>
                                
                            </div>
                        </div>
                        <div class="join-data">
                            <div class="code-join">
                                <p>Kод приєднання</p>
                                <div class="right-cont">
                                    <div class="outline-code">
                                        <p class="code-room"></p>
                                    </div> 
                                    <img class="copy copy-code img-copy" src="${ data.copy_img }" alt="copy icon">
                                </div>
                            </div>

                            <div class="link-join">
                                <p>Скопіюйте посилання</p>
                                <div class="right-cont copy-url">
                                    <p class="link-copy copy-url">joinquiz.com</p>
                                    <img class="copy img-copy copy-url" src="${ data.copy_img }" alt="copy icon">
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    <div class="bottom-data">
                        <div class="two-blocks">
                            <div class="block-data money-block">
                                <p>ваші бали</p>
                                <div class="outline-block">
                                    30
                                </div>
                            </div>
                            <div class="block-data pet-block">
                                <p>улюбленець</p>
                                <div class="outline-block pet-outline" class="own-pet{">
                                    <img src="${data.pet_img}"></img>
                                </div>
                            </div>
                        </div>
                        <div class="count-people">
                            <p>кількість учасників</p>
                            <p class="count">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="data-users users">

            </div>
        `

        await loadCSS('/mentor/static/css/student.css');
        await loadCSS('/mentor/static/css/chat.css');
        
        await lobbyStudent();
    })
}

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
        // await loadCSS('/test_pass/static/css/passing_test.css');
        // await loadCSS('/mentor/static/css/side_menu.css');

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

                    <div class="outline-click">
                        <div class="open-menu" id="openMenuBtn">
                            <img src="${data.click_img}" alt="">
                        </div>
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

            <div class="side-menu">
                <button class="close-menu" id="closeMenuBtn">&times;</button>

                <div class="timer-section margin-timer">
                    <div class="timer-box">
                        <span class="timer-display" id="timer-display">00:00</span>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="participants-section">
                    <div class="section-header">
                        <span class="title">УЧАСНИКИ</span>
                        <span class="count text-people">0/0</span>
                    </div>
                    
                    <div class="users-list-container outline-users">
                    </div>
                </div>

                <div class="controls-section student-control">
                    <p class="username">Грінченко Володимир</p>
                    <div class="cont">
                        <div class="left-part">
                            <img src="${data.correct}" alt="sign-correct">
                            <p>Правильних:</p>
                        </div>
                        <p class="correct_answers">0</p>
                    </div>

                    <div class="cont">
                        <div class="left-part">
                            <img src="${data.uncorrect}" alt="sign-uncorrect">
                            <p>Неправильних:</p>
                        </div>
                        <p class="uncorrect_answers">0</p>
                    </div>

                    <div class="cont">
                        <div class="left-part">
                            <img src="${data.skip}" alt="sign-skip">
                            <p>Пропущено:</p>
                        </div>
                        <p class="skip_answers">0</p>
                    </div>

                    <div class="cont">
                        <div class="left-part">
                            <img src="${data.accuracy}" alt="sign-accuracy">
                            <p>Точність:</p>
                        </div>
                        <p class="accuracy-text">0%</p>
                    </div>

                    <div class="cont">
                        <div class="left-part">
                            <img src="${data.points}" alt="sign-points">
                            <p>Бали:</p>
                        </div>
                        <p class="points-text">0</p>
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