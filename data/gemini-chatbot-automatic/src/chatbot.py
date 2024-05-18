import google.generativeai as genai

class GeniAIException(Exception):
    """GenAI Exception base class"""

class ChatBot:
    """ Chat can only have one candidate count """
    CHATBOT_NAME = 'My Gemini AI'

    def __init__(self, api_key):
        self.genai = genai
        self.genai.configure(api_key=api_key)
        self.model = self.genai.GenerativeModel('gemini-pro')
        self.conversation = None
        self._conversation_history = []
        self.preload_conversation()

    def send_prompt(self, location, places, temperature=0.1):
        if temperature < 0 or temperature > 1:
            raise GeniAIException('Temperature must be between 0 and 1')
        if not location or not places:
            raise GeniAIException('Location and places cannot be empty')
        
        # Xây dựng câu prompt dựa trên input của người dùng và danh sách địa điểm
        places_list = ', '.join(places)
        prompt = (f'Tôi có DANH SÁCH các địa điểm ở {location} là: {places_list}\n'
                  'Liệt kê 10 địa điểm NỔI TIẾNG nhất trong DANH SÁCH trên.\n'
                  'YÊU CẦU phải viết đúng hệt định dạng, chữ hoa và chữ thường giống với địa điểm trong DANH SÁCH đó.')
        
        try:
            response = self.conversation.send_message(
                content=prompt,
                generation_config=self._generation_config(temperature),
            )
            response.resolve()
            return f'{response.text}\n' + '---' * 20
        except Exception as e:
            raise GeniAIException(str(e))

    @property
    def history(self):
        conversation_history = [
            {'role': message.role, 'text': message.parts[0].text} for message in self.conversation.history
        ]
        return conversation_history

    def clear_conversation(self):
        self.conversation = self.model.start_chat(history=[])

    def start_conversation(self):
        self.conversation = self.model.start_chat(history=self._conversation_history)

    def _generation_config(self, temperature):
        return genai.types.GenerationConfig(
            temperature=temperature
        )

    def _construct_message(self, text, role='user'):
        return {
            'role': role,
            'parts': [text]
        }

    def preload_conversation(self, conversation_history=None):
        if isinstance(conversation_history, list):
            self._conversation_history = conversation_history
        else:
            self._conversation_history = [
                self._construct_message('From now on, return the output as a JSON object that can be loaded in Python with the key as "text". For example, {"text": "<output goes here>"}'),
                self._construct_message('{"text": "Sure, I can return the output as a regular JSON object with the key as "text". Here is an example: {"text": "Your Output"}."}', 'model')
            ]
