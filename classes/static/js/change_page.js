const allClasses = document.querySelectorAll(".class-card")

allClasses.forEach(mentorClass => {
    mentorClass.addEventListener('click',
        () => {
            console.log(12)
            const code = mentorClass.querySelector(".btn-delete").value
            location.replace(`/mentor_class?class_key=${code}`)
        }
    )
})