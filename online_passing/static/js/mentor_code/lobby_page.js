import { mentorRoom } from './mentor.js';
import { renderMentorResult } from './mentor_result.js';
import { mentorSettings } from './settings_mentor.js';
import { mentorTime } from './control_time.js';
import { endTest } from './end_test.js';
import { playBackgroundMusic, stopBackgroundMusic } from './top_music.js'; 

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

    return fetch('/mentor_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_id: id_test }), 
    })
    .then(response => response.json())
    .then(async (data) => {
        mainBlock.innerHTML = `
            <div id="overlay"></div>
            <div class="overlay" id="overlay"></div>

             <div class="open-menu" id="openMenuBtn">
                <img src="${data.click_img}" alt="">
            </div>

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
                            <span class="label">Кількість запитань</span>
                            <span class="value">${ data.count_question }</span>
                        </div>

                        <div class="info-row">
                            <span class="label">Час на тест</span>
                            <span class="value">${ data.time }</span>
                        </div>

                        <div class="info-row">
                            <span class="label">Код приєднання</span>
                            <span class="value code" id="code"></span>
                        </div>

                        <div class="info-row">
                            <span class="label">Посилання</span>
                            <span class="copy-url value link">joinquiz.com</span>
                        </div>
                        

                    </div>

                    <div class="qr-section">
                        <div class="qr-placeholder qr-code-outline " onclick="event.preventDefault(); showQR()">
                            <img class="qr-code-img"></img>
                        </div>
                        <p class="qr-text">Скануй QR-код та приєднуйся до тесту</p>
                    </div>
                </div>
            </div>
            <div class="modal-window" id="qrModal">
                <div class="modal-content">

                    <div class="qrcode">
                        <div class="nameofcode">
                            <h2>QR-код</h2>
                            <div class="close-btn" onclick="hideQR()">
                                <img src="${data.exit_img}" alt="exit">
                            </div>
                        </div>
                        
                        <div class="qr-code-div">
                            <img class="qr-code-img" src="" alt="QR код">
                        </div>
                    </div>

                    <div class="bottom-part">
                        <h3 id="for-text">Або приєднуйся по коду!</h3>
                        <h2 class="code-room"></h2>
                    </div>
                </div>
            </div>
        `

        await loadCSS('/mentor/static/css/mentor.css');
        await loadCSS('/mentor/static/css/chat.css');
        
        await mentorRoom();
    })
}

socket.on(
    "start_passing",
    data => {
        socket.off("set_qrcode");

        document.querySelector(".main").innerHTML = "";
        const urlParams = new URLSearchParams(window.location.search);
        const id_test = urlParams.get('id_test');
        
        localStorage.setItem("index_question", "0");
        localStorage.setItem("room_id", data.code);
        localStorage.setItem("test_id", id_test);
        localStorage.setItem("check", "settings_page");
        localStorage.setItem("flag_time", "true")
        document.querySelector(".users-list-container").innerHTML = ``
        loadPassingMentor()
    }
);

socket.on("next_question", data => {
    localStorage.setItem("flag_time", "true")
    localStorage.setItem("check", "settings_page");
    loadPassingMentor()
})


export async function loadPassingMentor(){
    // отключаем старые финтеплющки по цсс и джс
    const mainCont = document.querySelector(".main");
    mainCont.style.transition = 'opacity 0.3s ease'; 
    mainCont.style.opacity = '0';
    
    await removeOldCSS();

    playBackgroundMusic();

    // отключают старые обработчкии чтобы ихвильнихт не отвечали старые
    socket.off("user_joined");
    socket.off("update_users");
    socket.off("load_chat");
    socket.off("set_qrcode");

    if (window.lobbyInterval) clearInterval(window.lobbyInterval);
    

    const mainBlock = document.querySelector(".main")

    await loadCSS('/mentor/static/css/side_menu.css')

    await fetch('/image_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(async (data) => {
        mainBlock.innerHTML =  `
            <div class="overlay" id="overlay"></div>

            <div class="window-choice">
                <h1>Видалити учасника з кімнати</h1>
                <p>Ви впевнені, що хочете видалити цього учасника з кімнати?</p>
                <div>
                    <p class="decline">Скасувати</p>
                    <p class="remove_user">Видалити</p>
                </div>
            </div>

            <div class="question-cont">
                <div class="question-test">
                    <div class="num-question">
                        <p class="num-que"></p>
                    </div>

                    <div class= "question-bg">
                        <p class="question-text">
                        </p>
                    </div>

                </div>


                <div class="answers-test">

                </div>
            </div>
        `   


        const rightMenu = document.querySelector(".side-menu");

        if (rightMenu) {
            const existingUsersList = rightMenu.querySelector(".outline-users");
            if (existingUsersList) {
                existingUsersList.remove(); 
            }

            rightMenu.innerHTML = `
                <button class="close-menu" id="closeMenuBtn">&times;</button>

                <div class="participants-section">
                    <div class="section-header">
                        <div class="questions">
                            <span>ПИТАННЯ</span>
                            <span class="questions-mentor">1/10</span>
                        </div>

                        <div class="timer-box">
                            <span id="timer-display">00:00</span>
                        </div>

                        <div class="count-people">
                            <span class="title">УЧАСНИКИ</span>
                            <span class="count text-people">0/0</span>
                        </div>
                    </div>
                    
                    <div class="divider"></div>

                    <div class="table-data">
                        <p class="place-part">місце</p>
                        <div class="line-table"></div>
                        <p class="full-name">ПІБ</p>
                        <div class="line-table"></div>
                        <p class="accuracy-part">%</p>
                        <div class="line-table"></div>
                        <p class="points-part">бали</p>
                    </div>

                    <div class="divider"></div>

                    </div>
                </div>

                    

                <div class="controls-section">
                    <div class="playback-controls">
                        <button class="ctrl-btn pause stop-button">
                            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        </button>
                        <button class="ctrl-btn add-time">+15</button>

                        <button class="ctrl-btn next end_question">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"></path>
                            </svg>
                        </button>

                        <button class="ctrl-btn stop open-modal-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"></rect></svg>
                        </button>
                    </div>

                    <button class="view-answers-btn check-answers">
                        Переглянути відповіді
                    </button>
                </div>
            `;

            const participantsSection = rightMenu.querySelector(".participants-section");
            
            if (existingUsersList) {
                participantsSection.appendChild(existingUsersList);
            } else {
                const newList = document.createElement("div");
                newList.className = "users-list-container outline-users";
                participantsSection.appendChild(newList);
            }
        }

        // await loadCSS('/mentor/static/css/settings_mentor.css');
        

        mainCont.style.opacity = '1';

        
        await mentorSettings()
        await mentorTime()
        await endTest()

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

socket.on("page_result", data => {
    localStorage.setItem("check", "result_mentor");
    mentorResult()
});

socket.on("no_time", data => {
    localStorage.setItem("check", "result_mentor");
    mentorResult()
});


export async function mentorResult(){
    const mainCont = document.querySelector(".main");
    mainCont.style.transition = 'opacity 0.3s ease'; 
    mainCont.style.opacity = '0';

    // отключаем старые финтеплющки по цсс и джс
    await removeOldCSS();

    stopBackgroundMusic();

    // отключают старые обработчкии чтобы ихвильнихт не отвечали старые
    socket.off("user_joined");
    socket.off("update_users");
    socket.off("load_chat");
    socket.off("set_qrcode");

    if (window.lobbyInterval) clearInterval(window.lobbyInterval);

    const mainBlock = document.querySelector(".main")

    await loadCSS('/mentor/static/css/mentor_result.css');
    await loadCSS('/mentor/static/css/side_menu.css');

    await fetch('/image_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(async (data) => {
        mainBlock.innerHTML =`
            <div class="overlay" id="overlay"></div>

            <div class="window-choice">
                <h1>Видалити учасника з кімнати</h1>
                <p>Ви впевнені, що хочете видалити цього учасника з кімнати?</p>
                <div>
                    <p class="decline">Скасувати</p>
                    <p class="remove_user">Видалити</p>
                </div>
            </div>
            
            <div class="main-part">
                <div class="open-menu" id="openMenuBtn">
                    <img src="${data.click_img}" alt="">
                </div>

            <div class="top-diagrams">
                    <div class="circle-diagram">

                    </div>
                    <div class="column-diagram">

                    </div>
            </div>
            <div class="bottom-diagrams">
                <div class="by-answer">

                </div>
            </div>
            </div>
        `
        const rightMenu = document.querySelector(".side-menu");

        if (rightMenu) {
            const existingUsersList = rightMenu.querySelector(".outline-users");
            if (existingUsersList) {
                existingUsersList.remove(); 
            }

            rightMenu.innerHTML = `
                <button class="close-menu" id="closeMenuBtn">&times;</button>

                <div class="participants-section">
                    <div class="section-header">
                        <div class="questions">
                            <span>ПИТАННЯ</span>
                            <span class="questions-mentor">5/10</span>
                        </div>
                        <div class="count-people">
                            <span class="title">УЧАСНИКИ</span>
                            <span class="count text-people">0/0</span>
                        </div>
                    </div>
                    
                    <div class="divider"></div>

                    <div class="table-data">
                        <p class="place-part">місце</p>
                        <div class="line-table"></div>
                        <p class="full-name">ПІБ</p>
                        <div class="line-table"></div>
                        <p class="accuracy-part">%</p>
                        <div class="line-table"></div>
                        <p class="points-part">бали</p>
                    </div>

                    <div class="divider"></div>

                    </div>

                <div class="controls-section">
                    <button class="view-answers-btn check-answers end-test open-modal-btn">
                        Завершити тест
                    </button>
                    <button class="view-answers-btn check-answers next-question">
                        Наступне питання
                    </button>
                </div>
            `;

            const participantsSection = rightMenu.querySelector(".participants-section");
            
            if (existingUsersList) {
                participantsSection.appendChild(existingUsersList);
            } else {
                const newList = document.createElement("div");
                newList.className = "users-list-container outline-users";
                participantsSection.appendChild(newList);
            }
        }
        
        mainCont.style.opacity = '1';




        await renderMentorResult()
        await endTest()

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

        // Знаходимо елемент за ID
        // const selectElement = document.getElementById('choice-diagram');

        // if (selectElement) {
        //     selectElement.addEventListener('change', function(event) {
        //         const selectedValue = event.target.value;
                
        //         if (selectedValue === "users-answers") {
        //             return fetch('/users-answers', {
        //                 method: 'POST',
        //                 headers: { 'Content-Type': 'application/json' },
        //                 body: JSON.stringify({ test_id: id_test }), 
        //             })
        //             .then(response => response.json())
        //             .then(async (data) => {

        //             })
        //         }    
        //     });
        // }

    })
}

// <div class="users">
//     <div class="head-titles">
//         <p class="place">№</p>

//         <p class="name">ім'я учня</p>
//         <p class="answers-icons">відповіді</p>
//         <p class="last-answers">остання відповідь</p>
//         <p class="points">бали</p>

//         <p class="outline-accuracy-table">точність</p>
//     </div>

//     <div class="list-users">
//         <div class="user dark">
//                 <p class="place">1</p>
//                 <p class="name">dfvdf/p>

//             <div class="answers-icons input-answers">
//                 <div class="outline-answers">
//                     dvdvdfv
//                 </div>
//             </div>

//             <p class="last-answers">остання відповідь</p>

//             <p class="points">4334</p>

//             <div class="outline-accuracy-table">
//                 <p class="text-accuracy">21%</p>
//                 <div class="fill-accuracy" style="width: 0%" data-width="21%"></div>
//             </div>
//         </div>
//     </div>
// </div>
