import sys
from configparser import ConfigParser
from chatbot import ChatBot

def main():
    config = ConfigParser()
    config.read('credentials.ini')
    api_key = config['gemini_ai']['API_KEY']

    chatbot = ChatBot(api_key=api_key)
    chatbot.start_conversation()
    
    print("Gemini ChatBot.")
    
    while True:
        user_input = input("Your Question: ")
        if user_input.lower() == 'quit':
            sys.exit('Exiting ChatBot CLI...')
        try:
            response = chatbot.send_prompt(user_input)
            print(f"{chatbot.CHATBOT_NAME}: {response}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
