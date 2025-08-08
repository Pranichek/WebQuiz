import Project

def main():
    try:
        Project.execute()
        port = 7777
        print(f"Running on http http://127.0.0.1:{port}/")
        Project.socket_config.socket.run(Project.project, port = port, debug=True)
    except Exception as error:
        print(error)

if __name__ == "__main__":
    main()
