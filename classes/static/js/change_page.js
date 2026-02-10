const allClasses = document.querySelectorAll(".class-card")

allClasses.forEach(mentorClass => {
    mentorClass.addEventListener('click',
        () => {
            const code = mentorClass.querySelector(".btn-delete").value
            location.replace(`/mentor_class?class_key=${code}`)
        }
    )
})