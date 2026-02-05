document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = [
        { btn: document.querySelector('.number-list').parentElement, list: document.querySelector('.number-list') },
        { btn: document.querySelector('.letter-list').parentElement, list: document.querySelector('.letter-list') },
        { btn: document.querySelector('.subject-list').parentElement, list: document.querySelector('.subject-list') },
        { btn: document.querySelector('.type-menu').parentElement, list: document.querySelector('.type-menu') }
    ]

    dropdowns.forEach(dropdown => {
        const { btn, list } = dropdown

        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            
            dropdowns.forEach(d => {
                if (d.list !== list) d.list.classList.remove('open')
            })

            list.classList.toggle('open')
        })

        if (!list.classList.contains('type-menu')) {
            const items = list.querySelectorAll('.dropdown-item')
            
            const displayElement = btn.querySelector('.selected-value') || btn.querySelector('p')

            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation()
                    
                    const dataValue = item.getAttribute('data-value')
                    
                    const text = item.textContent

                    displayElement.textContent = text
                    displayElement.style.color = "rgba(0, 0, 0, 0.4)" 

                    displayElement.setAttribute('value', dataValue)

                    list.classList.remove('open')
                })
            })
        }
    })

    // Закриття при кліку поза меню
    document.addEventListener('click', () => {
        dropdowns.forEach(d => d.list.classList.remove('open'))
    })
})

document.querySelector(".create-button").addEventListener('click', function() {
    const className = document.querySelector(".input-name").value
    const description = document.querySelector(".description-class").value
    const gradeNumber = document.querySelector("#grade-number-btn .selected-value").getAttribute('value')
    const gradeLetter = document.querySelector("#grade-letter-btn .selected-value").getAttribute('value')
    const subject = document.querySelector("#subject-btn .selected-value").getAttribute('value')
    const joinTypeInput = document.querySelector('input[name="join_type"]:checked')
    const joinType = joinTypeInput ? joinTypeInput.value : null

    console.log("kdfkmdkfvlkm")

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