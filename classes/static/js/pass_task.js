function toggleTaskStatus(taskId) {
    fetch('/toggle_task_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'task_id': taskId })
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        if (data.success) {
            window.location.reload()
        } else {
            alert('Помилка: ' + data.error)
        }
    })
    .catch(function(error) {
        console.error('Error:', error)
    })
}