const form = document.querySelector(".change-information") 
const changeTitleInput = document.getElementById("newTitle")
const changeTitleBtn = document.getElementById("changeTitleBtn")

$(document).ready(function(){
    $('.delete-test').each(function(){
        $(this).on('click', function(){
            const formData = new FormData(form)
            $.ajax({
                url: window.location.href,
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                headers: {'X-CSRFToken': document.cookie.split("csrftoken=")[1].split(";")[0]},
            })
        })
    })
})

changeTitleBtn.addEventListener(("click"), ()=>{
    changeTitleInput.classList.toggle("invisible")
    if (changeTitleInput.classList.contains("invisible") && /[a-zA-Zа-яА-Я]/.test(changeTitleInput.value)){
        const formData = new FormData(form)
        $.ajax({
            url: window.location.href,
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            headers: {'X-CSRFToken': document.cookie.split("csrftoken=")[1].split(";")[0]},
        })
        $("#testTitle").text(changeTitleInput.value)
    }
})

$(document).ready(function(){
    $('li').each(function(){
        $(this).on('click', function(){
            document.getElementById("newCatInput").value = $(this).text()
            const formData = new FormData(form)
            $.ajax({
                url: window.location.href,
                type: 'post',
                data: formData,
                contentType: false,
                processData: false,
                headers: {'X-CSRFToken': document.cookie.split("csrftoken=")[1].split(";")[0]},
            })
            $('#category').text($(this).text())
        })
    })
})