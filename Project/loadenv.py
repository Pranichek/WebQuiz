import dotenv, os
from os.path import abspath, join, exists

def execute(): 
    """
        Ця функція автоматично налаштує базу даних
    """
    ENV_PATH = abspath(join(__file__, "..", "..", ".env"))
    MIGRATIONS_PATH = abspath(join(__file__, "..", "migrations"))

    if exists(ENV_PATH):
        dotenv.load_dotenv(dotenv_path = ENV_PATH)

        if not exists(MIGRATIONS_PATH):
            os.system(os.environ["DB_INIT"])

        os.system(os.environ["DB_MIGRATE"])
        os.system(os.environ["DB_UPGRADE"])

