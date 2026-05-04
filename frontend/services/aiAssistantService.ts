import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  feature_type: string;
  resume_text?: string;
  job_description?: string;
  context_data?: Record<string, any>;
}

interface ResumeTailoringRequest {
  resume_text: string;
  job_description: string;
  professional_summary?: string;
}

interface GapAnalysisRequest {
  resume_text: string;
  job_description: string;
  current_skills?: string[];
}

interface InterviewPrepRequest {
  resume_text: string;
  job_description: string;
  role_type?: string;
  is_technical?: boolean;
}

interface CoverLetterRequest {
  resume_text: string;
  job_description: string;
  company_name: string;
}

export const aiAssistantService = {
  /**
   * Send a chat message to the AI assistant
   */
  async chat(request: ChatRequest) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/ai-assistant/chat`, request);
      return response.data;
    } catch (error) {
      console.error('Chat request failed:', error);
      throw error;
    }
  },

  /**
   * Generate tailored resume suggestions
   */
  async tailorResume(request: ResumeTailoringRequest) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/ai-assistant/tailor-resume`, request);
      return response.data;
    } catch (error) {
      console.error('Resume tailoring request failed:', error);
      throw error;
    }
  },

  /**
   * Analyze skill gaps and get recommendations
   */
  async analyzeGaps(request: GapAnalysisRequest) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/ai-assistant/analyze-gaps`, request);
      return response.data;
    } catch (error) {
      console.error('Gap analysis request failed:', error);
      throw error;
    }
  },

  /**
   * Generate interview preparation questions
   */
  async prepareInterview(request: InterviewPrepRequest) {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/ai-assistant/interview-prep`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Interview prep request failed:', error);
      throw error;
    }
  },

  /**
   * Generate a tailored cover letter
   */
  async generateCoverLetter(request: CoverLetterRequest) {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/ai-assistant/generate-cover-letter`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      throw error;
    }
  },

  /**
   * Check AI Assistant health status
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/ai-assistant/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};
