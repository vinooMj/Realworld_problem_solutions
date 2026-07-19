import numpy as np
from datetime import datetime

def predict_peak_and_recommend(train_id: int, journey_date: str, current_capacity: int) -> dict:
    date_obj = datetime.strptime(journey_date, '%Y-%m-%d')
    day_of_week = date_obj.weekday()
    
    base_demand = 250
    is_peak = False
    
    if day_of_week in [4, 5, 6]:
        base_demand += 150
        is_peak = True
        
    if np.random.rand() > 0.8:
        base_demand += 200
        
    predicted_demand = base_demand
    seats_per_compartment = 300 
    
    extra_seats_needed = max(0, predicted_demand - current_capacity)
    extra_compartments = int(np.ceil(extra_seats_needed / seats_per_compartment))
    
    text = f"Peak Day Detected! Add {extra_compartments} general compartment(s) for {journey_date}." if extra_compartments > 0 else "Current capacity is sufficient."
    
    return {
        "predicted_demand": predicted_demand,
        "current_capacity": current_capacity,
        "is_peak_day": is_peak,
        "recommended_extra_compartments": extra_compartments,
        "recommendation_text": text
    }
