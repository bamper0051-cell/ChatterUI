// lib/utils/api-client.ts
export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string, options?: { headers?: Record<string, string> }) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.headers = options?.headers || {};
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  protected get<T>(endpoint: string, options?: { headers?: Record<string, string>; params?: Record<string, string> }) {
    const params = options?.params ? `?${new URLSearchParams(options.params).toString()}` : '';
    return this.request<T>(`${endpoint}${params}`, { headers: options?.headers });
  }

  protected post<T>(endpoint: string, data: any, options?: { headers?: Record<string, string> }) {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  }

  protected patch<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  protected delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}