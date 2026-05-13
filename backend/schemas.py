from pydantic import BaseModel
from typing import Optional

# This defines the data structure coming FROM the Frontend
class MoodCheckIn(BaseModel):
    mood_score: int
    energy_level: int
    note: str
    timestamp: Optional[str] = None

# This defines the data structure sent BACK to the Frontend
class WellnessResponse(BaseModel):
    sentiment: str
    tip: str
    journal_prompt: str
    trend_analysis: str