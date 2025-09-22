import os
from pydantic import BaseModel, Field
from pydantic.json_schema import GenerateJsonSchema
from pydantic.type_adapter import TypeAdapter
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

class GoogleCompatibleSchemaGenerator(GenerateJsonSchema):
    def generate_inner(self, schema): # pyright: ignore[reportMissingParameterType]
        json_schema = super().generate_inner(schema)
        if 'examples' in json_schema:
            del json_schema['examples']
        return json_schema

# Pydantic models for response
class QuestionResponse(BaseModel):
    question: str = Field(..., description="問題文", examples=["昨日は熱があった（　　）、会社を休みました。"])
    options: list[str] = Field(..., description="選択肢", examples=[["ので", "のに", "ても", "ながら"]])
    correct_answer: str = Field(..., description="正解", examples=["ので"])
    explanation: str = Field(..., description="解説", examples=["「ので」は理由や原因を表す接続助詞です。"])

QuestionResponseList = TypeAdapter(list[QuestionResponse])

# Define the allowed JLPT levels using Literal for type safety
JLPTLevel = Literal['n1', 'n2', 'n3', 'n4', 'n5']

async def generate_grammar_mc(level: JLPTLevel, count: int = 1, grammar_scope: str | None = None):
    level_for_prompt = level.upper()
    user_prompt = f"JLPT {level_for_prompt}レベルの文法問題を{count}問生成してください。"

    if grammar_scope:
        user_prompt = f"JLPT {level_for_prompt}レベルの「{grammar_scope}」に関する文法問題を{count}問生成してください。"

    system_instruction = [
        "あなたは外国人に日本語を教える日本語教師です。これから文法の復習問題を作成します。",
        "以下の指示に従ってください。",
        "1. まず、指定された文法範囲に基づいて例文を作成します。例文は、仕事、学校、外出、ニュース、エッセイなど、日本人が日常生活で使うような自然な文脈にしてください。",
        "2. 次に、例文の中からテストしたい文法部分を抜き出して（　　）で空欄にし、それを正解の選択肢とします。",
        "3. そして、不正解の選択肢を3つ作成します。不正解の選択肢は、大人の日本語学習者が間違いやすい、紛らわしい文法や品詞などを含めてください。",
        "4. 最後に、なぜその答えが文法・意味的に最も良い選択なのかを解説してください。",
        "以下の要件を厳守してください：",
        "- 各問題には4つの選択肢（正解1つ、不正解3つ）が必要です。",
        "- 正解の選択肢はランダムな位置に配置してください。",
        "- 選択肢は互いに重複しないこと。",
    ]

    response = client.models.generate_content(
        model=GEMINI_MODEL_ID,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=QuestionResponseList.json_schema(schema_generator=GoogleCompatibleSchemaGenerator),
            temperature=0.9
        )
    )

    if response.parsed is not None:
        questions: list[QuestionResponse] = response.parsed # pyright: ignore[reportAssignmentType]
        return questions
    else:
        raise JsonParsingError(response.text if response.text is not None else 'Empty response.')
