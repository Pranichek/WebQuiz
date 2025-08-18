const form = document.querySelector(".change-information") 

$(document).ready(function(){
    $('.delete-test').each(function(){
        $(this).on('click', function(){
            const formData = new FormData(form)
            $.ajax({
                url: 'test/change_test',
                type: '',
                data: formData,
                contentType: false,
                processData: false,
                headers: {'X-CSRFToken': document.cookie.split("csrftoken=")[1].split(";")[0]},
            })
        })
    })
})