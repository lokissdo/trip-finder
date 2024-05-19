from flask import Flask, request, jsonify
from configparser import ConfigParser
from chatbot import ChatBot

app = Flask(__name__)

config = ConfigParser()
config.read('credentials.ini')
api_key = config['gemini_ai']['API_KEY']

chatbot = ChatBot(api_key=api_key)
chatbot.start_conversation()

@app.route('/chatbotgemini', methods=['POST'])
def ask():
    user_input = request.json.get('question', '')
    if not user_input:
        return jsonify({'error': 'Question not provided'}), 400
    try:
        response = chatbot.send_prompt(user_input)
        return jsonify({'text': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
