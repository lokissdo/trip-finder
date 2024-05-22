from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PIL.Image
import google.generativeai as genai

# Service class to handle interaction with GenerativeModel
class GenerativeModelService:
    def __init__(self, api_key):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro-vision')

    # Method to generate content using GenerativeModel
    def generate_content(self, img):
        response = self.model.generate_content(img)
        result = response.text.split('\n')[0].strip()
        return result

# Service class to handle content generation process
class ContentGenerator:
    def __init__(self, generative_model_service):
        self.generative_model_service = generative_model_service

    # Method to generate content from image
    def generate_content(self, image_file):
        img = PIL.Image.open(image_file)
        result = self.generative_model_service.generate_content(img)
        return result

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

with open("api_key.txt", "r") as file:
    api_key = file.read().strip()

# Initialize GenerativeModelService
generative_model_service = GenerativeModelService(api_key)
# Initialize ContentGenerator with GenerativeModelService dependency
content_generator = ContentGenerator(generative_model_service)

# Endpoint to generate content from uploaded image
@app.route('/generate-content', methods=['POST'])
def generate_content():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image provided'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(file_path)

    # Generate content using ContentGenerator
    result = content_generator.generate_content(file_path)

    return jsonify({'result': result})

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=8000)
