# ApplyWise Deployment Guide 🚀

This guide outlines the steps to deploy the **ApplyWise** project to production.

- **Frontend:** Next.js (TypeScript) → Deployed to **Vercel**
- **Backend:** FastAPI (Python) → Deployed to **Render** (or any Python host)

---

## 1. Deploy the Backend to Render 🐍

FastAPI is a Python application. We recommend **Render** due to its built-in Python support and free tier.

### Option A: Manual Setup (Recommended)
1. Go to [Render](https://render.com/) and sign in.
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository: `ApplyWise_Final-Project`.
4. In the creation form, configure:
   - **Name:** `applywise-backend`
   - **Root Directory:** `backend`
   - **Language:** `Python 3`
   - **Branch:** `main`
   - **Build Command:** `pip install -r requirements.txt && python -m spacy download en_core_web_sm && python fix_huggingface.py`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced** and add the following **Environment Variables**:
   - `CORS_ORIGINS` = `https://your-frontend-domain.vercel.app` (You can update this after deploying to Vercel)
   - `LLM_PROVIDER` = `openai` (Recommended for production, see below)
   - `OPENAI_API_KEY` = `your-openai-api-key`
   - `LLM_MODEL` = `gpt-4o-mini` (Fast and cost-effective)
6. Click **Create Web Service**.

### Option B: Using the Blueprint (`render.yaml`)
Alternatively, you can click **New** -> **Blueprint** on Render and select your repository. Render will automatically parse the `backend/render.yaml` file to provision the service.

> [!IMPORTANT]
> **LLM Provider in Production:**
> Running local **Ollama** on a free or low-tier cloud instance (like Render's free tier) is not recommended because Mistral 7B requires high RAM/GPU resources and will run extremely slowly or crash.
> For production, change `LLM_PROVIDER` to `openai` (or `anthropic`) and configure the API key. This will ensure sub-second response times and 100% availability.

---

## 2. Deploy the Frontend to Vercel ⚡

Vercel is the creator of Next.js and offers the best hosting platform for it.

1. Go to [Vercel](https://vercel.com/) and sign in.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository: `ApplyWise_Final-Project`.
4. Configure the Project Settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select **`frontend`** (Crucial: the frontend is in a subdirectory!).
5. Expand the **Environment Variables** section and add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your Render backend web service URL (e.g., `https://applywise-backend.onrender.com`)
6. Click **Deploy**.

Once deployment finishes, Vercel will give you a production URL (e.g., `https://applywise-final-project.vercel.app`).

---

## 3. Link them together (CORS Configuration) 🔗

After your frontend is live on Vercel, copy your Vercel URL and update the backend's environment variables:

1. Go to your backend service dashboard on **Render**.
2. Navigate to **Environment**.
3. Update `CORS_ORIGINS` to include your Vercel URL:
   ```env
   CORS_ORIGINS=https://your-app-name.vercel.app,http://localhost:3000
   ```
4. Save the changes. Render will automatically rebuild and redeploy the backend with the new configuration.

---

## Local Development vs. Production Settings ⚙️

| Setting | Local Development (Default) | Production |
|---|---|---|
| **Frontend API URL** | `http://localhost:8000` | `https://your-backend-service.onrender.com` |
| **LLM Provider** | `ollama` (Mistral 7B) | `openai` (gpt-4o-mini) / `anthropic` |
| **Backend Port** | `8000` | Dynamic (provided by Render via `$PORT`) |
| **Database** | Stateless (Memory/Cache) | Persistent PostgreSQL (Optional) |
