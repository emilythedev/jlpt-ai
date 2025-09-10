import os
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from typing import Literal

client = genai.Client()

GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL_ID", "gemini-1.5-flash")

class JsonParsingError(Exception):
    """Custom exception for errors when parsing JSON from the AI model."""
    def __init__(self, response_text: str):
        super().__init__('Failed to parse JSON response')
        self.response_text = response_text

# Pydantic models for response
class QuestionResponse(BaseModel):
    question: str = Field(..., description="問題文", examples=["昨日は熱があった（　　）、会社を休みました。"])
    options: list[str] = Field(..., description="選択肢", examples=[["ので", "のに", "ても", "ながら"]])
    correct_answer: str = Field(..., description="正解", examples=["ので"])
    explanation: str = Field(..., description="解説", examples=["「ので」は理由や原因を表す接続助詞です。"])

# Define the allowed JLPT levels using Literal for type safety
JLPTLevel = Literal['n1', 'n2', 'n3', 'n4', 'n5']

async def generate_grammar_mc(level: JLPTLevel, count: int = 1, grammar_scope: str | None = None):
    level_for_prompt = level.upper()
    user_prompt = f"JLPT {level_for_prompt}レベルの文法問題を{count}問生成してください。"

    if grammar_scope:
        user_prompt += f"特に「{grammar_scope}」に関する文法に焦点を当ててください。"

    system_instruction = [
        "あなたは日本語を外国人に教えるネイティブの日本語教師です。",
        "指定されたJLPTレベルと問題数に応じて、文法に関する多肢選択問題を生成してください。",
        "まず、設問の核となる、文法的に正しく意味が通じる、自然な日本語の例文を作成します。",
        "次に、その文からテストしたい文法部分を抜き出して（　　）で示し、それを正解の選択肢とします。",
        "以下の要件を厳守してください：",
        "- 各問題には4つの選択肢を設けること。",
        "- 正解の順番はランダムにすること。",
        "- 選択肢は互いに重複しないこと。",
        "- 正解は1つだけであること。",
        "- 不正解の選択肢は、大人の日本語学習者が間違いやすい、紛らわしい選択肢にしてください。",
        "- 各問題の解説では、なぜその答えが文法・意味的により良い選択なのかを説明し、他の選択肢がなぜ不正解なのかも簡潔に説明してください。",
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
