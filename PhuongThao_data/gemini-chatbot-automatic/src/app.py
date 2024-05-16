from flask import Flask, request, jsonify
from configparser import ConfigParser
from pymongo import MongoClient
from src.chatbot import ChatBot  # Sử dụng import tuyệt đối
import os
import datetime

app = Flask(__name__)

# Đảm bảo rằng đường dẫn tệp credentials.ini là tuyệt đối
config = ConfigParser()
config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'credentials.ini')
config.read(config_path)
api_key = config['gemini_ai']['API_KEY']

# Initialize ChatBot
chatbot = ChatBot(api_key=api_key)
chatbot.start_conversation()

# Connect to MongoDB
client = MongoClient('mongodb+srv://nhom10:fEqpbBnbszCefVlk@cluster0.tyqwvk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client.Group10
collection = db.attractions

@app.route('/chatbotgemini', methods=['POST'])
def ask():
    location = request.json.get('location', '')
    if not location:
        return jsonify({'error': 'Location not provided'}), 400
    
    # Query MongoDB for places in the given location
    places = collection.find({'province': location}, {'_id': 0, 'name': 1})
    places_list = list(set([place['name'] for place in places]))  # Remove duplicates
    
    if not places_list:
        return jsonify({'error': f'No places found for location: {location}'}), 404
    
    try:
        response = chatbot.send_prompt(location, places_list)
        
        # Lưu kết quả phản hồi vào tệp txt riêng biệt
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"response_{timestamp}.txt"
        with open(filename, 'w') as file:
            file.write(response)
        
        return jsonify({'text': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
