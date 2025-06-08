# import Project

# def main():
#     try:
#         Project.execute()
#         # Project.project.run(debug = True, port = 5000)
#         port = 5000
#         print(f"Сервер запускается на http://127.0.0.1:{port}/")
#         Project.socket_config.socket.run(Project.project, port = 5000, debug=True)
        
#         # print("ffff")
#     except Exception as error:
#         print(error)

# if __name__ == "__main__":
#     main()

import Project

def main():
    try:
        Project.execute()
        port = 5000
        print(f"Running on http http://127.0.0.1:{port}/")
        Project.socket_config.socket.run(Project.project, port = port, debug=True)
    except Exception as error:
        print(error)

if __name__ == "__main__":
    main()