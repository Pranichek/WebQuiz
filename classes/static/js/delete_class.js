document.querySelector(".btn-delete").addEventListener('click',
    () => {
        fetch('/delete_class', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                code_class: document.querySelector(".btn-delete").value
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
    }
)