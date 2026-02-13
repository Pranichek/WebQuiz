const socket = io()
const startButtons = document.querySelectorAll(".start-button")

const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('class_key')



startButtons.forEach(button => {
    button.addEventListener(
        'click',
        () => {
            socket.emit(
                'load_test',
                {test_id: button.value, code_class: code}
            )
        }
    )
})

socket.emit(
    'connect_room',
    {class_code: code}
)


socket.on(
    'change_page',
    (data) => {
        localStorage.setItem("room_code", data.code_class)
        location.replace(`/mentor?id_test=${data.test_id}`)
    }
)