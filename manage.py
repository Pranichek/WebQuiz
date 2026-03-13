import eventlet
# Делает стандартные библиотеки асинхронными, чтобы пользователи не блокировали друг друга если какие то даніне слишокм боьльшие 
eventlet.monkey_patch()

import Project

def main():
    try:
        Project.execute()
        port = 8888
        print(f"Running on http://127.0.0.1:{port}/")
        Project.socket_config.socket.run(Project.project, port = port, debug=True, host="0.0.0.0")
    except Exception as error:
        print(error)

if __name__ == "__main__":
    main()