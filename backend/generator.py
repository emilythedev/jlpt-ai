import os
from pydantic import BaseModel, Field
import google.generativeai as genai
from typing import Literal
import json

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
    correct_answer: str
    explanation: str

sample_response_json = QuestionResponse(
    question="先生のご指導（　　）、試験に合格できました。",
    options=["のおかげで", "なせいで", "のおかげに", "にもかかわらず"],
    correct_answer="のおかげで",
    explanation="「～のおかげで」は、恩恵や良い結果の原因を表す表現です。"
).model_dump_json()

# Define the allowed JLPT levels using Literal for type safety
JLPTLevel = Literal['n1', 'n2', 'n3', 'n4', 'n5']

async def generate_grammar_mc(level: JLPTLevel, count: int = 1):
    level_for_prompt = level.upper()

    prompt = f"""
    JLPT {level_for_prompt}レベルの文法を使った日本語四択問題を{count}問、ランダムな順番の選択肢、正解、簡潔な日本語の解説とともにJSON形式で生成。
    他のテキストは不要。
    例: [{sample_response_json}]
    """

    response = model.generate_content(prompt)
    text_response = response.text.strip()

    # Remove markdown code block wrappers if they appear, as we want pure JSON
    if text_response.startswith("```json"):
        text_response = text_response.replace("```json", "").replace("```", "").strip()
    elif text_response.startswith("```"):
        text_response = text_response.replace("```", "").strip()

    data_list = json.loads(text_response)
    return [QuestionResponse.model_validate(item) for item in data_list]
