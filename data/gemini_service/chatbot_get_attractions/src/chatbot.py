import google.generativeai as genai  # Import module for Google Generative AI

class GeniAIException(Exception):
    """GenAI Exception base class"""

class ChatBot:
    """
    A chatbot implementation using Google Generative AI.
    """

    CHATBOT_NAME = 'My Gemini AI'  # Name of the chatbot

    def __init__(self, api_key):
        """
        Initialize the ChatBot with the provided API key.

        Args:
        - api_key (str): The API key for accessing Google Generative AI.
        """
        self.genai = genai  # Initialize the Generative AI module
        self.genai.configure(api_key=api_key)  # Configure the Generative AI module with the API key
        self.model = self.genai.GenerativeModel('gemini-pro')  # Initialize the GenerativeModel with 'gemini-pro'
        self.conversation = None  # Initialize conversation variable
        self._conversation_history = []  # Initialize conversation history
        self.preload_conversation()  # Preload conversation history

    def send_prompt(self, location, places, temperature=0.1):
        """
        Send a prompt to the Generative AI based on the provided location and places.

        Args:
        - location (str): The location for the prompt.
        - places (list of str): List of places associated with the location.
        - temperature (float): The temperature parameter for text generation.

        Returns:
        - str: The generated text response from the Generative AI.
        """
        if temperature < 0 or temperature > 1:
            raise GeniAIException('Temperature must be between 0 and 1')
        if not location or not places:
            raise GeniAIException('Location and places cannot be empty')
        
        # Build prompt based on user input and list of places
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
        """
        Get the conversation history.

        Returns:
        - list of dict: The conversation history as a list of dictionaries containing message role and text.
        """
        conversation_history = [
            {'role': message.role, 'text': message.parts[0].text} for message in self.conversation.history
        ]
        return conversation_history

    def clear_conversation(self):
        """Clear the current conversation."""
        self.conversation = self.model.start_chat(history=[])

    def start_conversation(self):
        """Start a new conversation with the preloaded conversation history."""
        self.conversation = self.model.start_chat(history=self._conversation_history)

    def _generation_config(self, temperature):
        """
        Generate a configuration for text generation.

        Args:
        - temperature (float): The temperature parameter for text generation.

        Returns:
        - GenerationConfig: A configuration object for text generation.
        """
        return genai.types.GenerationConfig(
            temperature=temperature
        )

    def _construct_message(self, text, role='user'):
        """
        Construct a message object.

        Args:
        - text (str): The text content of the message.
        - role (str): The role of the message (user or model).

        Returns:
        - dict: A dictionary representing the message.
        """
        return {
            'role': role,
            'parts': [text]
        }

    def preload_conversation(self, conversation_history=None):
        """
        Preload the conversation history.

        Args:
        - conversation_history (list of dict): The conversation history to preload.
        """
        if isinstance(conversation_history, list):
            self._conversation_history = conversation_history
        else:
            self._conversation_history = [
                self._construct_message('From now on, return the output as a JSON object that can be loaded in Python with the key as "text". For example, {"text": "<output goes here>"}'),
                self._construct_message('{"text": "Sure, I can return the output as a regular JSON object with the key as "text". Here is an example: {"text": "Your Output"}."}', 'model')
            ]
