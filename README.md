# JLPT-AI 🤖🇯🇵

An interactive quiz app for JLPT study, creating questions from N5 to N1 using AI. This project uses Google's Gemini to generate practice questions on the fly. You can also save questions to a local "question bank" for later revision.

This application is built for code learning and practice. Contributions and feedback are welcome!

## ✨ Features

*   **AI-Powered Quizzes**: Generate endless JLPT grammar questions from N5 to N1.
*   **Scoped Questions**: Focus your study by generating questions for a specific grammar point (e.g., "～ために").
*   **Local Question Bank**: Save questions you find tricky to your browser's storage for review.

## 🚀 Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
*   **State Management**: TanStack Query
*   **Routing**: TanStack Router
*   **Client-side Storage**: Dexie.js (IndexedDB)
*   **Backend**: Python, FastAPI
*   **AI**: Google Gemini API
*   **Containerization**: Docker Compose

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
*   A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation & Setup

1.  **Clone the repository**

2.  **Set up Environment Variables:**
    *   Create `.env` files by copying the example files.
        ```sh
        cp .env.example .env
        cp backend/.env.example backend/.env
        ```
    *   Set your Google Gemini API key in root `.env` file
    *   Change Gemini model in `backend/.env` file if needed.

3.  **Build and Run with Docker Compose:**
    *   From the root directory of the project, run the following command:
        ```sh
        docker compose up --build
        ```
    *   This command will:
        *   Build the Docker images for both the `frontend` and `backend` services.
        *   Start the containers.

4.  **Access the Application:**
    *   Once the containers are running, open your browser and navigate to:
    *   **Frontend**: `http://localhost:5173`
    *   **Backend API Docs**: `http://localhost:8000/docs`

## 🙏 Acknowledgements

*   Google Gemini for the powerful generative AI.
*   shadcn/ui for the fantastic UI components.
*   Dexie.js for making client-side storage a breeze.
*   Google Code Assist for aiding in development.
