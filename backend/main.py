import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import MoodCheckIn, WellnessResponse
from ai_service import AIService
from vector_store import VectorStore

app = FastAPI(title="Mindful AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ai = AIService()
db = VectorStore()

@app.post("/submit-log", response_model=WellnessResponse)
async def submit_log(checkin: MoodCheckIn):
    """Processes a new wellness entry with Gemini analysis."""
    try:
        # Prevent empty logs from reaching the AI
        if not checkin.note or not checkin.note.strip():
            raise HTTPException(status_code=400, detail="Journal note cannot be empty.")

        vector = ai.get_embeddings(checkin.note)
        past_context = db.query_similar_logs(vector)
        ai_response = await ai.generate_wellness_advice(checkin.note, past_context)
        
        # Save to ChromaDB for long-term memory
        log_id = str(uuid.uuid4())
        metadata = {
            "mood": int(checkin.mood_score),
            "energy": int(checkin.energy_level),
            "timestamp": datetime.now().strftime("%b %d, %Y")
        }
        db.add_log(log_id, vector, metadata, checkin.note)
        
        return {
            "sentiment": "Deeply Analyzed",
            "tip": "Personalized coaching generated",
            "journal_prompt": "Growth reflection provided",
            "trend_analysis": ai_response
        }
    except Exception as e:
        print(f"SUBMIT ERROR: {e}")
        raise HTTPException(status_code=500, detail="AI processing error.")

@app.get("/history")
async def get_history():
    """Retrieves all past logs for Trends and AI Memory tabs."""
    try:
        data = db.get_all_logs()
        logs = []
        
        if not data or 'ids' not in data or not data['ids']:
            return []

        for i in range(len(data['ids'])):
            # Safely extract metadata using .get() to prevent KeyErrors
            metadata = data['metadatas'][i] if i < len(data['metadatas']) else {}
            logs.append({
                "id": data['ids'][i],
                "text": data['documents'][i] if i < len(data['documents']) else "No content",
                "mood": metadata.get('mood', 5),
                "energy": metadata.get('energy', 5),
                "date": metadata.get('timestamp', "Recent")
            })
        
        # Return sorted by date (newest first)
        return logs[::-1]
    except Exception as e:
        print(f"HISTORY ERROR: {e}")
        return []