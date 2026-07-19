def predict_dynamic_buffer(train_id: int, boarding: str, destination: str) -> int:
    base_buffer = 10
    if boarding == "BLR" and destination in ["ERO", "CBE"]:
        return base_buffer + 5
    return base_buffer
