import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)
        
        # Using the exact strings supported by your account
        self.generation_model = "gemini-2.0-flash" 
        self.embedding_model = "models/gemini-embedding-001"
        self.model = genai.GenerativeModel(self.generation_model)

    def get_embeddings(self, text: str):
        """Converts journal entries into 3072-dimension vectors."""
        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Embedding API Failed: {e}")
            raise e

    async def generate_wellness_advice(self, user_note: str, past_context: str):
        """Creates empathetic advice using context retrieval."""
        try:
            prompt = f"""
            System: You are an AI Wellness Coach. 
            Current Note: "{user_note}"
            Historical Context: "{past_context}"
            
            Task: Provide a warm sentiment analysis, one wellness tip, and a reflection prompt.
            Format: Use clear paragraphs. Make it supportive.
            """
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Generation Failed: {e}")
            return "I'm here for you. Take a deep breath. My connection is a bit slow, but I'm listening."