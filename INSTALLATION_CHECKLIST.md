# 🎯 INSTALLATION CHECKLIST - AI Assistant

Follow these steps in order. Should take about 15 minutes total.

---

## ✅ Step 1: Download Ollama (2 minutes)
- [ ] Go to https://ollama.ai
- [ ] Click "Download"
- [ ] Choose your OS (Windows, Mac, or Linux)
- [ ] Install like any other application
- [ ] Restart your computer (or just restart terminal on Linux)

**Verify:** Open terminal and type: `ollama --version`
Expected output: `ollama version X.X.X`

---

## ✅ Step 2: Download AI Model (10 minutes)
Run this command in your terminal:
```bash
ollama pull mistral
```

This downloads the Mistral 7B model (~4GB). Be patient!

**Verify:** Run `ollama list` and you should see:
```
mistral:latest  4.4 GB
```

---

## ✅ Step 3: Start Ollama Service (1 click!)
**Windows/Mac:**
- Ollama app should be running in your system tray/menu bar
- It starts automatically

**Linux:**
```bash
ollama serve
```

**Verify:** Open your browser and go to: http://localhost:11434/api/tags
You should see JSON output listing "mistral"

---

## ✅ Step 4: Configure Backend (2 minutes)
Navigate to your backend folder:
```bash
cd ResuMatch-main/backend
```

Create `.env` file from example:
```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

**Edit `.env` file and set:**
```env
LLM_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
LLM_MODEL=mistral
```

✅ **Done!** No API keys needed!

---

## ✅ Step 5: Start Backend (1 minute)
In your backend directory:
```bash
python main.py
```

You should see:
```
INFO:     Started reloader process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## ✅ Step 6: Start Frontend (1 minute)
Open NEW terminal in frontend directory:
```bash
cd ResuMatch-main/frontend
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in X.X s
```

---

## ✅ Step 7: Test It! (1 minute)
Open your browser:
1. Go to: http://localhost:3000/ai-assistant
2. You should see the beautiful AI Assistant interface
3. Paste some resume text
4. Paste a job description
5. Type a message and click Send
6. Watch the AI respond! 🎉

---

## ✅ What You Now Have

✨ **Fully functional AI-powered resume assistant with:**
- ✅ Resume Tailoring
- ✅ Gap Analysis
- ✅ Interview Preparation
- ✅ Cover Letter Generation
- ✅ Zero costs
- ✅ Complete privacy
- ✅ Fast responses

---

## 🆘 If Something Goes Wrong

### Error: "Cannot connect to Ollama"
**Fix:** Make sure Ollama is running
```bash
# Windows/Mac: Check system tray
# Linux: Open new terminal and run: ollama serve
```

### Error: "Model not found"
**Fix:** Download the model
```bash
ollama pull mistral
```

### Error: Backend won't start
**Fix:** Check Python venv is activated
```bash
# Windows:
backend\.venv\Scripts\activate

# Mac/Linux:
source backend/.venv/bin/activate

# Then: python main.py
```

### Error: Frontend won't start
**Fix:** Install dependencies
```bash
cd frontend
npm install
npm run dev
```

---

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Ollama won't open | Restart computer, try again |
| Model won't download | Check internet, try again |
| Backend crashes | Kill terminal, restart `python main.py` |
| Frontend says "Cannot connect to API" | Make sure backend is running on 8000 |
| Slow responses | This is normal first time! Models take time |
| Out of memory | Close other apps or use smaller model |

---

## 🎓 Alternative Models (Optional)

If Mistral doesn't work or you want to try others:

```bash
# Chat-optimized (maybe faster)
ollama pull neural-chat

# Larger, more capable (slower, needs 16GB RAM)
ollama pull llama2

# Then in backend/.env:
LLM_MODEL=neural-chat
# or
LLM_MODEL=llama2
```

---

## 🚀 You're Ready!

**Now you have:**
✅ Local AI (no internet needed after setup)
✅ Private (data never leaves your computer)
✅ Free (no subscriptions ever)
✅ Fast (responses in seconds)
✅ Professional (production-quality features)

---

## 📊 What's Running

- **Ollama** (port 11434): Local LLM server
- **Backend** (port 8000): FastAPI with AI routes
- **Frontend** (port 3000): Next.js web app

All on your computer. Nothing in the cloud. Complete privacy! 🔒

---

## 💡 Tips for Better Results

1. **Give context:** Paste full resume and job description
2. **Ask follow-up questions:** "Can you elaborate on..."
3. **Be specific:** "Help me for a Senior Engineer role at..."
4. **Copy suggestions:** Click Copy button under responses
5. **Try multiple models:** Each model has slight differences

---

## 📚 For More Details

- Advanced setup: See `SETUP_AI_ASSISTANT.md`
- Project overview: See `QUICK_START.md`
- Implementation details: See `AI_IMPLEMENTATION_GUIDE.md`

---

## ✨ That's It!

You now have a professional-grade AI assistant for career development!

Questions? Check the docs or troubleshooting section above.

Happy job hunting! 🎉
