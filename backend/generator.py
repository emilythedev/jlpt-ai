import os
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from typing import Literal
import json

client = genai.Client()

GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL_ID", "gemini-1.5-flash")

class JsonParsingError(Exception):
    """Custom exception for errors when parsing JSON from the AI model."""
    def __init__(self, response_text: str):
        super().__init__('Failed to parse JSON response')
        self.response_text = response_text

# Pydantic models for request and response
class QuestionResponse(BaseModel):
    question: str = Field(..., example="先生のご指導（　　）、試験に合格できました。", description="問題文")
    options: list[str] = Field(..., example=["のおかげで", "のせいで", "のおかげに", "にもかかわらず"], description="選択肢")
    correct_answer: str = Field(..., example="のおかげで", description="正解")
    explanation: str = Field(..., example="「～のおかげで」は、恩恵や良い結果の原因を表す表現です。", description="解説")

# Define the allowed JLPT levels using Literal for type safety
JLPTLevel = Literal['n1', 'n2', 'n3', 'n4', 'n5']

async def generate_grammar_mc(level: JLPTLevel, count: int = 1):
    level_for_prompt = level.upper()
    user_prompt = f"JLPT {level_for_prompt}レベルの文法形式の判断に関する問題を{count}問生成してください。"

    system_instruction = [
        "あなたは日本語を外国人に教えるネイティブの日本語教師です。",
        "指定された数の多肢選択問題を生成してください。",
        "以下の要件を厳守してください：",
        "- 各問題には4つの選択肢を設けること。",
        "- 選択肢の順序はランダムにすること。",
        "- 選択肢は互いに重複しないこと。",
        "- 正解は1つだけであること。",
        "- 問題文の空欄は（　　）で示すこと。",
        "- 正解の選択肢を空欄に補った際、文法的に正しく、自然な文章が完成すること。",
        "- 不正解の選択肢は、文法的に間違いであるか、文脈に合わないものであること。",
        "- 各問題には、なぜその答えが正しいのかを説明する簡潔な日本語の解説を含めること。",
    ]

    response = client.models.generate_content(
        model=GEMINI_MODEL_ID,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=list[QuestionResponse],
            temperature=0.9
        )
    )

    questions: list[QuestionResponse] = response.parsed

    if not questions:
        raise JsonParsingError(response.text)

    return questions
