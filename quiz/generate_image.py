key = {
    "хімія": "chemistry_picture.png",
    "фізика": "physics.png",
    "математика": "math_picture.png",
    "англійська": "english_picture.png",
    "історія": "history_picture.png",
    "програмування": "programmer_image.png",
    "інше": "cover.png"
}

def return_img(category: str) -> str:
    if category in key:
        return key[category]
