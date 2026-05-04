"""
Quick configuration for AI Assistant
Edit these settings to customize the LLM behavior
"""

# ============================================================
# 1. LLM PROVIDER CONFIGURATION
# ============================================================

# Choose one: "ollama", "huggingface", "openai", "anthropic"
LLM_PROVIDER = "ollama"

# Model settings for each provider
MODELS = {
    "ollama": {
        "model": "mistral",  # Fast & good quality
        "url": "http://localhost:11434",
        # Other options: "neural-chat", "llama2", "dolphin-mixtral"
    },
    "huggingface": {
        "model": "mistralai/Mistral-7B-Instruct-v0.1",
        # Other options: "meta-llama/Llama-2-7b-chat-hf"
    },
    "openai": {
        "model": "gpt-3.5-turbo",
        "api_key": None,  # Add your API key here
    },
    "anthropic": {
        "model": "claude-3-sonnet-20240229",
        "api_key": None,  # Add your API key here
    }
}

# ============================================================
# 2. RESPONSE QUALITY SETTINGS
# ============================================================

# Temperature: 0.0 = deterministic, 1.0 = creative
# Lower = focused, consistent responses
# Higher = diverse, creative responses
TEMPERATURE = 0.7

# Maximum tokens in response
# Lower = shorter responses, faster
# Higher = longer, detailed responses
MAX_TOKENS = 2000

# ============================================================
# 3. FEATURE-SPECIFIC PROMPTS
# ============================================================

# You can customize the behavior for each feature
SYSTEM_PROMPTS = {
    "resume_tailoring": {
        "tone": "professional",
        "focus": "optimization",
        "detail_level": "comprehensive"
    },
    "gap_analysis": {
        "tone": "encouraging",
        "focus": "actionable_paths",
        "detail_level": "detailed"
    },
    "interview_prep": {
        "tone": "coaching",
        "focus": "confidence_building",
        "detail_level": "comprehensive"
    },
    "cover_letter": {
        "tone": "personable",
        "focus": "compelling_narrative",
        "detail_level": "balanced"
    }
}

# ============================================================
# 4. QUICK COMMANDS
# ============================================================
"""
# Download Mistral model (recommended):
ollama pull mistral

# Download other models:
ollama pull neural-chat
ollama pull llama2
ollama pull dolphin-mixtral

# Start Ollama server:
ollama serve

# Check if Ollama is running:
curl http://localhost:11434/api/tags

# Use different model temporarily:
export LLM_MODEL=llama2
python main.py
"""

# ============================================================
# 5. PERFORMANCE TIPS
# ============================================================
"""
If responses are slow:
1. Check Ollama is running: ollama serve
2. Check if GPU is available (check Ollama startup logs)
3. Use smaller model: ollama pull neural-chat (faster)
4. Reduce MAX_TOKENS (shorter responses = faster)
5. Reduce TEMPERATURE (more focused = faster)

If out of memory:
1. Close other applications
2. Use smaller model (7B instead of 13B)
3. Restart Ollama
"""
