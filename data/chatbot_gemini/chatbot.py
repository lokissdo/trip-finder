import google.generativeai as genai

class ChatBotException(Exception):
    """ChatBot Exception base class"""

class ChatBot:
    """ Chat can only have one candidate count """
    CHATBOT_NAME = 'My Gemini AI'

    def __init__(self, api_key):
        # Initialize the chatbot with the API key and default configuration
        self.genai = genai
        self.genai.configure(api_key=api_key)
        self.model = self.genai.GenerativeModel('gemini-pro')
        self.conversation = None
        self._conversation_history = []
        self.preload_conversation()

    # Send a prompt to the chatbot and get the response
    def send_prompt(self, prompt, temperature=0.1):
        if temperature < 0 or temperature > 1:
            raise ChatBotException('Temperature must be between 0 and 1')
        if not prompt:
            raise ChatBotException('Prompt cannot be empty')
        try:
            response = self.conversation.send_message(
                content=prompt,
                generation_config=self._generation_config(temperature),
            )
            response.resolve()
            return f'{response.text}\n' + '---' * 20
        except Exception as e:
            raise ChatBotException(str(e))

    # Get the conversation history
    @property
    def history(self):
        conversation_history = [
            {'role': message.role, 'text': message.parts[0].text} for message in self.conversation.history
        ]
        return conversation_history

    # Clear the current conversation
    def clear_conversation(self):
        self.conversation = self.model.start_chat(history=[])

    # Start a new conversation
    def start_conversation(self):
        self.conversation = self.model.start_chat(history=self._conversation_history)

    # Configuration for generating responses
    def _generation_config(self, temperature):
        return genai.types.GenerationConfig(
            temperature=temperature
        )

    # Construct a new message
    def _construct_message(self, text, role='user'):
        return {
            'role': role,
            'parts': [text]
        }

    # Preload conversation with the provided history
    def preload_conversation(self, conversation_history=None):
        if isinstance(conversation_history, list):
            self._conversation_history = conversation_history
        else:
            self._conversation_history = [
                self._construct_message('From now on, return the output as a JSON object that can be loaded in Python with the key as "text". For example, {"text": "<output goes here>"}'),
                self._construct_message('{"text": "Sure, I can return the output as a regular JSON object with the key as "text". Here is an example: {"text": "Your Output"}."}', 'model')
            ]
