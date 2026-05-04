# AI Assistant Setup Guide - FREE & LOCAL LLM

## Overview
The ResuMatch AI Assistant is fully powered by free, local LLMs. No API keys required! Zero costs!

## Quick Start (5 minutes)

### Step 1: Install Ollama (Recommended)
Ollama is the easiest way to run local LLMs. It handles everything automatically.

**Windows/Mac:**
1. Download from: https://ollama.ai
2. Install and run Ollama
3. Ollama will start automatically in the background

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

### Step 2: Pull a Model
Ollama comes with pre-configured models. Download one with a simple command:

```bash
# Download Mistral (7B) - RECOMMENDED for speed & quality
ollama pull mistral

# Or try other models:
ollama pull neural-chat        # Optimized for conversation
ollama pull llama2             # Powerful 13B model
ollama pull dolphin-mixtral    # Very capable 56B model (requires 32GB RAM)
```

Pulling takes 5-15 minutes depending on internet speed and model size.

### Step 3: Configure ResuMatch Backend

1. Create `.env` file in `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

2. Update `backend/.env`:
```env
LLM_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
LLM_MODEL=mistral
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.7
```

### Step 4: Run the Application

Terminal 1 - Start Ollama (if not running):
```bash
ollama serve
```

Terminal 2 - Start Backend:
```bash
cd backend
python main.py
```

Terminal 3 - Start Frontend:
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000/ai-assistant

---

## Features Available

### 1. Resume Tailoring
- Get AI suggestions to optimize your resume for specific jobs
- Auto-generate bullet points matching job requirements
- Reword experiences to match keywords

### 2. Gap Analysis
- Identify missing skills with learning recommendations
- Get resources, courses, and certifications
- Realistic timelines for skill development

### 3. Interview Preparation
- Generate likely interview questions
- Get answer suggestions based on your resume
- Technical hints and STAR method guidance

### 4. Cover Letter Generation
- AI-generated personalized cover letters
- Matched to job descriptions and company culture
- Professional yet personable tone

---

## Model Comparison

| Model | Size | Speed | Quality | RAM Required | Recomm. |
|-------|------|-------|---------|--------------|---------|
| Mistral | 7B | ⚡ Fast | ⭐⭐⭐⭐ | 8GB | ✅ YES |
| Neural-Chat | 7B | ⚡ Fast | ⭐⭐⭐⭐ | 8GB | ✅ |
| Llama2 | 7B | ⚡ Fast | ⭐⭐⭐ | 8GB | |
| Llama2 | 13B | 🚀 Moderate | ⭐⭐⭐⭐ | 16GB | ✅ |
| Dolphin-Mixtral | 56B | 🐢 Slow | ⭐⭐⭐⭐⭐ | 32GB | |

**Recommendation: Start with Mistral** - Perfect balance of speed and quality for most use cases.

---

## Troubleshooting

### "Cannot connect to Ollama"
```
Solution 1: Make sure Ollama is running
- Windows/Mac: Check if Ollama is in your system tray
- Linux: Run: ollama serve

Solution 2: Check OLLAMA_URL in .env
- Should be: http://localhost:11434
```

### "Model not found"
```
Solution: Download the model first
ollama pull mistral
```

### "Out of memory"
```
Solution 1: Use a smaller model
ollama pull neural-chat

Solution 2: Close other applications
Solution 3: Configure Ollama to use less memory
```

### "Very slow responses"
```
Solution 1: Model size may be too large for your hardware
- Switch to Mistral 7B (recommended)

Solution 2: GPU not enabled
- Ensure your GPU drivers are installed
- Ollama will auto-detect and use GPU if available
```

---

## Advanced Configuration

### Use Different Model
```env
# In backend/.env
LLM_MODEL=llama2              # Use Llama2 instead
```

### Adjust Response Quality
```env
# More creative responses (0.0 = deterministic, 1.0 = random)
LLM_TEMPERATURE=0.9

# Shorter responses
LLM_MAX_TOKENS=1000

# Longer, detailed responses
LLM_MAX_TOKENS=4000
```

### Switch to Hugging Face
```env
LLM_PROVIDER=huggingface
LLM_MODEL=mistralai/Mistral-7B-Instruct-v0.1

# Then install: pip install transformers torch
```

### Use Paid APIs (Optional)
If you want to use OpenAI or Anthropic later:

**OpenAI:**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-3.5-turbo
```

**Anthropic:**
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-3-sonnet-20240229
```

---

## Privacy & Security
- ✅ All data stays on your machine
- ✅ No data sent to external servers
- ✅ Completely private and secure
- ✅ No tracking or monitoring
- ✅ Full control over your data

---

## Performance Tips

### 1. GPU Acceleration
- Ollama automatically detects and uses GPU
- Nvidia: Install CUDA drivers
- AMD: Install ROCm support
- Mac: Works out of the box with Metal acceleration

### 2. First Response Slow?
- Model loads into memory on first use
- Subsequent responses are much faster
- Normal behavior!

### 3. Optimize for Speed
```env
LLM_TEMPERATURE=0.5  # Lower = faster, more focused
LLM_MAX_TOKENS=1500  # Shorter responses = faster
LLM_MODEL=mistral    # 7B models are fastest
```

---

## Next Steps

1. ✅ Install Ollama
2. ✅ Download a model: `ollama pull mistral`
3. ✅ Create `.env` file with configuration
4. ✅ Start backend and frontend
5. ✅ Visit http://localhost:3000/ai-assistant

---

## Support & Resources

- **Ollama Docs:** https://ollama.ai/
- **Available Models:** https://ollama.ai/library
- **Community:** https://github.com/ollama/ollama/discussions
- **Issues:** Let me know if you encounter any problems!

---

## Cost Analysis

| Approach | Setup Cost | Monthly Cost | Privacy |
|----------|-----------|--------------|---------|
| **Ollama (Local)** | Free | $0 | ✅ Complete |
| **OpenAI API** | Free | $5-50+ | ❌ Data shared |
| **Anthropic API** | Free | $10-100+ | ❌ Data shared |

**Ollama is clearly the winner** - zero ongoing costs, full privacy, and no API key needed!

Enjoy your free, powerful AI assistant! 🚀
