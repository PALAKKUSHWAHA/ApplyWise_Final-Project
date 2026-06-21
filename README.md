# ApplyWise 🎯

> **AI-powered career platform** — resume analysis, tailored CV generation, interview coaching, and skill gap analysis. Runs **100% locally** via Ollama (Mistral 7B). No cloud subscriptions. No data ever leaves your machine.

<div align="center">

![ApplyWise Banner](https://img.shields.io/badge/ApplyWise-AI%20Career%20Platform-2563eb?style=for-the-badge&logo=robot&logoColor=white)
&nbsp;
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
&nbsp;
![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)
&nbsp;
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
&nbsp;
![Ollama](https://img.shields.io/badge/Ollama-Mistral%207B-orange?style=for-the-badge)

</div>

---

## Table of Contents

- [What's New](#whats-new-)
- [Features](#features-)
- [Architecture](#architecture-)
- [Prerequisites](#prerequisites-)
- [Full Setup Guide](#full-setup-guide-)
- [Running the Project](#running-the-project-)
- [API Reference](#api-reference-)
- [Project Structure](#project-structure-)
- [Scoring System](#scoring-system-)
- [Troubleshooting](#troubleshooting-)
- [Production Roadmap & Suggestions](#production-roadmap--suggestions-)
- [Contributing](#contributing-)

---

## What's New 🆕

These features were added on top of the original resume-matching engine:

### v2.0 — AI Career Assistant (June 2026)

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Full conversational career coaching via Ollama (Mistral 7B) |
| 📄 **Custom CV Generator** | Paste any job description → get a complete, ATS-optimised CV |
| 🎤 **Interview Prep** | AI-generated STAR-format interview Q&A based on your resume |
| 🔍 **Skill Gap Analysis** | Identifies missing skills with learning resources & timelines |
| ✉️ **Cover Letter Generator** | Personalised cover letters from your resume + job description |
| 🏠 **Home Page AI Panel** | Slide-in AI drawer accessible directly from the hero page |
| 🔒 **100% Local AI** | All LLM inference via Ollama — your data never leaves your machine |
| 🎨 **Full UI Rebrand** | Renamed to **ApplyWise**, consistent blue design system, light mode |
| 📱 **Responsive Design** | Premium glassmorphism UI, micro-animations, mobile-friendly |

---

## Features ✨

### 📊 Resume Analysis Engine
- Upload PDF, DOC, DOCX, TXT, JPG, or PNG resumes
- Multi-dimensional compatibility scoring:
  - **Semantic Similarity** (35%) — deep content alignment
  - **Skill Match** (25%) — technical & soft skills overlap
  - **Experience Match** (15%) — years and type of experience
  - **Education Match** (10%) — degree and field alignment
  - **Keyword Match** (15%) — ATS keyword coverage
- Matched vs. missing skills breakdown
- Actionable recommendations

### 🤖 AI Career Assistant (Powered by Ollama)
- **Chat mode** — ask anything about your career, resume, interviews
- **CV Generator** — complete, ATS-ready CV from just a job description
- **Gap Analysis** — skill gaps with resources, timelines, and alternatives
- **Interview Prep** — STAR-format questions + example answers from your resume
- **Cover Letter** — job-specific, personalised cover letters
- **Local LLM** — Mistral 7B via Ollama (4 GB, no GPU required)

### 🎨 UI / UX
- Premium light-mode design matching project theme (primary blue `#2563eb`)
- Animated slide-in AI drawer accessible from the home page
- Typing indicator, copy to clipboard, download CV
- Responsive on desktop and mobile

---

## Architecture 🏗️

```
                    ┌─────────────────────────────────────────┐
                    │         ApplyWise Frontend               │
                    │        Next.js 14 + TypeScript           │
                    │  Hero · Analyze · AI Assistant · About  │
                    └──────────────────┬──────────────────────┘
                                       │ HTTP / REST
                    ┌──────────────────▼──────────────────────┐
                    │         FastAPI Backend (Python)         │
                    │  main.py · ai_assistant_routes.py        │
                    │  similarity_engine · text_extractor      │
                    └──────┬────────────────────┬─────────────┘
                           │                    │
          ┌────────────────▼──────┐   ┌─────────▼──────────────┐
          │   NLP / Similarity    │   │  Ollama Local LLM       │
          │  spaCy · TF-IDF       │   │  Mistral 7B (port 11434)│
          │  SentenceTransformers │   │  Chat · CV Gen · Prep   │
          └───────────────────────┘   └────────────────────────┘
```

**Data Flow — Resume Analysis**
```
Resume File → Text Extraction → NLP Preprocessing → Feature Extraction
                                                           ↓
Job Description → Text Extraction → NLP Preprocessing → Feature Extraction
                                                           ↓
                                              Similarity Analysis Engine
                                                           ↓
                                          Scores · Matched Skills · Gaps · Advice
```

**Data Flow — AI Chat / CV Generation**
```
User Input → FastAPI → LLM Service → Ollama (localhost:11434) → Mistral 7B
                                                                      ↓
                              Streaming / Synchronous Response ←──────┘
```

---

## Prerequisites ✅

Install the following **before** running the project:

| Dependency | Version | Notes |
|---|---|---|
| **Python** | 3.8+ | Backend runtime |
| **Node.js** | 18+ | Frontend runtime |
| **npm** | 9+ | Package manager |
| **Ollama** | Latest | Local LLM server |
| **Tesseract OCR** | 4.0+ | For image resume extraction (optional) |

---

## Full Setup Guide 🚀

Follow these steps **exactly in order** the first time you set up the project.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/PALAKKUSHWAHA/ApplyWise.git
cd ApplyWise
```

---

### Step 2 — Install & Start Ollama (Local AI)

> Ollama powers the AI Assistant, CV Generator, and Interview Prep features.

**macOS**
```bash
# Download from https://ollama.ai OR install via Homebrew:
brew install ollama

# Pull the Mistral 7B model (~4 GB download)
ollama pull mistral

# Start the Ollama server (runs on port 11434)
ollama serve
```

**Linux**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral
ollama serve
```

**Windows**
```
1. Download the installer from https://ollama.ai
2. Run the installer
3. Open Terminal or PowerShell:
   ollama pull mistral
   ollama serve
```

> ✅ Verify Ollama is running:
> ```bash
> curl http://localhost:11434/api/tags
> # Should return {"models":[{"name":"mistral",...}]}
> ```

---

### Step 3 — Backend Setup (Python / FastAPI)

```bash
# Navigate to the backend directory
cd "ResuMatch-main/backend"

# Create a virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install all Python dependencies
pip install -r requirements.txt

# (Optional but recommended) Download the spaCy model for better NLP
python -m spacy download en_core_web_sm
```

**Install Tesseract OCR** (for image resume support — optional):
```bash
# macOS
brew install tesseract

# Ubuntu / Debian
sudo apt-get install tesseract-ocr

# Windows — download from:
# https://github.com/UB-Mannheim/tesseract/wiki
```

---

### Step 4 — Frontend Setup (Next.js)

```bash
# From the project root, navigate to frontend
cd "ResuMatch-main/frontend"

# Install Node.js dependencies
npm install
```

---

### Step 5 — Configure Environment Variables

The backend uses an `.env` file. A sample is already included:

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Key variables in `backend/.env`:

```bash
# Ollama settings (defaults work out of the box)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Server settings
HOST=0.0.0.0
PORT=8000
DEBUG=True

# NLP model
SENTENCE_MODEL=all-MiniLM-L6-v2

# File limits
MAX_FILE_SIZE=52428800   # 50 MB
```

Frontend environment (optional):
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running the Project ▶️

You need **three terminal windows** (or tabs) running simultaneously:

### Terminal 1 — Ollama (AI Engine)
```bash
ollama serve
# ✅ Listening on http://localhost:11434
```

### Terminal 2 — Backend API
```bash
cd "ResuMatch-main/backend"
source venv/bin/activate     # Windows: venv\Scripts\activate
python main.py
# ✅ Uvicorn running on http://0.0.0.0:8000
```

### Terminal 3 — Frontend
```bash
cd "ResuMatch-main/frontend"
npm run dev
# ✅ Next.js ready on http://localhost:3000
```

**Open your browser:** → [http://localhost:3000](http://localhost:3000)

---

### Quick-Start Script (Optional)

A `dev.sh` helper script is included at the project root:

```bash
chmod +x dev.sh

./dev.sh setup-all      # Install all dependencies (backend + frontend)
./dev.sh run-dev        # Start both backend + frontend
./dev.sh run-backend    # Start only FastAPI
./dev.sh run-frontend   # Start only Next.js
./dev.sh clean          # Clean build artifacts
./dev.sh help           # Show all commands
```

> ⚠️ The script does **not** start Ollama automatically — run `ollama serve` in a separate terminal.

---

## API Reference 📚

Base URL: `http://localhost:8000`

### Resume Analysis

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Analyze resume vs job description |
| `POST` | `/api/batch-analyze` | Analyze multiple resumes |
| `GET` | `/api/analysis/{id}` | Retrieve analysis by ID |
| `GET` | `/health` | Backend health check |

**POST `/api/analyze`** — Example request:
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "resume=@my_resume.pdf" \
  -F "job_description=We are looking for a Python developer..."
```

**Response:**
```json
{
  "analysis_id": "abc-123",
  "similarity_analysis": {
    "overall_score": 78.5,
    "component_scores": {
      "semantic_similarity": 0.82,
      "skill_match": 0.71,
      "experience_match": 0.80,
      "education_match": 0.90,
      "keyword_match": 0.74
    },
    "matched_skills": ["Python", "FastAPI", "REST API"],
    "missing_skills": ["Docker", "Kubernetes", "AWS"],
    "recommendations": ["Add cloud experience", "Mention container skills"]
  }
}
```

### AI Assistant Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ai-assistant/chat` | General AI career chat |
| `POST` | `/api/v1/ai-assistant/generate-cv` | Generate tailored CV from job description |
| `POST` | `/api/v1/ai-assistant/tailor-resume` | Resume tailoring suggestions |
| `POST` | `/api/v1/ai-assistant/analyze-gaps` | Skill gap analysis |
| `POST` | `/api/v1/ai-assistant/interview-prep` | Interview questions + preparation |
| `POST` | `/api/v1/ai-assistant/generate-cover-letter` | Generate personalised cover letter |
| `GET` | `/api/v1/ai-assistant/health` | Ollama connectivity check |

**POST `/api/v1/ai-assistant/generate-cv`** — Example:
```bash
curl -X POST http://localhost:8000/api/v1/ai-assistant/generate-cv \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "We are looking for a Senior React Developer...",
    "user_name": "Palak Kushwaha",
    "user_email": "palak@email.com",
    "base_resume": "3 years of experience in React, Node.js..."
  }'
```

**Interactive API Docs:** → [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## Project Structure 📁

```
ApplyWise/
├── README.md                        ← You are here
│
├── ResuMatch-main/
│   ├── backend/                     ← Python / FastAPI backend
│   │   ├── main.py                  ← App entry point, CORS, routes
│   │   ├── ai_assistant_routes.py   ← AI Assistant API endpoints
│   │   ├── llm_service.py           ← Ollama LLM abstraction layer
│   │   ├── similarity_engine.py     ← Core resume matching algorithm
│   │   ├── similarity_engine_lightweight.py  ← TF-IDF fallback
│   │   ├── text_extractor.py        ← PDF/DOC/OCR text extraction
│   │   ├── text_preprocessor.py     ← NLP pipeline (spaCy, regex)
│   │   ├── config.py                ← App configuration
│   │   ├── AI_CONFIG.py             ← LLM provider configuration
│   │   ├── requirements.txt         ← Python dependencies
│   │   ├── .env                     ← Environment variables (git-ignored)
│   │   ├── .env.example             ← Template for .env
│   │   └── venv/                    ← Python virtual environment
│   │
│   └── frontend/                    ← Next.js 14 / TypeScript frontend
│       ├── pages/
│       │   ├── index.tsx            ← Home page
│       │   ├── analyze.tsx          ← Resume analysis page
│       │   ├── ai-assistant.tsx     ← Dedicated AI assistant page
│       │   ├── about.tsx            ← About + Ollama info page
│       │   ├── help.tsx             ← FAQ / Help page
│       │   └── 404.tsx              ← Custom 404 page
│       ├── components/
│       │   ├── HomeAIAssistant.tsx  ← Slide-in AI drawer (home page)
│       │   ├── AIAssistantChat.tsx  ← Chat component (ai-assistant page)
│       │   ├── Hero.tsx             ← Hero section + CTA buttons
│       │   ├── Header.tsx           ← Navigation bar
│       │   ├── Footer.tsx           ← Site footer
│       │   ├── Features.tsx         ← Features grid
│       │   ├── AnalysisResults.tsx  ← Resume analysis results display
│       │   ├── FileUpload.tsx       ← File drag-and-drop component
│       │   └── Welcome.tsx          ← Animated welcome screen
│       ├── styles/
│       │   └── globals.css          ← Tailwind + custom classes
│       ├── tailwind.config.js       ← Primary blue (#2563eb) theme
│       ├── next.config.js           ← Next.js configuration
│       └── package.json             ← Node.js dependencies
│
└── dev.sh                           ← Development helper script
```

---

## Scoring System 📊

### Component Weights

| Component | Weight | What It Measures |
|---|---|---|
| Semantic Similarity | **35%** | Overall content alignment using embeddings |
| Skill Match | **25%** | Technical and soft skills overlap |
| Experience Match | **15%** | Years of experience, roles, industry |
| Education Match | **10%** | Degree, field, certifications |
| Keyword Match | **15%** | ATS-critical keyword presence |

### Score Interpretation

| Score | Rating | Meaning |
|---|---|---|
| 75 – 100% | 🟢 Excellent | Strong candidate, apply immediately |
| 60 – 74% | 🔵 Good | Good fit, minor gaps |
| 45 – 59% | 🟡 Fair | Moderate fit, address key gaps |
| 0 – 44% | 🔴 Poor | Significant misalignment |

---

## Troubleshooting 🔧

### Common Issues

**❌ "Cannot connect to Ollama"**
```bash
# Make sure Ollama is running
ollama serve

# Check it's listening
curl http://localhost:11434/api/tags

# If port is blocked, check firewall settings
```

**❌ "Port 8000 already in use"**
```bash
# Kill whatever is using the port
lsof -ti :8000 | xargs kill -9   # macOS / Linux
# Then restart the backend
python main.py
```

**❌ "Port 3000 already in use"**
```bash
lsof -ti :3000 | xargs kill -9
cd frontend && npm run dev
```

**❌ "spaCy model not found"**
```bash
source venv/bin/activate
python -m spacy download en_core_web_sm
```

**❌ "Module not found" or import errors**
```bash
# Make sure the virtual environment is active
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

**❌ "mistral model not found" in Ollama**
```bash
# Pull the model again (4 GB download)
ollama pull mistral

# Or use a smaller model
ollama pull phi3:mini
# Then update OLLAMA_MODEL=phi3:mini in backend/.env
```

**❌ Next.js 404 page**
```bash
# Clear the build cache and restart
rm -rf frontend/.next
cd frontend && npm run dev
```

**❌ File upload not working**
- Check `MAX_FILE_SIZE` in `backend/.env` (default is 50 MB)
- Ensure the `uploads/` directory exists: `mkdir -p backend/uploads`
- Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG

---

## Production Roadmap & Suggestions 🚀

The following improvements are recommended to take ApplyWise from a local development project to a **production-ready SaaS application**:

### 🔐 1. Authentication & User Accounts
- Add **user authentication** (NextAuth.js + JWT or OAuth via Google/GitHub)
- User profiles storing resume history, saved analyses, and generated CVs
- Role-based access control (free tier vs. premium)

> **Implementation:** NextAuth.js on the frontend, FastAPI dependency injection for protected routes, PostgreSQL/Supabase for user storage.

### 🗄️ 2. Database Integration
- Currently stateless — analysis results are lost on server restart
- Add **PostgreSQL** (or Supabase) to persist:
  - User accounts and profiles
  - Resume upload history
  - Analysis results and scores
  - Generated CVs
- Use **SQLAlchemy + Alembic** for ORM and migrations

### ☁️ 3. Cloud Storage for Uploads
- Replace local `uploads/` folder with **AWS S3** or **Cloudflare R2**
- Benefits: persistent storage, CDN delivery, scalable file sizes
- Use pre-signed URLs for direct browser-to-S3 upload (skip the backend for large files)

### 🌐 4. Cloud LLM Fallback / Hybrid Mode
- Ollama is great locally but hard to run on cloud servers (large RAM/GPU)
- Add **OpenAI / Anthropic Claude / Google Gemini** as configurable fallback providers
- `AI_CONFIG.py` already has a `provider` switch — just add API key handling
- Offer: local Ollama for free-tier, cloud LLM for premium users

### 📈 5. Analytics Dashboard
- Track usage metrics: analyses per day, top missing skills, score distributions
- Resume quality trends over time for users
- Use **Chart.js** or **Recharts** for visualisation on the frontend

### ⚡ 6. Background Job Queue
- Long CV generations (30–60s) should be async with a job queue
- Use **Celery + Redis** or **FastAPI BackgroundTasks** with WebSocket status updates
- Frontend polls or subscribes via SSE/WebSocket for real-time progress

### 🐳 7. Docker & Containerisation
- Add `Dockerfile` for backend and `docker-compose.yml` for the full stack
- Include Ollama as a service in `docker-compose.yml`
- Benefits: reproducible environments, easy deployment, CI/CD integration

```yaml
# Example docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - OLLAMA_URL=http://ollama:11434
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
  ollama:
    image: ollama/ollama
    ports: ["11434:11434"]
    volumes:
      - ollama_data:/root/.ollama
```

### 🔒 8. Security Hardening
- Rate limiting on all API endpoints (use `slowapi` for FastAPI)
- Input sanitisation and file type validation (not just extension — check MIME type)
- CORS tightened to specific origins in production
- Virus scanning for uploaded files (ClamAV)
- HTTPS enforcement + secure cookie settings

### 🧪 9. Testing Suite
- Unit tests for similarity engine and NLP pipeline
- Integration tests for all API endpoints
- Frontend tests with **Playwright** or **Cypress**
- CI/CD via **GitHub Actions** — run tests on every PR

```bash
# Add to requirements.txt
pytest
pytest-asyncio
httpx       # for FastAPI test client
pytest-cov  # coverage reports
```

### 📧 10. Email & Notification System
- Transactional emails for account verification, CV generation completion
- Use **Resend** or **SendGrid** with FastAPI background tasks
- Notify users when long analyses complete

### 🌍 11. Multi-Language Support
- i18n on the frontend with **next-intl**
- Backend NLP pipeline currently optimised for English — add multilingual spaCy models
- Support CVs and JDs in Spanish, French, German, Hindi

### 📱 12. Mobile App / PWA
- Convert the Next.js frontend to a **Progressive Web App (PWA)**
- Add `manifest.json`, service worker, offline support
- Eventually build React Native app sharing the same backend

### 🎯 13. Job Board Integration
- Scrape or integrate with LinkedIn, Indeed, Glassdoor job postings
- Auto-analyse your resume against live job listings
- Browser extension to analyse JDs as you browse

### 📊 14. Resume Score Improvement Loop
- After showing gaps, let the AI suggest **specific edits** to the user's resume text
- Show before/after score improvement
- "Apply Suggestions" button that rewrites resume sections inline

---

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing code style
4. Write or update tests
5. Open a pull request with a clear description

**Code Style:**
- Python: follow PEP 8, use type hints, add docstrings
- TypeScript: use strict mode, prefer functional components, document props
- Commits: use [Conventional Commits](https://www.conventionalcommits.org/)

---

## License 📝

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## Acknowledgments 🙏

| Library | Purpose |
|---|---|
| [Ollama](https://ollama.ai) | Local LLM inference engine |
| [Mistral AI](https://mistral.ai) | Mistral 7B open-source language model |
| [FastAPI](https://fastapi.tiangolo.com) | Python web framework |
| [Next.js](https://nextjs.org) | React framework |
| [spaCy](https://spacy.io) | NLP pipeline |
| [Sentence Transformers](https://sbert.net) | Semantic similarity embeddings |
| [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) | Image-to-text extraction |
| [Framer Motion](https://framer.com/motion) | UI animations |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |

---

<div align="center">

**ApplyWise** — Land your dream job with local AI. 🚀

Made with ❤️ by [Palak Kushwaha](https://github.com/PALAKKUSHWAHA)

[![GitHub](https://img.shields.io/badge/GitHub-PALAKKUSHWAHA-181717?style=for-the-badge&logo=github)](https://github.com/PALAKKUSHWAHA)
&nbsp;
[![Email](https://img.shields.io/badge/Email-palak8kush%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:palak8kush@gmail.com)

</div>
