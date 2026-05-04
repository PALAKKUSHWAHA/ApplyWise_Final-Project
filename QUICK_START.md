# 🚀 ResuMatch - AI-Powered Resume & Job Matching

> **NEW: Free, Local AI Assistant Powered by LLMs! No API keys required. Zero costs!**

## 🌟 What's New - AI Assistant Features

Your resume matching app now includes a **free, local AI assistant** powered by open-source LLMs:

### Features
✅ **Resume Tailoring** - Optimize your resume for specific job descriptions
✅ **Gap Analysis** - Identify missing skills with learning paths  
✅ **Interview Preparation** - Generate likely questions and answer guidance
✅ **Cover Letter Generator** - AI-generated personalized cover letters

All powered by **free local LLMs** - no API keys needed!

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 16+
- [Ollama](https://ollama.ai) (free, local AI - takes 2 min to install)

### 1. Install Ollama & Download Model
```bash
# Windows/Mac: Download from https://ollama.ai
# Linux: curl https://ollama.ai/install.sh | sh

# Download Mistral (best for chat, fast & smart)
ollama pull mistral
```

### 2. Start the Servers
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Backend
cd backend
python main.py

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 3. Visit the App
- Frontend: http://localhost:3000
- **AI Assistant**: http://localhost:3000/ai-assistant
- API Docs: http://localhost:8000/docs

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [AI Assistant Setup](#ai-assistant-setup)
- [Contributing](#contributing)

## ✨ Features

### Core Matching
- **Resume Upload & Analysis** - PDF, DOCX, TXT, images
- **Job Description Matching** - Compare resumes against jobs
- **Advanced Similarity Scoring** - Semantic matching with NLP
- **Detailed Analysis** - Comprehensive skill-gap reports

### AI Assistant (NEW!)
- **Resume Tailoring** - Optimize for specific jobs
- **Skill Gap Analysis** - Learning recommendations
- **Interview Prep** - Question generation & guidance
- **Cover Letter** - AI-generated personalized letters

### User Experience
- **Modern UI** - Responsive Next.js interface
- **Real-time Results** - Instant feedback
- **Dark Mode Support** - Built-in themes

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **FastAPI** - Web framework
- **Ollama/Local LLMs** - AI Assistant (free)
- **spaCy/NLTK** - NLP processing
- **scikit-learn** - Similarity algorithms

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

---

## 📁 Project Structure

```
ResuMatch/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── llm_service.py             # AI Assistant (NEW)
│   ├── ai_assistant_routes.py     # AI API endpoints (NEW)
│   ├── similarity_engine.py       # Matching algorithm
│   ├── text_extractor.py          # Document processing
│   ├── SETUP_AI_ASSISTANT.md      # AI Setup Guide (NEW)
│   └── requirements.txt
├── frontend/
│   ├── pages/
│   │   ├── ai-assistant.tsx       # AI Chat Interface (NEW)
│   │   └── analyze.tsx            # Main analysis page
│   ├── components/
│   │   ├── AIAssistantChat.tsx    # Chat Component (NEW)
│   │   └── AnalysisResults.tsx
│   └── package.json
└── README.md
```

---

## 🔧 Installation

### Prerequisites
```bash
# Check Python
python --version  # Should be 3.8+

# Check Node.js
node --version    # Should be 16+

# Install Ollama from https://ollama.ai
```

### Clone & Setup
```bash
# Clone repository
git clone https://github.com/your-username/ResuMatch.git
cd ResuMatch

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Frontend
cd ../frontend
npm install
```

### Configure AI Assistant
```bash
# Create .env file
cd backend
cp .env.example .env

# Edit .env (already configured for Ollama)
# No changes needed if using Ollama on localhost!
```

---

## 🚀 Running the Application

### Option 1: Using Scripts (Easiest)
```bash
# Windows
backend/setup-ai.bat

# Linux/Mac
bash backend/setup-ai.sh
```

### Option 2: Manual
```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend
cd backend
python main.py

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Option 3: Development Mode (with reload)
```bash
cd backend
python -m uvicorn main:app --reload
```

---

## 💻 Usage

### 1. Resume Matching
- Visit http://localhost:3000
- Upload resume & job description
- Get instant compatibility score
- View detailed analysis

### 2. AI Assistant
- Visit http://localhost:3000/ai-assistant
- Choose feature: Tailoring, Gap Analysis, or Interview Prep
- Paste resume & job description
- Chat with AI for personalized guidance

### 3. API Usage
```bash
# See all endpoints
curl http://localhost:8000/docs

# Example: Tailor resume
curl -X POST http://localhost:8000/api/v1/ai-assistant/tailor-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "...",
    "job_description": "...",
    "professional_summary": "..."
  }'
```

---

## 🤖 AI Assistant Setup

### ✅ Using Ollama (Recommended - FREE)
```bash
# 1. Download Ollama from https://ollama.ai
# 2. Run: ollama pull mistral
# 3. Run: ollama serve
# 4. Start backend & frontend (they auto-connect)
```

**No configuration needed!** Ollama runs locally by default.

### 📚 Available Models
```bash
ollama pull mistral          # Fast & smart (recommended) ⭐
ollama pull neural-chat      # Chat-optimized
ollama pull llama2           # Powerful & capable
ollama pull dolphin-mixtral  # Very capable (needs 32GB RAM)
```

### 🔄 Switch Models
```bash
# Edit backend/.env
LLM_MODEL=llama2

# Or set environment variable
export LLM_MODEL=neural-chat
python main.py
```

### 📖 Detailed Setup
See [SETUP_AI_ASSISTANT.md](backend/SETUP_AI_ASSISTANT.md) for:
- Troubleshooting
- GPU acceleration
- Alternative providers (OpenAI, Anthropic)
- Performance tips

---

## 🎯 AI Features in Detail

### Resume Tailoring
Get AI suggestions to optimize your resume:
- Identify key keywords from job description
- Reword your achievements to match requirements
- Suggest which experiences to highlight
- Generate compelling bullet points

### Gap Analysis
Understand what you need to learn:
- Missing skills analysis
- Learning resources & certifications
- Realistic timelines
- Alternative role suggestions

### Interview Preparation
Prepare with confidence:
- Generated interview questions
- Answer suggestions based on your resume
- STAR method framework
- Technical hints for tech roles

### Cover Letter Generation
AI-generated cover letters that:
- Match job requirements
- Highlight relevant achievements
- Feel personal & authentic
- Ready to customize further

---

## 🌐 Deployment

### Frontend (Vercel - Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy on Vercel
vercel --prod
```

### Backend (Render/Railway/Heroku)
```bash
# Push to GitHub
git push origin main

# Deploy on Render
# (Connect GitHub repo in Render dashboard)
```

**Note:** For local LLMs, Ollama must be running on your server too.

---

## 📊 Performance

| Task | Time | GPU Needed |
|------|------|-----------|
| Resume Analysis | <2s | No |
| AI Chat Response | 3-10s | No (faster with GPU) |
| Gap Analysis | 5-15s | No |
| Interview Prep | 10-30s | No |

**GPU:** Ollama auto-detects GPU. Faster responses with NVIDIA/AMD GPU.

---

## 🔒 Privacy & Security

✅ **Full Privacy with Local LLMs**
- All data stays on your machine
- No data sent to external services
- No tracking or monitoring
- Complete control over your data

✅ **When using Ollama:**
- Everything runs locally
- Your resume is never shared
- Your job searches stay private

⚠️ **When using API providers (OpenAI/Anthropic):**
- Data sent to external servers
- Review their privacy policies
- Better for some enterprise use cases

---

## 🐛 Troubleshooting

### "Cannot connect to Ollama"
```bash
# Make sure Ollama is running
ollama serve

# Check connection
curl http://localhost:11434/api/tags
```

### "Model not found"
```bash
# Download the model first
ollama pull mistral
```

### "Out of memory"
```bash
# Use smaller model
ollama pull neural-chat

# Or reduce response length
# Edit backend/.env: LLM_MAX_TOKENS=1000
```

### "Slow responses"
```bash
# Enable GPU in Ollama (auto-detected)
# Or use faster model: ollama pull neural-chat
```

---

## 🤝 Contributing

Contributions welcome! Areas to improve:
- [ ] Multi-language support
- [ ] More LLM providers
- [ ] Advanced matching algorithms
- [ ] Browser extensions
- [ ] Mobile app

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📝 License

MIT License - Feel free to use in personal or commercial projects

---

## 📧 Support

- **Issues:** GitHub Issues
- **Questions:** Start a Discussion
- **Suggestions:** GitHub Discussions

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - Local LLM runtime
- [FastAPI](https://fastapi.tiangolo.com) - Backend framework
- [Next.js](https://nextjs.org) - Frontend framework
- [spaCy](https://spacy.io) - NLP library
- [Mistral AI](https://www.mistral.ai) - LLM models

---

## 🚀 What's Coming

- [ ] Browser extension for job boards
- [ ] Email integration
- [ ] Salary negotiation assistant
- [ ] Job application tracker
- [ ] Team collaboration features
- [ ] Custom training with your data

---

**Ready to revolutionize your job search?**

Start with: `ollama pull mistral && ollama serve`

Then visit: http://localhost:3000

Happy job hunting! 🎉
