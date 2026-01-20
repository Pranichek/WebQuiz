socket.on("check_connect",
    data => {
        const page = window.location.pathname.replace("/", "");


        if (data["page"] == "start_passing" && page != "passing_student" && page != "waiting_student"){
            localStorage.setItem("index_question", parseInt(data.index_question))
            if (parseInt(data.index_question) != 0){
                for (let index = parseInt(localStorage.getItem("index_question")); index <= parseInt(data.index_question); index++){
                    let chekcookies = localStorage.getItem("users_answers")
                    if (chekcookies){
                        // отримуємо старі відповіді якщо вони були
                        let oldCookie = localStorage.getItem("users_answers")
                        let cookieList = oldCookie.split(",")   

                        if (cookieList.length <= parseInt(data.index_question)){
                            cookieList.push("∅")

                            localStorage.setItem("users_answers", cookieList)
                        }
                    }else{
                        localStorage.setItem("users_answers", "∅")
                    }

                }
            }
            window.location.replace("/passing_student")
            
        }else if(data["page"] == "result" && page != "result_student"){
            try {
                localStorage.setItem("index_question", parseInt(data.index_question))
                localStorage.setItem('time_question', "set")
            } catch (error) {
                
            }

            for (let index = parseInt(localStorage.getItem("index_question")); index <= parseInt(data.index_question); index++){
                let chekcookies = localStorage.getItem("users_answers")
                if (chekcookies){
                    // отримуємо старі відповіді якщо вони були
                    let oldCookie = localStorage.getItem("users_answers")
                    let cookieList = oldCookie.split(",")   

                    if (cookieList.length <= parseInt(data.index_question)){
                        cookieList.push("∅")

                        localStorage.setItem("users_answers", cookieList)
                    }
                }else{
                    localStorage.setItem("users_answers", "∅")
                }

            }
        
            window.location.replace("/result_student")
        }
    }
)