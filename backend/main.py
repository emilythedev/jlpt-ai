import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
load_dotenv()

from typing import Annotated
from fastapi import FastAPI, Query, Request
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

# Exception hanlders
@app.exception_handler(JsonParsingError)
async def json_parsing_exception_handler(request: Request, e: JsonParsingError):
    print(f"JsonParsingError: {e.response_text}")
    return JSONResponse(
        status_code=500,
        content={"detail": "AI response was not valid JSON or missing fields."}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, e: Exception):
    print(f"Exception: {e}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Failed with error: {e}"}
    )

# Request handlers
@app.get("/question", response_model=QuestionResponse)
async def generate_jlpt_question(lv: JLPTLevel):
    questions = await generate_grammar_mc(lv, 1)
    return questions[0]

@app.get("/grammar_quiz", response_model=list[QuestionResponse])
async def generate_grammar_quiz(
    lv: Annotated[JLPTLevel, Query(description="JLPT level")],
    c: Annotated[int, Query(ge=1, le=50, description="Number of questions")] = 1,
    scp: Annotated[str | None, Query(description="Grammar scope")] = None,
):
    return await generate_grammar_mc(lv, c, scp)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
