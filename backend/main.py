import os
from dotenv import load_dotenv
load_dotenv()

from typing import Annotated
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from generator import generate_grammar_mc, QuestionResponse, JLPTLevel, JsonParsingError

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
        questions = await generate_grammar_mc(lv)
        if questions:
            return questions[0]
        raise HTTPException(status_code=500, detail="AI failed to generate a question.")
    except JsonParsingError as e:
        print(f"JsonParsingError: {e.response_text}")
        raise HTTPException(status_code=500, detail=f"AI response was not valid JSON or missing fields.")
    except Exception as e:
        print(f"Error generating question: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {e}")

@app.get("/grammar_quiz", response_model=list[QuestionResponse])
async def generate_grammar_quiz(
    lv: Annotated[JLPTLevel],
    c: Annotated[int, Query(ge=1, le=50)] = 1,
    scp: Annotated[str | None, Query()] = None,
):
    try:
        return await generate_grammar_mc(lv, c, scp)
    except JsonParsingError as e:
        print(f"JsonParsingError: {e.response_text}")
        raise HTTPException(status_code=500, detail=f"AI response was not valid JSON or missing fields.")
    except Exception as e:
        print(f"Error generating question: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
