document.addEventListener('DOMContentLoaded', () => {
    const plusBtn = document.querySelector(".img-plus")
    const choiceModal = document.querySelector(".choice-task")
    const createModal = document.querySelector(".create-task-modal")
    const overlay = document.querySelector(".modal-overlay")
    const announceBtn = document.querySelector(".anounce")

    if (plusBtn && choiceModal && overlay) {
        plusBtn.addEventListener('click', () => {
            choiceModal.classList.add('open')
            overlay.classList.add('open')
        })

        if (announceBtn && createModal) {
            announceBtn.addEventListener('click', () => {
                choiceModal.classList.remove('open')
                createModal.classList.add('open')
            })
        }

        overlay.addEventListener('click', () => {
            choiceModal.classList.remove('open')
            if (createModal) createModal.classList.remove('open')
            overlay.classList.remove('open')
        })
    }
})

document.querySelector(".submit-task-btn").addEventListener('click', () => {
    const modal = document.querySelector('.create-task-modal')    
    const title = modal.querySelector('input[name="title"]').value
    const description = modal.querySelector('input[name="description"]').value // Или input.full-input
    
    const weeks = modal.querySelector('input[name="weeks"]').value || 0
    const days = modal.querySelector('input[name="days"]').value || 0
    const hours = modal.querySelector('input[name="hours"]').value || 0
    const minutes = modal.querySelector('input[name="minutes"]').value || 0

    const urlParams = new URLSearchParams(window.location.search)
    const classKey = urlParams.get('class_key')

    // Проверка на обязательные поля
    if (!title || !description) {
        alert("Будь ласка, заповніть тему та опис завдання")
        return
    }

    fetch('/create_task', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            class_key: classKey, 
            title: title,
            description: description,
            weeks: weeks,
            days: days,
            hours: hours,
            minutes: minutes
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload()
        }
    })
    .catch(error => console.error('Помилка', error))
})