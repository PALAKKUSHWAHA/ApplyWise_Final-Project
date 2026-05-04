"""
LLM Service for GenAI-powered features including:
- Resume Tailoring Assistant
- Gap Analysis with Suggestions
- Interview Question Generator

This implementation uses local, free LLMs via Ollama or Hugging Face
No API keys required - completely free and private!
"""

import os
import json
import logging
import requests
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# LLM imports - supports local models and APIs
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

logger = logging.getLogger(__name__)


class FeatureType(str, Enum):
    """Types of features the assistant can handle"""
    RESUME_TAILORING = "resume_tailoring"
    GAP_ANALYSIS = "gap_analysis"
    INTERVIEW_PREP = "interview_prep"
    GENERAL = "general"


class LLMService:
    """
    Service for handling LLM-powered features using local models or APIs.
    Supports free local models via Ollama, Hugging Face, or API-based models.
    """

    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "ollama").lower()
        self.model = os.getenv("LLM_MODEL", "mistral")
        self.max_tokens = int(os.getenv("LLM_MAX_TOKENS", 2000))
        self.temperature = float(os.getenv("LLM_TEMPERATURE", 0.7))
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        
        # API keys (optional, only for paid services)
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")

        # Initialize appropriate client based on provider
        if self.provider == "ollama":
            self.client = self._init_ollama()
        elif self.provider == "openai":
            if not OPENAI_AVAILABLE or not self.openai_key:
                logger.warning("OpenAI not available, falling back to Ollama")
                self.provider = "ollama"
                self.client = self._init_ollama()
            else:
                self.client = OpenAI(api_key=self.openai_key)
        elif self.provider == "anthropic":
            if not ANTHROPIC_AVAILABLE or not self.anthropic_key:
                logger.warning("Anthropic not available, falling back to Ollama")
                self.provider = "ollama"
                self.client = self._init_ollama()
            else:
                self.client = anthropic.Anthropic(api_key=self.anthropic_key)
        elif self.provider == "huggingface":
            self.client = self._init_huggingface()
        else:
            logger.warning(f"Unknown provider: {self.provider}, using Ollama")
            self.provider = "ollama"
            self.client = self._init_ollama()

        logger.info(f"Initialized LLM Service with provider: {self.provider}, model: {self.model}")

    def _init_ollama(self):
        """Initialize Ollama client"""
        try:
            # Test connection to Ollama
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
            if response.status_code == 200:
                logger.info(f"Connected to Ollama at {self.ollama_url}")
                return "ollama_connected"
            else:
                raise ConnectionError("Ollama service not responding")
        except Exception as e:
            logger.error(f"Failed to connect to Ollama: {str(e)}")
            logger.info("Make sure Ollama is running. Install from: https://ollama.ai")
            raise

    def _init_huggingface(self):
        """Initialize Hugging Face transformers pipeline"""
        if not TRANSFORMERS_AVAILABLE:
            raise ValueError(
                "Transformers library not installed. Install with: pip install transformers torch"
            )
        try:
            logger.info(f"Loading Hugging Face model: {self.model}")
            # Use text generation pipeline
            pipe = pipeline("text-generation", model=self.model, device_map="auto")
            return pipe
        except Exception as e:
            logger.error(f"Failed to load Hugging Face model: {str(e)}")
            raise

    def _get_system_prompt(self, feature_type: FeatureType) -> str:
        """Get system prompt based on feature type"""
        prompts = {
            FeatureType.RESUME_TAILORING: """You are an expert resume coach and career advisor. 
Your role is to help users tailor their resumes to match specific job descriptions.

When helping with resume tailoring:
1. Identify key skills and requirements from the job description
2. Suggest how to reword the user's experiences to match job keywords
3. Recommend which experiences to highlight
4. Generate compelling bullet points that bridge the gap between the user's experience and the job requirements
5. Ensure all suggestions maintain honesty and authenticity

Provide specific, actionable suggestions with examples.""",

            FeatureType.GAP_ANALYSIS: """You are a career development specialist and learning advisor.
Your role is to analyze gaps between a candidate's qualifications and job requirements, and provide actionable solutions.

When analyzing gaps:
1. Clearly identify missing skills and qualifications
2. Assess the importance and difficulty of learning each gap
3. Suggest specific learning resources, certifications, and projects
4. Provide realistic timelines for skill development
5. Help prioritize which skills to focus on first
6. Suggest alternative roles where current skills are more valuable

Be encouraging but honest about requirements.""",

            FeatureType.INTERVIEW_PREP: """You are an experienced interview coach and technical mentor.
Your role is to help candidates prepare for interviews by generating relevant questions and providing guidance.

When preparing for interviews:
1. Generate likely interview questions based on the job description and required skills
2. Provide suggested answers based on the candidate's resume and experience
3. For technical roles, create problem-solving hints and discussion points
4. Suggest behavioral questions and how to structure STAR method responses
5. Provide tips for each question category (technical, behavioral, situational)
6. Help candidates practice articulating their experience

Make questions realistic and helpful for actual interview preparation.""",

            FeatureType.GENERAL: """You are a knowledgeable career assistant powered by AI.
Help users with their career journey, job search, and professional development.
Be helpful, specific, and actionable in your responses."""
        }
        return prompts.get(feature_type, prompts[FeatureType.GENERAL])

    def chat(
        self,
        messages: List[Dict[str, str]],
        feature_type: FeatureType = FeatureType.GENERAL,
        context_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Send a chat message and get a response from the LLM

        Args:
            messages: List of message dicts with 'role' and 'content'
            feature_type: Type of feature to use appropriate system prompt
            context_data: Additional context like resume or job description

        Returns:
            str: The LLM's response
        """
        try:
            system_prompt = self._get_system_prompt(feature_type)

            # Add context to system prompt if provided
            if context_data:
                system_prompt += self._format_context(context_data)

            if self.provider == "ollama":
                return self._chat_ollama(messages, system_prompt)
            elif self.provider == "openai":
                return self._chat_openai(messages, system_prompt)
            elif self.provider == "anthropic":
                return self._chat_anthropic(messages, system_prompt)
            elif self.provider == "huggingface":
                return self._chat_huggingface(messages, system_prompt)

        except Exception as e:
            logger.error(f"Error in LLM chat: {str(e)}")
            raise

    def _chat_ollama(self, messages: List[Dict[str, str]], system_prompt: str) -> str:
        """Handle Ollama local model calls"""
        try:
            # Format messages for Ollama
            formatted_messages = [{"role": "system", "content": system_prompt}] + messages
            
            response = requests.post(
                f"{self.ollama_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": formatted_messages,
                    "stream": False,
                    "options": {
                        "temperature": self.temperature,
                        "num_predict": self.max_tokens,
                    }
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("message", {}).get("content", "")
            else:
                raise Exception(f"Ollama error: {response.text}")
        except requests.exceptions.ConnectionError:
            error_msg = (
                f"Cannot connect to Ollama at {self.ollama_url}. "
                "Please install and run Ollama: https://ollama.ai"
            )
            logger.error(error_msg)
            raise ConnectionError(error_msg)
        except Exception as e:
            logger.error(f"Ollama chat error: {str(e)}")
            raise

    def _chat_openai(self, messages: List[Dict[str, str]], system_prompt: str) -> str:
        """Handle OpenAI API calls"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    *messages
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    def _chat_anthropic(self, messages: List[Dict[str, str]], system_prompt: str) -> str:
        """Handle Anthropic Claude API calls"""
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                system=system_prompt,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise

    def _chat_huggingface(self, messages: List[Dict[str, str]], system_prompt: str) -> str:
        """Handle Hugging Face transformers model calls"""
        try:
            # Format messages for the model
            conversation = system_prompt + "\n\n"
            for msg in messages:
                role = "User" if msg["role"] == "user" else "Assistant"
                conversation += f"{role}: {msg['content']}\n"
            conversation += "Assistant: "
            
            # Generate response
            outputs = self.client(
                conversation,
                max_new_tokens=self.max_tokens,
                temperature=self.temperature,
                do_sample=True,
                top_p=0.95,
            )
            
            response_text = outputs[0]["generated_text"]
            # Extract only the new generated part
            response_text = response_text[len(conversation):].strip()
            return response_text
        except Exception as e:
            logger.error(f"Hugging Face error: {str(e)}")
            raise

    def _format_context(self, context_data: Dict[str, Any]) -> str:
        """Format additional context for the system prompt"""
        context = "\n\nAdditional Context:"

        if "resume" in context_data:
            context += f"\n\nCandidate Resume:\n{context_data['resume']}"

        if "job_description" in context_data:
            context += f"\n\nJob Description:\n{context_data['job_description']}"

        if "skills" in context_data:
            context += f"\n\nCandidate Skills: {', '.join(context_data['skills'])}"

        if "experience_years" in context_data:
            context += f"\n\nYears of Experience: {context_data['experience_years']}"

        return context

    def generate_tailored_resume_suggestions(
        self,
        resume_text: str,
        job_description: str,
        current_summary: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate tailored resume suggestions based on job description
        """
        messages = [
            {
                "role": "user",
                "content": f"""Please analyze my resume against this job description and provide:
1. Key skills and keywords I should emphasize
2. Reworded bullet points for each relevant experience
3. Suggested improvements to my professional summary
4. Any gaps I should address

Resume:
{resume_text}

Job Description:
{job_description}

{f'Current Professional Summary: {current_summary}' if current_summary else ''}

Provide a comprehensive, actionable response."""
            }
        ]

        response = self.chat(
            messages,
            FeatureType.RESUME_TAILORING,
            {
                "resume": resume_text,
                "job_description": job_description
            }
        )

        return {
            "suggestions": response,
            "feature": "resume_tailoring",
            "timestamp": datetime.now().isoformat()
        }

    def analyze_skill_gaps(
        self,
        resume_text: str,
        job_description: str,
        current_skills: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Analyze gaps between candidate qualifications and job requirements
        """
        messages = [
            {
                "role": "user",
                "content": f"""Please analyze the gaps between my qualifications and this job:

Resume:
{resume_text}

Job Description:
{job_description}

{f'Current Skills: {", ".join(current_skills)}' if current_skills else ''}

For each gap, provide:
1. The missing skill or qualification
2. Importance level (Must-have, Nice-to-have, Optional)
3. Difficulty to learn (Easy, Medium, Hard)
4. Specific learning resources or certifications
5. Estimated time to acquire
6. Relevant projects to build

Also suggest:
- Alternative roles where I might be a better fit
- Quick wins I can accomplish to strengthen my profile"""
            }
        ]

        response = self.chat(
            messages,
            FeatureType.GAP_ANALYSIS,
            {
                "resume": resume_text,
                "job_description": job_description,
                "skills": current_skills or []
            }
        )

        return {
            "analysis": response,
            "feature": "gap_analysis",
            "timestamp": datetime.now().isoformat()
        }

    def generate_interview_questions(
        self,
        resume_text: str,
        job_description: str,
        role_type: str = "general",
        is_technical: bool = False
    ) -> Dict[str, Any]:
        """
        Generate interview questions and preparation guidance
        """
        technical_context = "\nThis is a TECHNICAL role. Include technical questions and coding challenge hints." if is_technical else ""

        messages = [
            {
                "role": "user",
                "content": f"""Based on my resume and this job description, please generate:

1. Top 5 behavioral interview questions with STAR method answer structures
2. Top 5 role-specific technical questions (with hints for solving them)
3. 5 situational questions tailored to this role
4. 5 questions about the job description and company culture
5. For each question, provide:
   - The question
   - What the interviewer is looking for
   - Framework for answering (especially STAR for behavioral)
   - Example answer based on my resume

Resume:
{resume_text}

Job Description:
{job_description}

Role Type: {role_type}{technical_context}

Make the answers realistic, specific to my background, and interview-ready."""
            }
        ]

        response = self.chat(
            messages,
            FeatureType.INTERVIEW_PREP,
            {
                "resume": resume_text,
                "job_description": job_description
            }
        )

        return {
            "interview_prep": response,
            "feature": "interview_prep",
            "is_technical": is_technical,
            "timestamp": datetime.now().isoformat()
        }

    def generate_cover_letter(
        self,
        resume_text: str,
        job_description: str,
        company_name: str
    ) -> str:
        """
        Generate a tailored cover letter
        """
        messages = [
            {
                "role": "user",
                "content": f"""Generate a professional, personalized cover letter for this job. 

Company: {company_name}
Job Description: {job_description}

Based on my resume:
{resume_text}

The cover letter should:
1. Show genuine interest in the role and company
2. Highlight specific achievements that match job requirements
3. Address any gaps proactively
4. Be 3-4 paragraphs, professional but personable
5. Include specific examples from my experience

Write it as if I'm sending it tomorrow."""
            }
        ]

        return self.chat(
            messages,
            FeatureType.RESUME_TAILORING,
            {
                "resume": resume_text,
                "job_description": job_description
            }
        )


# Initialize service (will be used by FastAPI endpoints)
def get_llm_service() -> LLMService:
    """Get LLM service instance"""
    try:
        return LLMService()
    except ValueError as e:
        logger.error(f"Failed to initialize LLM service: {str(e)}")
        raise
