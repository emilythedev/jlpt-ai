import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from generator import generate_grammar_mc, QuestionResponse, JLPTLevel

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS to allow requests from the frontend
origins = [
    item.strip()
    for item in os.getenv("ALLOW_ORIGINS", "http://localhost:5173").split(",")
    if item.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["get"],
    allow_headers=["*"],
)

@app.get("/question", response_model=QuestionResponse)
async def generate_jlpt_question(lv: JLPTLevel):
    try:
        questions = await generate_grammar_mc(lv, c)
        return questions[0]

    except Exception as e:
        print(f"Error generating question: {e}")
        detail = str(e)
        # Attempt to provide more context if JSON parsing failed
        if "JSON" in detail or "value_error.missing" in detail or "validation error" in detail:
            detail = f"AI response was not valid JSON or missing fields. Full error: {e}"
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {detail}")

@app.get("/grammar_quiz", response_model=list[QuestionResponse])
async def generate_grammar_quiz(lv: JLPTLevel, c: int = 1):
    try:
        return await generate_grammar_mc(lv, c)

    except Exception as e:
        print(f"Error generating question: {e}")
        detail = str(e)
        # Attempt to provide more context if JSON parsing failed
        if "JSON" in detail or "value_error.missing" in detail or "validation error" in detail:
            detail = f"AI response was not valid JSON or missing fields. Full error: {e}"
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {detail}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
