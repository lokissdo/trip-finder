from flask import Flask, request, jsonify
from configparser import ConfigParser
from chatbot import ChatBot, ChatBotException

app = Flask(__name__)

# Function to load API key from api_credentials.ini file
def load_api_key():
    config = ConfigParser()
    config.read('api_credentials.ini')
    return config['gemini_ai']['API_KEY']

# Initialize the chatbot with the API key loaded from api_credentials.ini
api_key = load_api_key()
chatbot = ChatBot(api_key=api_key)

# Route to receive requests from the client and respond with the chatbot
@app.route('/chatbotgemini', methods=['POST'])
def ask():
    # Get the question from the client's request
    user_input = request.json.get('question', '')
    if not user_input:
        return jsonify({'error': 'Question not provided'}), 400
    try:
        # Send the question to the chatbot and get the response
        response = chatbot.send_prompt(user_input)
        return jsonify({'text': response})
    except ChatBotException as e:
        # Handle exceptions from the chatbot and return error to the client
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # Run the Flask application on port 8000
    app.run(debug=True, port=8000)
