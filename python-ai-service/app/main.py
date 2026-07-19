from fastapi import FastAPI
from pydantic import BaseModel
from ml_buffer_predictor import predict_dynamic_buffer
from peak_predictor import predict_peak_and_recommend
from genai_booking_agent import handle_genai_query

app = FastAPI(title="Railway AI Service")

class BufferRequest(BaseModel):
    train_id: int
    boarding: str
    destination: str

class PeakRequest(BaseModel):
    train_id: int
    journey_date: str
    current_capacity: int

class GenAIRequest(BaseModel):
    user_query: str
    context: dict

@app.post("/api/ai/predict-buffer")
async def get_dynamic_buffer(req: BufferRequest):
    buffer = predict_dynamic_buffer(req.train_id, req.boarding, req.destination)
    return {"dynamic_buffer": buffer}

@app.post("/api/ai/predict-peak")
async def get_peak_recommendation(req: PeakRequest):
    recommendation = predict_peak_and_recommend(req.train_id, req.journey_date, req.current_capacity)
    return recommendation

@app.post("/api/ai/chat")
async def chat_with_agent(req: GenAIRequest):
    response = handle_genai_query(req.user_query, req.context)
    return {"ai_response": response}
