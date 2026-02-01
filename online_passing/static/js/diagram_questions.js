document.querySelector(".button-question").addEventListener('click',
    () => {
        const dataCont = document.querySelector(".left-part")
        const diagrmCont = document.querySelector(".right-part")
        
        if (dataCont) dataCont.remove()
        if (diagrmCont) diagrmCont.remove()

        document.querySelector(".main-data").innerHTML += `
            <div class="questions-cont">
                <div class="results-grid">
                </div>
            </div>
        `
    }
)

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