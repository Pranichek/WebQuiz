from quiz.models import Test

def return_answers(index: int, test_id: int) -> list:
    test = Test.query.get(int(test_id))

    answers = test.answers.split("?@?")
    if index >= len(answers):
        return []
    else:
        current_answer_list = answers[index]
        # (?%+++%?)(?%+*+%?)(?%-==-%?)(?%+//+%?)

        answers = current_answer_list.split("%?)(?%")
        answers[0] = answers[0].replace("(?%", "")
        answers[-1] = answers[-1].replace("%?)", "")

        data_str = ''
        for symbol in answers:
            if symbol[0] == '+':
                data_str += "+"
            elif symbol[0] == "-":
                data_str += "-"
                
        question_right_answers = []
        for i in range(0 ,len(data_str)):
            if data_str[i] == "+":
                question_right_answers.append(i)
        
        return question_right_answers