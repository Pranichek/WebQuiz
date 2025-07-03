from quiz.models import Test

def return_answers(index: int, test_id: int) -> list:
    """
    Returns the correct answers for a given question index in a test.
    :param index: The index of the question in the test.
    :param test_id: The ID of the test.
    :return: A list of indexes of the correct answers for the specified question.
    """

    test = Test.query.get(int(test_id))

    answers = test.answers.split("?@?")
    print(index, "lol")
    print(answers, "answers")
    if index >= len(answers):
        print("Index out of range for answers list.")
        return []
    else:
        current_answer_list = answers[index]

        data_str = ''
        for symbol in current_answer_list:
            if symbol == '+' or symbol == '-':
                data_str += symbol
        data_symbol = ['']
        
        symbol_list = []
        for i in range(0 ,len(data_str), 2):
            symbol_list.append(data_str[i:i+2]) 

        question_right_answers = []
        for i in range(len(symbol_list)):
            if symbol_list[i] == '++':
                question_right_answers.append(i)

        print(question_right_answers, "question_right_answers")
        
        
        return question_right_answers