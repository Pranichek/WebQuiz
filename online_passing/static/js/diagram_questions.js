document.querySelector(".button-question").addEventListener('click',
    () => {
        const dataCont = document.querySelector(".left-part")
        const diagrmCont = document.querySelector(".right-part")
        
        if (dataCont) dataCont.remove()
        if (diagrmCont) diagrmCont.remove()

        document.querySelector(".main-data").innerHTML += `
            <div class="questions-test">
                <div class="results-grid">
                </div>
            </div>
        `

        socket.emit("questions-result",
            {
                test_id: localStorage.getItem("test_id"),
                room: localStorage.getItem("room_code"),
            }
        )
    }
)

socket.on("ready_data", (data) => {
    const questionsList = data.list_data; 
    const gridContainer = document.querySelector(".results-grid");
    
    gridContainer.innerHTML = "";

    questionsList.forEach(question => {
        const stats = question.stats;
        const total = stats.total_answers > 0 ? stats.total_answers : 1; 
        const correctPercent = Math.round((stats.correct_count / total) * 100);
        
        let barsHTML = '';
        
        if (question.variants && question.variants.length > 0) {
            question.variants.forEach((variant) => {
                let heightPercent = 0;
                if (stats.total_answers > 0) {
                    heightPercent = Math.round((variant.count_choosen / stats.total_answers) * 100);
                }
                
                let visualHeight = heightPercent === 0 ? 1 : heightPercent;

                let barColor = '#7EA2CE'; 
                if (variant.is_correct) {
                    barColor = '#7ac87a'; 
                } else if (variant.count_choosen > 0) {
                    barColor = '#C48AF7'; 
                }

                barsHTML += `
                    <div class="bar-group" title="${variant.text} (Обрано: ${variant.count_choosen})">
                        <div class="bar-count">${variant.count_choosen}</div>
                        <div class="bar" style="height: ${visualHeight}%; background-color: ${barColor};"></div>
                        <span class="bar-label">${variant.text}</span>
                    </div>
                `;
            });
        } else {
            barsHTML = '<div class="axis-label" style="width:100%; text-align:center; color:#b0b0b0;">Немає даних</div>';
        }

        const cardHTML = `
            <div class="result-card">
                <div class="card-header">
                    <div class="q-number">${question.question_id.toString().padStart(2, '0')}</div>
                    <h3 class="q-title">${question.question_text}</h3>
                </div>
                
                <div class="charts-container">
                    <div class="chart-wrapper pie-wrapper">
                        <div class="visual-pie" style="background: conic-gradient(#7ac87a 0% ${correctPercent}%, #C48AF7 ${correctPercent}% 100%);">
                            <div class="pie-center-text">
                                <span class="big-num">${correctPercent}%</span>
                                <span class="small-text">Вірно</span>
                            </div>
                        </div>
                        <div class="legend">
                            <div class="legend-item">
                                <span class="dot" style="background: #7ac87a;"></span>
                                Правильно (${stats.correct_count})
                            </div>
                            <div class="legend-item">
                                <span class="dot" style="background: #C48AF7;"></span>
                                Неправильно (${stats.incorrect_count})
                            </div>
                        </div>
                    </div>

                    <div class="chart-wrapper bar-wrapper">
                        <div class="visual-bars">
                            ${barsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;

        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
});

// <div class="questions-cont">
//             <div class="results-grid">
                
//                 <div class="result-card">
//                     <div class="card-header">
//                         <div class="q-number">01</div>
//                         <h3 class="q-title">Для чого потрібен Auto Layout?</h3>
//                     </div>
                    
//                     <div class="charts-container">
//                         <div class="chart-wrapper pie-wrapper">
//                             <div class="visual-pie css-pie-1">
//                                 <div class="pie-center-text">
//                                     <span class="big-num">70%</span>
//                                     <span class="small-text">Правильно</span>
//                                 </div>
//                             </div>
//                             <div class="legend">
//                                 <div class="legend-item"><span class="dot correct"></span>Так (35)</div>
//                                 <div class="legend-item"><span class="dot wrong"></span>Ні (15)</div>
//                             </div>
//                         </div>

//                         <div class="chart-wrapper bar-wrapper">
//                             <div class="visual-bars">
//                                 <div class="bar-group">
//                                     <div class="bar" style="height: 80%; background-color: #7BC8A4;"></div>
//                                     <span class="bar-label">A</span>
//                                 </div>
//                                 <div class="bar-group">
//                                     <div class="bar" style="height: 30%; background-color: #FF8B94;"></div>
//                                     <span class="bar-label">B</span>
//                                 </div>
//                                 <div class="bar-group">
//                                     <div class="bar" style="height: 10%; background-color: #8ABBF7;"></div>
//                                     <span class="bar-label">C</span>
//                                 </div>
//                             </div>
//                             <div class="axis-label">Розподіл відповідей</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="result-card">
//                     <div class="card-header">
//                         <div class="q-number">02</div>
//                         <h3 class="q-title">Що таке Flexbox?</h3>
//                     </div>
                    
//                     <div class="charts-container">
//                         <div class="chart-wrapper pie-wrapper">
//                             <div class="visual-pie css-pie-2">
//                                 <div class="pie-center-text">
//                                     <span class="big-num">45%</span>
//                                     <span class="small-text">Складно</span>
//                                 </div>
//                             </div>
//                             <div class="legend">
//                                 <div class="legend-item"><span class="dot correct"></span>Так (20)</div>
//                                 <div class="legend-item"><span class="dot wrong"></span>Ні (25)</div>
//                             </div>
//                         </div>

//                         <div class="chart-wrapper bar-wrapper">
//                             <div class="visual-bars">
//                                 <div class="bar-group">
//                                     <div class="bar" style="height: 40%; background-color: #C39FE4;"></div>
//                                     <span class="bar-label">Flex</span>
//                                 </div>
//                                 <div class="bar-group">
//                                     <div class="bar" style="height: 90%; background-color: #8ABBF7;"></div>
//                                     <span class="bar-label">Grid</span>
//                                 </div>
//                             </div>
//                             <div class="axis-label">Популярність</div>
//                         </div>
//                     </div>
//                 </div>

//                 </div>
//         </div>