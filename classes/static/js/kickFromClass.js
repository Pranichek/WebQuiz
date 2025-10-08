$(document).ready(function(){
    $('.kick').each(function(){
        $(this).on("click", function(){
            console.log("user pk =", $(this).attr('pk'))
            const classId = window.location.search.split("=")[1];
            $.ajax({
                url: `/class_members/delete_member/${$(this).attr('pk')}?class_id=${classId}`,
                type: "post",
            })
            document.getElementById(String($(this).attr('pk'))).remove()
        })
    })
})