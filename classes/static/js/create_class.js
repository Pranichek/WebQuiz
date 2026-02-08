document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = [
        {
            btn: document.querySelector('#grade-number-btn'),
            list: document.querySelector('.number-list')
        },
        {
            btn: document.querySelector('#grade-letter-btn'),
            list: document.querySelector('.letter-list')
        },
        {
            btn: document.querySelector('#subject-btn'),
            list: document.querySelector('.subject-list')
        },
        {
            btn: document.querySelector('#type-btn'),
            list: document.querySelector('.type-menu')
        }
    ]

    const closeAllDropdowns = () => {
        dropdowns.forEach(d => {
            if (d.list) d.list.classList.remove('open')
            
            const arrow = d.btn.querySelector('.arrow-img')
            if (arrow) arrow.classList.remove('rotate')
        })
    }

    dropdowns.forEach(dropdown => {
        const { btn, list } = dropdown

        if (!btn || !list) return

        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            
            const isOpened = list.classList.contains('open')

            closeAllDropdowns()

            if (!isOpened) {
                list.classList.add('open')
                const arrow = btn.querySelector('.arrow-img')
                if (arrow) arrow.classList.add('rotate')
            }
        })

        if (!list.classList.contains('type-menu')) {
            const items = list.querySelectorAll('.dropdown-item')
            const displayElement = btn.querySelector('.selected-value') || btn.querySelector('p')

            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation()
                    
                    const dataValue = item.getAttribute('data-value')
                    const text = item.textContent

                    if (displayElement) {
                        displayElement.textContent = text
                        displayElement.style.color = "rgba(0, 0, 0, 0.4)"
                        displayElement.setAttribute('value', dataValue)
                    }

                    closeAllDropdowns()
                })
            })
        }
    })

    document.addEventListener('click', () => {
        closeAllDropdowns()
    })
})

document.querySelector(".create-button").addEventListener('click', function() {
    const classNameInput = document.querySelector(".input-name")
    const descriptionInput = document.querySelector(".description-class")
    
    const className = classNameInput ? classNameInput.value : ''
    const description = descriptionInput ? descriptionInput.value : ''

    const gradeNumberElem = document.querySelector("#grade-number-btn .selected-value")
    const gradeNumber = gradeNumberElem ? gradeNumberElem.getAttribute('value') : null

    const gradeLetterElem = document.querySelector("#grade-letter-btn .selected-value")
    const gradeLetter = gradeLetterElem ? gradeLetterElem.getAttribute('value') : null

    const subjectElem = document.querySelector("#subject-btn .selected-value")
    const subject = subjectElem ? subjectElem.getAttribute('value') : null

    const joinTypeInput = document.querySelector('input[name="join_type"]:checked')
    const joinType = joinTypeInput ? joinTypeInput.value : null

    if (!className || !gradeNumber || !gradeLetter || !subject || !joinType) {
        alert("Будь ласка, заповніть усі обов'язкові поля!")
        return
    }

    fetch('/create_class', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            class_name: className,
            grade_number: gradeNumber,
            grade_letter: gradeLetter,
            subject: subject,
            description: description,
            join_type: joinType
        })
    })
    .then(response => {
        if (response.redirected) {
             window.location.href = response.url
        } else {
             return response.json()
        }
    })
    .then(data => {
        if (data && data.redirect_url) {
            window.location.href = data.redirect_url
        }
    })
    .catch(error => console.error('Помилка:', error))
})