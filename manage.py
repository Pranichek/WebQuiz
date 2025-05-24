import Project

def main():
    try:
        Project.execute()
        Project.project.run(debug = True, port=7777)
    except Exception as error:
        print(error)

if __name__ == "__main__":
    main() 



