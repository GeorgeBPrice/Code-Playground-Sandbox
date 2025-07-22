const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5445';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  messages?: ConsoleMessage[];
}

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export interface SqlResult {
  data: any[];
  rowCount: number;
  columns: string[];
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Execute SQL query
  async executeSql(query: string): Promise<ApiResponse<SqlResult>> {
    return this.makeRequest<SqlResult>('/api/execute-sql', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // Execute JavaScript code
  async executeJavaScript(code: string): Promise<ApiResponse<{ messages: ConsoleMessage[] }>> {
    return this.makeRequest<{ messages: ConsoleMessage[] }>('/api/execute-javascript', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  // Execute C# code
  async executeCSharp(code: string): Promise<ApiResponse<{ messages: ConsoleMessage[] }>> {
    return this.makeRequest<{ messages: ConsoleMessage[] }>('/api/execute-csharp', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  // Get database schema
  async getSchema(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/api/schema');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 