import json

def save_json(data: list | dict, path_json: str):
    try:
        with open(path_json, "w") as file:
            json.dump(
                data, # дані, які завантажуються в файл 
                file, # вказуємо файл, у який завантажуємо дані
                indent = 4, # задаємо відступи, щоб все не було у один рядок
                ensure_ascii = False # декодер для всіх символів
            )
    except Exception as error:
        print(f"Erorr while reading: {error}")

def read_json(path_json: str):
    try:
        with open(path_json, "r") as file:
            return json.load(file)
    except Exception as error:
        print(f"Erorr while reading: {error}")
        return []
    
