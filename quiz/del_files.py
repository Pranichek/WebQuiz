'''
    Файл де знаходиться функцію по видаленню файлів у папці
'''

import os
 
def delete_files_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f'Помилка файлу {file_path}. {e}')
