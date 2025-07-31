import os
from pydantic import BaseModel, Field
import google.generativeai as genai
from typing import Literal

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

# Define the allowed JLPT levels using Literal for type safety
JLPTLevel = Literal['n1', 'n2', 'n3', 'n4', 'n5']

async def generate_grammar_mc(level: JLPTLevel):
    level_for_prompt = level.upper()

    prompt = f"""
    JLPT {level_for_prompt}レベルの文法または語彙を使った日本語四択問題を1問、正解インデックスとともにJSON形式で生成。
    正解インデックスは0から3の間でランダムに選択してください。
    他のテキストは不要。
    例: {sample_response_json}
    """

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
