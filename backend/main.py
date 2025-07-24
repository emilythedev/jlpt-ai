import os
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS to allow requests from the frontend
origins = [
    "http://localhost",
    "http://localhost:8081",  # Frontend port
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API with your API key from environment variables
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    raise RuntimeError("GEMINI_API_KEY environment variable not set.")

GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL_ID", "gemini-1.5-flash")
model = genai.GenerativeModel(GEMINI_MODEL_ID)

# Pydantic models for request and response
class QuestionResponse(BaseModel):
    question: str
    options: list[str]
    correct_answer_index: int

sample_response_json = QuestionResponse(
    question="先生のご指導（　　）、試験に合格できました。",
    options=["のおかげで", "なせいで", "のおかげに", "にもかかわらず"],
    correct_answer_index=0
).model_dump_json()

@app.get("/question", response_model=QuestionResponse)
async def generate_jlpt_question():
    prompt = f"""
    JLPT N3レベルの文法または語彙を使った日本語四択問題を1問、正解インデックスとともにJSON形式で生成。
    正解インデックスは0から3の間でランダムに選択してください。
    他のテキストは不要。
    例: {sample_response_json}
    """

    try:
        response = model.generate_content(prompt)
        text_response = response.text.strip()

        # Remove markdown code block wrappers if they appear, as we want pure JSON
        if text_response.startswith("```json"):
            text_response = text_response.replace("```json", "").replace("```", "").strip()
        elif text_response.startswith("```"):
            text_response = text_response.replace("```", "").strip()

        question_data = QuestionResponse.model_validate_json(text_response)

        # Basic validation to ensure the structure is correct
        if not (0 <= question_data.correct_answer_index < len(question_data.options)):
            raise ValueError("Correct answer index is out of bounds.")

        return question_data

    except Exception as e:
        print(f"Error generating question: {e}")
        detail = str(e)
        # Attempt to provide more context if JSON parsing failed
        if "JSON" in detail or "value_error.missing" in detail or "validation error" in detail:
            detail = f"AI response was not valid JSON or missing fields. Raw response (first 200 chars): {text_response[:200]}... Full error: {e}"
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {detail}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
