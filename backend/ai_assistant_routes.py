"""
FastAPI routes for LLM-powered chat assistant
Handles resume tailoring, gap analysis, and interview prep
"""

import base64
import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from llm_service import get_llm_service, FeatureType
from ats_optimizer_service import (
    parse_resume_file,
    run_ats_optimization,
    build_docx,
    build_pdf,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai-assistant", tags=["AI Assistant"])


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    messages: List[ChatMessage]
    feature_type: str = "general"  # resume_tailoring, gap_analysis, interview_prep, general
    resume_text: Optional[str] = None
    job_description: Optional[str] = None
    context_data: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response model for chat"""
    response: str
    feature_type: str
    timestamp: str


class ResumeTailoringRequest(BaseModel):
    """Request for resume tailoring"""
    resume_text: str
    job_description: str
    professional_summary: Optional[str] = None


class GapAnalysisRequest(BaseModel):
    """Request for gap analysis"""
    resume_text: str
    job_description: str
    current_skills: Optional[List[str]] = None


class InterviewPrepRequest(BaseModel):
    """Request for interview preparation"""
    resume_text: str
    job_description: str
    role_type: str = "general"
    is_technical: bool = False


class CoverLetterRequest(BaseModel):
    """Request for cover letter generation"""
    resume_text: str
    job_description: str
    company_name: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for the AI assistant
    
    Supports multiple features:
    - resume_tailoring: Resume optimization advice
    - gap_analysis: Skill gap analysis with learning paths
    - interview_prep: Interview question generation
    - general: General career advice
    """
    try:
        llm_service = get_llm_service()

        # Convert messages to dict format for LLM
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # Prepare context data
        context_data = request.context_data or {}
        if request.resume_text:
            context_data["resume"] = request.resume_text
        if request.job_description:
            context_data["job_description"] = request.job_description

        # Get feature type
        try:
            feature = FeatureType(request.feature_type)
        except ValueError:
            feature = FeatureType.GENERAL

        # Get response from LLM
        response = llm_service.chat(
            messages=messages,
            feature_type=feature,
            context_data=context_data if context_data else None
        )

        return ChatResponse(
            response=response,
            feature_type=request.feature_type,
            timestamp=llm_service.client.__class__.__name__
        )

    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tailor-resume")
async def tailor_resume(request: ResumeTailoringRequest):
    """
    Generate tailored resume suggestions based on job description
    
    Returns:
    - Key skills and keywords to emphasize
    - Reworded bullet points
    - Improved professional summary suggestions
    - Specific gaps to address
    """
    try:
        llm_service = get_llm_service()

        result = llm_service.generate_tailored_resume_suggestions(
            resume_text=request.resume_text,
            job_description=request.job_description,
            current_summary=request.professional_summary
        )

        return result

    except Exception as e:
        logger.error(f"Resume tailoring error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-gaps")
async def analyze_gaps(request: GapAnalysisRequest):
    """
    Analyze skill gaps and provide learning recommendations
    
    Returns:
    - Missing skills and their importance
    - Learning difficulty assessment
    - Specific resources and certifications
    - Estimated learning timelines
    - Alternative roles where current skills are valuable
    """
    try:
        llm_service = get_llm_service()

        result = llm_service.analyze_skill_gaps(
            resume_text=request.resume_text,
            job_description=request.job_description,
            current_skills=request.current_skills
        )

        return result

    except Exception as e:
        logger.error(f"Gap analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interview-prep")
async def interview_prep(request: InterviewPrepRequest):
    """
    Generate interview preparation questions and guidance
    
    Returns:
    - Behavioral interview questions with STAR method structure
    - Technical questions with hints (if technical role)
    - Situational questions
    - Company/role specific questions
    - Example answers based on candidate's resume
    """
    try:
        llm_service = get_llm_service()

        result = llm_service.generate_interview_questions(
            resume_text=request.resume_text,
            job_description=request.job_description,
            role_type=request.role_type,
            is_technical=request.is_technical
        )

        return result

    except Exception as e:
        logger.error(f"Interview prep error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-cover-letter")
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generate a tailored cover letter for the job application
    
    Returns:
    - Personalized cover letter matching job requirements
    - References specific achievements from resume
    - Professional yet personable tone
    """
    try:
        llm_service = get_llm_service()

        cover_letter = llm_service.generate_cover_letter(
            resume_text=request.resume_text,
            job_description=request.job_description,
            company_name=request.company_name
        )

        return {
            "cover_letter": cover_letter,
            "company_name": request.company_name,
            "feature": "cover_letter_generation"
        }

    except Exception as e:
        logger.error(f"Cover letter generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check for AI assistant service"""
    try:
        llm_service = get_llm_service()
        return {
            "status": "healthy",
            "service": "AI Assistant",
            "provider": llm_service.provider,
            "model": llm_service.model
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


class CVGenerationRequest(BaseModel):
    """Request for custom CV generation"""
    job_description: str
    user_name: Optional[str] = "Your Name"
    user_email: Optional[str] = "your@email.com"
    base_resume: Optional[str] = ""


@router.post("/generate-cv")
async def generate_cv(request: CVGenerationRequest):
    """
    Generate a complete, tailored CV from a job description.

    Uses Ollama (Mistral) to produce an ATS-optimised CV with:
    - Professional Summary
    - Skills (Technical + Soft)
    - Work Experience with quantified achievements
    - Education & Projects
    - Certifications & Achievements
    """
    try:
        llm_service = get_llm_service()

        cv_text = llm_service.generate_custom_cv(
            job_description=request.job_description,
            user_name=request.user_name or "Your Name",
            user_email=request.user_email or "your@email.com",
            base_resume=request.base_resume or "",
        )

        return {
            "cv": cv_text,
            "feature": "cv_generation",
            "timestamp": __import__("datetime").datetime.now().isoformat(),
        }

    except Exception as e:
        logger.error(f"CV generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ats-optimize")
async def ats_optimize(
    resume_file: UploadFile = File(..., description="PDF or DOCX resume"),
    job_description: str = Form(..., description="Target job description"),
    optimization_mode: str = Form("aggressive", description="standard or aggressive"),
    output_formats: str = Form("docx,pdf", description="Comma-separated: docx,pdf"),
):
    """
    ATS Resume Optimizer — Full Pipeline

    Steps:
      1. Parse uploaded resume (PDF/DOCX) → raw text
      2. LLM Call 1: extract structured resume JSON (preserves all candidate info)
      3. LLM Call 2: analyse JD, extract ATS keywords, compute skill gap
      4. LLM Call 3: generate ATS-optimised resume + report
      5. Build DOCX and/or PDF documents
      6. Return optimised text + ATS report + base64 file downloads

    Rules enforced:
      ✓ Never fabricate experience or certifications
      ✓ Never overwrite contact/personal info
      ✓ Bullets rewritten: Action Verb + Task + Technology + Result
    """
    try:
        # ── Read uploaded file ──────────────────────────────────────────────
        file_bytes = await resume_file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty resume file uploaded.")

        content_type = resume_file.content_type or ""
        filename = resume_file.filename or "resume"

        # Infer content type from extension if browser didn't set it
        if not content_type or content_type == "application/octet-stream":
            if filename.lower().endswith(".pdf"):
                content_type = "application/pdf"
            elif filename.lower().endswith(".docx"):
                content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        # ── Parse resume text ────────────────────────────────────────────────
        logger.info(f"[ATS] Parsing resume: {filename} ({content_type})")
        resume_text = parse_resume_file(file_bytes, content_type)

        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=422,
                detail="Could not extract enough text from the resume. "
                       "Please upload a text-based PDF or DOCX file.",
            )

        # ── Run LLM optimization pipeline ────────────────────────────────────
        llm_service = get_llm_service()
        result = run_ats_optimization(
            resume_text=resume_text,
            job_description=job_description,
            optimization_mode=optimization_mode.lower().strip(),
            llm_service=llm_service,
        )

        optimized_resume: str = result["optimized_resume"]
        ats_report: dict = result["ats_report"]
        candidate_name: str = result.get("candidate_name", "Candidate")

        # ── Build documents ──────────────────────────────────────────────────
        formats = [f.strip().lower() for f in output_formats.split(",")]
        docx_b64 = ""
        pdf_b64 = ""

        if "docx" in formats:
            logger.info("[ATS] Building DOCX...")
            docx_bytes = build_docx(optimized_resume)
            docx_b64 = base64.b64encode(docx_bytes).decode("utf-8")

        if "pdf" in formats:
            logger.info("[ATS] Building PDF...")
            pdf_bytes = build_pdf(optimized_resume)
            pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

        logger.info("[ATS] Optimization complete ✓")

        return {
            "optimized_resume": optimized_resume,
            "ats_report": ats_report,
            "candidate_name": candidate_name,
            "docx_base64": docx_b64,
            "pdf_base64": pdf_b64,
            "feature": "ats_optimization",
        }

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"ATS optimization error: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))
