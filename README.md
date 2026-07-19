# Realworld_problem_solutions

# Railway AI Booking & Metro Gate System

## Setup Instructions
1. **Database:** Run `database/schema.sql` in PostgreSQL.
2. **Python AI:** 
   - `cd python-ai-service`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --port 8000`
3. **Node Backend:**
   - `cd node-backend`
   - `npm install`
   - `npm start`

## API Endpoints
- `POST /api/bookings/book` (Books ticket, returns QR token)
- `POST /api/gate/verify` (Metro gate scanner hits this with QR token)
- `GET /api/admin/recommendations?train_id=1&date=2026-07-20` (Gets AI compartment recommendations)
