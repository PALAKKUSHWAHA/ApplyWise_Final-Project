# 🚀 ResuMatch - AI-Powered Resume & Job Matching Platform

> **Your AI Career Assistant - 100% FREE & PRIVATE - Powered by Local LLMs**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104.1-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/nextjs-14.0.4-000000.svg)](https://nextjs.org/)

---

## 🌟 What's New - AI Assistant (No API Key Required!)

We've integrated a **powerful, free AI assistant** powered by local LLMs (Ollama):

### ✨ New Features
- 🎯 **Resume Tailoring** - Optimize your resume for specific jobs
- 🧠 **Gap Analysis** - Identify missing skills with learning paths
- 🎤 **Interview Prep** - Generate questions & answer guidance
- 📝 **Cover Letters** - AI-generated personalized letters

### 💎 Key Benefits
- **100% FREE** - No API costs ever
- **100% PRIVATE** - Everything runs locally
- **FAST** - Instant responses (3-10 seconds)
- **EASY** - Just download Ollama, no setup needed

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 16+
- [Ollama](https://ollama.ai) - Download & install (2 minutes)

### Installation
```bash
# 1. Download Mistral model (first time only, 10 minutes)
ollama pull mistral

# 2. Start Ollama
ollama serve

# 3. Backend (new terminal)
cd backend
python main.py

# 4. Frontend (another terminal)
cd frontend
npm run dev
```

### Access
- 🌐 Main app: http://localhost:3000
- 🤖 AI Assistant: **http://localhost:3000/ai-assistant**
- 📚 API docs: http://localhost:8000/docs

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) | **START HERE** - Simple step-by-step guide |
| [QUICK_START.md](QUICK_START.md) | Project overview & features |
| [SETUP_AI_ASSISTANT.md](backend/SETUP_AI_ASSISTANT.md) | Detailed AI setup & troubleshooting |
| [AI_IMPLEMENTATION_GUIDE.md](AI_IMPLEMENTATION_GUIDE.md) | Technical architecture & options |
| [AI_CONFIG.py](backend/AI_CONFIG.py) | Configuration reference |

---

## 🎯 Features

### Resume Matching (Core)
- ✅ Multi-format support (PDF, DOCX, TXT, images)
- ✅ Real-time similarity scoring
- ✅ Detailed skill analysis
- ✅ Component-based scoring

### AI Assistant (NEW!)
- ✅ Resume optimization suggestions
- ✅ Skill gap identification
- ✅ Learning path recommendations
- ✅ Interview question generation
- ✅ Cover letter generation
- ✅ Conversational AI chatbot

### User Experience
- ✅ Beautiful modern UI
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Real-time processing
- ✅ Copy-to-clipboard
- ✅ Error handling

---

## 🛠️ Tech Stack

### Backend
```
FastAPI          - Modern web framework
Python 3.8+      - Core language
Ollama           - Local LLM runtime
spaCy/NLTK       - NLP processing
scikit-learn     - Similarity algorithms
SQLAlchemy       - Database ORM
```

### Frontend
```
Next.js 14       - React framework
TypeScript       - Type safety
Tailwind CSS     - Styling
Framer Motion    - Animations
Axios            - HTTP client
```

### Infrastructure
```
Uvicorn          - ASGI server
Gunicorn         - Production server
Docker           - Containerization (optional)
```

---

## 📁 Project Structure

```
ResuMatch/
├── 📚 Documentation
│   ├── INSTALLATION_CHECKLIST.md      ← START HERE
│   ├── QUICK_START.md
│   ├── SETUP_AI_ASSISTANT.md
│   └── AI_IMPLEMENTATION_GUIDE.md
│
├── backend/
│   ├── 🤖 AI Assistant (NEW!)
│   │   ├── llm_service.py             ← LLM engine
│   │   ├── ai_assistant_routes.py     ← API endpoints
│   │   ├── AI_CONFIG.py               ← Configuration
│   │   └── SETUP_AI_ASSISTANT.md
│   │
│   ├── 📊 Core Features
│   │   ├── main.py                    ← FastAPI app
│   │   ├── similarity_engine.py       ← Matching algorithm
│   │   ├── text_extractor.py          ← Document processing
│   │   └── text_preprocessor.py       ← NLP pipeline
│   │
│   ├── ⚙️ Configuration
│   │   ├── config.py
│   │   ├── .env.example
│   │   └── requirements.txt
│   │
│   └── 📦 Utilities
│       ├── examples/
│       ├── uploads/
│       └── results/
│
├── frontend/
│   ├── 🤖 AI Features (NEW!)
│   │   ├── pages/ai-assistant.tsx     ← AI page
│   │   ├── components/AIAssistantChat.tsx
│   │   └── services/aiAssistantService.ts
│   │
│   ├── 📊 Core Pages
│   │   ├── pages/index.tsx            ← Home
│   │   ├── pages/analyze.tsx          ← Analysis
│   │   └── pages/about.tsx
│   │
│   ├── 🎨 Components
│   │   ├── components/Header.tsx
│   │   ├── components/Footer.tsx
│   │   ├── components/FileUpload.tsx
│   │   └── components/AnalysisResults.tsx
│   │
│   └── ⚙️ Configuration
│       ├── package.json
│       ├── next.config.js
│       └── tailwind.config.js
│
└── 📄 Config Files
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## 🚀 Getting Started

### 1️⃣ First Time Setup
```bash
# Follow the INSTALLATION_CHECKLIST
cat INSTALLATION_CHECKLIST.md

# Or do these steps:
1. Download Ollama from https://ollama.ai
2. Run: ollama pull mistral
3. Run: ollama serve
```

### 2️⃣ Start the Application
```bash
# Terminal 1: Ollama (if not in system tray)
ollama serve

# Terminal 2: Backend
cd backend && python main.py

# Terminal 3: Frontend
cd frontend && npm run dev
```

### 3️⃣ Use It
- Visit: http://localhost:3000/ai-assistant
- Upload resume & job description
- Chat with AI for personalized guidance

---

## 💡 AI Assistant Usage

### Resume Tailoring
```
1. Paste your resume
2. Paste job description
3. Ask: "How can I optimize my resume for this role?"
4. Get suggestions on keywords, format, and content
```

### Gap Analysis
```
1. Paste your resume
2. Paste job description
3. Ask: "What skills do I need to learn?"
4. Get learning path with resources and timelines
```

### Interview Preparation
```
1. Paste your resume
2. Paste job description
3. Ask: "Help me prepare for this interview"
4. Get sample questions and answer guidance
```

### Cover Letter
```
Use the API endpoint:
POST /api/v1/ai-assistant/generate-cover-letter
```

---

## 🔧 Configuration

### Switch LLM Models
```bash
# In backend/.env, change:
LLM_MODEL=mistral              # Current (fast & smart)
# OR
LLM_MODEL=neural-chat          # Chat-optimized
# OR
LLM_MODEL=llama2               # More powerful
```

### Use Different LLM Provider
```env
# Local (Recommended):
LLM_PROVIDER=ollama

# Or cloud providers:
LLM_PROVIDER=openai            # Requires API key
LLM_PROVIDER=anthropic         # Requires API key
```

### Adjust Response Quality
```env
LLM_TEMPERATURE=0.7            # 0.0=deterministic, 1.0=creative
LLM_MAX_TOKENS=2000            # Max response length
```

---

## 📊 Models Available

```bash
# Fast & Recommended
ollama pull mistral             # 7B, balanced

# Conversation-optimized
ollama pull neural-chat         # 7B, best for chat

# More powerful
ollama pull llama2              # 7B or 13B

# Very capable (needs 32GB RAM)
ollama pull dolphin-mixtral     # 56B, very smart
```

---

## 🔒 Privacy & Security

✅ **With Ollama (Local):**
- Complete privacy
- No data sharing
- No internet required
- Full control
- Zero tracking

❌ **With API Providers:**
- Data sent to external servers
- Review their privacy policies
- Potential compliance issues

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to Ollama | Make sure `ollama serve` is running |
| Model not downloading | Check internet, run `ollama pull mistral` |
| Backend won't start | Kill old processes, activate venv, try again |
| Slow responses | Normal! Models need time. Check if GPU is used. |
| Out of memory | Close apps or use smaller model |
| Frontend error | Make sure backend is running on port 8000 |

**More help:** See [SETUP_AI_ASSISTANT.md](backend/SETUP_AI_ASSISTANT.md)

---

## 📈 Performance

| Task | Time | GPU |
|------|------|-----|
| Chat response | 3-10s | Yes ↔️ 2-3x faster |
| Resume analysis | 5-15s | Yes ↔️ faster |
| Interview prep | 10-30s | Yes ↔️ faster |
| First response | 20-30s | Loading model |

*Times vary based on hardware. GPU acceleration is automatic.*

---

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy on Vercel (auto-deploys)
```

### Backend (Render/Railway/Heroku)
```bash
# Push to GitHub
git push origin main

# Deploy on your hosting platform
# Remember to also run Ollama on the server!
```

---

## 🔌 API Endpoints

### Chat
```bash
POST /api/v1/ai-assistant/chat
Body: {
  "messages": [...],
  "feature_type": "general",
  "resume_text": "...",
  "job_description": "..."
}
```

### Resume Tailoring
```bash
POST /api/v1/ai-assistant/tailor-resume
Body: {
  "resume_text": "...",
  "job_description": "...",
  "professional_summary": "..."
}
```

### Gap Analysis
```bash
POST /api/v1/ai-assistant/analyze-gaps
Body: {
  "resume_text": "...",
  "job_description": "...",
  "current_skills": [...]
}
```

### Interview Prep
```bash
POST /api/v1/ai-assistant/interview-prep
Body: {
  "resume_text": "...",
  "job_description": "...",
  "role_type": "general",
  "is_technical": false
}
```

### Cover Letter
```bash
POST /api/v1/ai-assistant/generate-cover-letter
Body: {
  "resume_text": "...",
  "job_description": "...",
  "company_name": "..."
}
```

**Full API docs:** http://localhost:8000/docs

---

## 🤝 Contributing

Contributions welcome! Areas to improve:
- [ ] More LLM providers
- [ ] Advanced matching algorithms
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Browser extension
- [ ] Integration with job boards

---

## 📝 License

MIT License - Free for personal and commercial use

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - Local LLM runtime
- [Mistral AI](https://www.mistral.ai) - Language models
- [FastAPI](https://fastapi.tiangolo.com) - Backend framework
- [Next.js](https://nextjs.org) - Frontend framework
- [spaCy](https://spacy.io) - NLP library
- Community contributors

---

## 🎯 Roadmap

- ✅ Local LLM integration (Ollama)
- ✅ Resume tailoring
- ✅ Gap analysis
- ✅ Interview prep
- 🔜 Batch processing
- 🔜 Email integration
- 🔜 Browser extension
- 🔜 Mobile app
- 🔜 Team collaboration

---

## 💬 Support

- 📚 **Docs:** Check the documentation files
- 🐛 **Issues:** Report on GitHub
- 💡 **Suggestions:** Open GitHub Discussions
- ❓ **Questions:** Check troubleshooting section

---

## 🎉 Ready to Get Started?

```bash
# 1. Install Ollama from https://ollama.ai
# 2. Download model
ollama pull mistral

# 3. Start Ollama
ollama serve

# 4. See INSTALLATION_CHECKLIST.md for rest of setup
```

**Visit:** http://localhost:3000/ai-assistant

**Enjoy your free, powerful AI career assistant!** 🚀

---

## 📊 Key Stats

- **Lines of Code:** 2000+ (AI features)
- **API Endpoints:** 6 (all free)
- **LLM Providers:** 4 (Ollama, HF, OpenAI, Anthropic)
- **Frontend Components:** 10+
- **Documentation:** 4 comprehensive guides
- **Cost:** $0 (with Ollama)
- **Privacy:** 100% (with Ollama)

---

Made with ❤️ for job seekers everywhere

*Last updated: February 2026*
