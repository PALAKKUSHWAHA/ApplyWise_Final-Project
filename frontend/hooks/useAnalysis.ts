import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  analyzeResume, 
  analyzeBatchResumes as apiAnalyzeBatchResumes, 
  getBatchAnalysisStatus, 
  AnalysisResult, 
  BatchAnalysisResult 
} from '../services/api';
import toast from 'react-hot-toast';

interface UseAnalysisState {
  isLoading: boolean;
  results: AnalysisResult | null;
  batchResults: BatchAnalysisResult | null;
  error: string | null;
  progress: number; // 0-100 for batch analysis
}

interface UseAnalysisActions {
  analyzeSingleResume: (file: File, jobDescription: string) => Promise<void>;
  analyzeBatchResumes: (files: File[], jobDescription: string) => Promise<void>;
  checkBatchStatus: (jobId: string) => Promise<void>;
  reset: () => void;
}

// Simple LRU Cache for analysis results
class AnalysisCache {
  private cache: Map<string, { result: AnalysisResult; timestamp: number }> = new Map();
  private maxSize = 20;
  private ttl = 30 * 60 * 1000; // 30 minutes

  getKey(file: File, jobDescription: string): string {
    // Create a simple hash key from file name and job description
    return `${file.name}_${file.size}_${jobDescription.slice(0, 100)}`;
  }

  get(key: string): AnalysisResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  set(key: string, result: AnalysisResult): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const analysisCache = new AnalysisCache();

export const useAnalysis = (): UseAnalysisState & UseAnalysisActions => {
  const [state, setState] = useState<UseAnalysisState>({
    isLoading: false,
    results: null,
    batchResults: null,
    error: null,
    progress: 0,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const analyzeSingleResume = useCallback(
    async (file: File, jobDescription: string) => {
      // Check cache first
      const cacheKey = analysisCache.getKey(file, jobDescription);
      const cachedResult = analysisCache.get(cacheKey);

      if (cachedResult) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          results: cachedResult,
          error: null,
        }));
        toast.success('Results loaded from cache!');
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null, results: null }));

      // Debounce rapid requests
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const loadingToast = toast.loading('Analyzing resume...');
          const results = await analyzeResume(file, jobDescription);

          // Cache the results
          analysisCache.set(cacheKey, results);

          setState(prev => ({
            ...prev,
            isLoading: false,
            results,
            error: null,
          }));

          toast.dismiss(loadingToast);
          toast.success('Analysis completed successfully!');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis';
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            results: null,
          }));
          toast.error(errorMessage);
        }
      }, 300); // 300ms debounce
    },
    []
  );

  const analyzeBatchResumes = useCallback(
    async (files: File[], jobDescription: string) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        batchResults: null,
        progress: 0,
      }));

      try {
        const loadingToast = toast.loading(
          `Starting batch analysis for ${files.length} resumes...`
        );
        const { job_id } = await apiAnalyzeBatchResumes(files, jobDescription);

        const pollStatus = async () => {
          try {
            const batchResults = await getBatchAnalysisStatus(job_id);
            
            // Update progress based on status
            let progress = 0;
            if (batchResults.status === 'processing') {
              progress = 50;
            } else if (batchResults.status === 'completed') {
              progress = 100;
            }

            setState(prev => ({
              ...prev,
              batchResults,
              progress,
            }));

            if (batchResults.status === 'completed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
              }
              toast.dismiss(loadingToast);
              toast.success('Batch analysis completed!');
              setState(prev => ({ ...prev, isLoading: false }));
            } else if (batchResults.status === 'failed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
              }
              toast.dismiss(loadingToast);
              toast.error(batchResults.error || 'Batch analysis failed');
              setState(prev => ({
                ...prev,
                isLoading: false,
                error: batchResults.error || 'Analysis failed',
              }));
            }
          } catch (error) {
            toast.dismiss(loadingToast);
            const errorMessage = error instanceof Error ? error.message : 'Failed to check batch status';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            toast.error(errorMessage);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          }
        };

        // Initial check
        pollStatus();

        // Then poll every 2 seconds
        pollIntervalRef.current = setInterval(pollStatus, 2000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to start batch analysis';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          batchResults: null,
        }));
        toast.error(errorMessage);
      }
    },
    []
  );

  const checkBatchStatus = useCallback(async (jobId: string) => {
    try {
      const batchResults = await getBatchAnalysisStatus(jobId);
      setState(prev => ({ ...prev, batchResults, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check batch status';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    setState({
      isLoading: false,
      results: null,
      batchResults: null,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    ...state,
    analyzeSingleResume,
    analyzeBatchResumes,
    checkBatchStatus,
    reset,
  };
};
