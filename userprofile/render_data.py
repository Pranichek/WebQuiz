def create_email(email: str):
    count_letters = email.split("@")
    
    first_part = count_letters[0]
    ready_email = ''
    for i in range(len(first_part)):
        ready_email += "*"
    ready_email += first_part[-3:]
    ready_email += "@gmail.com"
    return ready_email
    

def render_phone_number(phone_number: int):
    if str(phone_number) != "Не під'єднан":
        str_phone = str(phone_number)
        str_phone = str_phone[2:]
        
        ready_phone = '+380 '
        ready_phone += f"({ str_phone[1:3] })"

        ready_phone += f" {str_phone[3:6]} "
        ready_phone += f" {str_phone[6:]} "    

        return ready_phone   
    else:
        str_phone = str(phone_number)

        return str_phone
