from flask import Flask, request, jsonify
from chatbot import ChatBot

app = Flask(__name__)

# Khởi tạo chatbot
chatbot = ChatBot(api_key='AIzaSyDINuMsM7lgc2JLtSS5ZpVBFasC1g2PIvA')
chatbot.start_conversation()

# Tạo endpoint API
@app.route('/chatbot', methods=['POST'])
def chatbot_endpoint():
    user_input = request.json.get('question', '')
    try:
        response = chatbot.send_prompt(user_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
