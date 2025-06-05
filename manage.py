import Project

def main():
    try:
        Project.execute()
        Project.project.run(debug = True, port = 7777)
        Project.socket_config.socket.tun(Project.project, host='0.0.0.0', port=7777)
    except Exception as error:
        print(error)

if __name__ == "__main__":
    main() 



