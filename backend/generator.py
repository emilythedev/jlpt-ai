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

    prompt = f"""あなたは日本語を外国人に教えるネイティブの日本語教師です。
    JLPTのシラバスに基づき、{level_for_prompt}レベルの文法に関する多肢選択問題を{count}問、JSON形式で生成してください。

    以下の要件を厳守してください：
    - 各問題には4つの選択肢を設けること。
    - 選択肢は互いに重複しないこと。
    - 正解は1つだけであること。
    - 各問題には、なぜその答えが正しいのかを説明する簡潔な日本語の解説を含めること。
    - JSON形式のみを返し、他のテキストは含めないこと。
    - JSONの形式例: [{sample_response_json}]
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
