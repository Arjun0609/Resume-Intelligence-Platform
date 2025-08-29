const API_BASE_URL = 'https://ai-based-resume-screening.onrender.com/';

export interface ResumeAnalysis {
  id: string;
  category: string;
  confidence: number;
  white_text_detected: boolean;
  turnover_probability: number;
  employment_records: number;
  status: string;
  created_at?: string;
}

export interface BatchStats {
  total_resumes: number;
  white_text_detected: number;
  public_relations_classified: number;
  high_turnover_risk: number;
  average_confidence: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime_seconds: number;
  memory_usage_mb: number;
  active_endpoints: number;
}

export interface MetricsResponse {
  cpu_usage_percent: number;
  disk: {
    free_gb: number;
    total_gb: number;
    used_gb: number;
    percent_used: number;
  };
  memory: {
    available_mb: number;
    total_mb: number;
    used_mb: number;
    percent_used: number;
  };
}

export interface AnalyzeRunsResponse {
  duration_seconds: number;
  end_time: string;
  file: string;
  message_count: number;
  messages: string[];
  status: string;
  start_time: string;
  mode: string;
}

export interface HistoryResponse {
  limit: number;
  runs: any[];
  status: string;
  total_runs: number;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('API health check failed');
  }
  return response.json();
}

export async function getMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
}

export async function analyzeResume(
  file: File,
  options: {
    generate_visuals?: boolean;
    generate_report?: boolean;
    generate_dashboard?: boolean;
  } = {}
): Promise<any> {
  const formData = new FormData();
  formData.append('file_path', file);
  
  Object.entries(options).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to analyze resume');
  }

  return response.json();
}

export async function batchAnalyze(
  files: File[],
  options: {
    generate_visuals?: boolean;
    generate_report?: boolean;
    generate_dashboard?: boolean;
  } = {}
): Promise<any> {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });

  Object.entries(options).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  const response = await fetch(`${API_BASE_URL}/batch`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to batch analyze resumes');
  }

  return response.json();
}

export async function generateSamples(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/generate-samples`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to generate samples');
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/history`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch analysis history');
  }

  return response.json();
}

export async function getResumeById(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/analysis/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch resume');
  }

  return response.json();
}

export function getTurnoverRisk(probability: number) {
  if (probability >= 0.7) return { level: "High", variant: "destructive" as const, color: "text-red-600", bgColor: "bg-red-50" };
  if (probability >= 0.5) return { level: "Medium", variant: "default" as const, color: "text-yellow-600", bgColor: "bg-yellow-50" };
  return { level: "Low", variant: "secondary" as const, color: "text-green-600", bgColor: "bg-green-50" };
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}