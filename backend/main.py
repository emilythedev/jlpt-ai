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
    question_text: str = Field(..., example="次の文の（　　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。\n彼女はまるで（　　）ように日本語を話す。")
    options: list[str] = Field(..., example=["１．日本人だった", "２．日本人である", "３．日本人であるかのような", "４．日本人だ"])
    correct_answer_index: int = Field(..., example=2) # 0-indexed
    explanation: str = Field(..., example="「まるで〜ようだ」は、「まるで〜であるかのような」と、見かけはそうだが実際は違うことを表す比喩表現です。選択肢３がこの文法に合致します。")

@app.get("/")
async def root():
    return {"message": "FastAPI server with Gemini Flash is running!"}

@app.get("/generate_jlpt_n3_question", response_model=QuestionResponse)
async def generate_jlpt_n3_question():
    prompt = """
    JLPT N3レベルの文法または語彙を使った日本語の四択問題を作成してください。
    問題文、選択肢（４つ）、正解、そして簡単な解説をJSON形式で提供してください。
    正解の選択肢のインデックスは0から3で指定してください。

    例:
    {
      "question_text": "次の文の（　　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。\n彼女はまるで（　　）ように日本語を話す。",
      "options": [
        "１．日本人だった",
        "２．日本人である",
        "３．日本人であるかのような",
        "４．日本人だ"
      ],
      "correct_answer_index": 2,
      "explanation": "「まるで〜ようだ」は、「まるで〜であるかのような」と、見かけはそうだが実際は違うことを表す比喩表現です。選択肢３がこの文法に合致します。"
    }

    JLPT N3レベルの文法ポイントの例:
    - ～ばいい (can, should, it would be good if)
    - ～ことになっている (to be scheduled or expected to)
    - ～に慣れる (to get used to)
    - ～仕方がない (it can't be helped)
    - ～わけにはいかない (cannot due to circumstances)
    - ～ような気がする (I have a feeling that)
    - ～からこそ (especially because)
    - ～だそうです (I heard that, it seems that)
    - ～しかない (have no choice but to)
    - ～ふり (pretend to)

    JLPT N3レベルの語彙の例:
    - 運転 (うんてん - driving)
    - 運動 (うんどう - exercise)
    - 犯罪 (はんざい - crime)
    - 判断 (はんだん - judgement)
    - 比較 (ひかく - comparison)
    - 秘密 (ひみつ - secret)
    - 微妙 (びみょう - delicate, subtle)
    - 費用 (ひよう - cost)
    - 評価 (ひょうか - evaluation)
    - 表現 (ひょうげん - expression)
    - 表情 (ひょうじょう - facial expression)
    - 平等 (びょうどう - equality)
    - 向こう (むこう - over there)
    - 夢中 (むちゅう - absorbed in)
    - 滅多に (めったに - rarely)
    - 面倒 (めんどう - trouble, bother)
    - 目的 (もくてき - purpose)
    - 申し込む (もうしこむ - to apply)
    - やはり/やっぱり (as expected)

    上記の例を参考に、新しい問題を生成してください。
    """

    try:
        response = model.generate_content(prompt)
        # Gemini often returns text with markdown code blocks, try to extract directly
        text_response = response.text.strip()
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
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
