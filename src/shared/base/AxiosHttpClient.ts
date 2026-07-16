import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { normalizeAxiosError } from "../api/normalizeAxiosError";
import type {
  HttpRequestOptions,
  IHttpClient,
} from "../types/IHttpClient";

function toAxiosConfig(options: HttpRequestOptions = {}): AxiosRequestConfig {
  return {
    headers: options.headers,
    params: options.params,
    signal: options.signal,
    timeout: options.timeoutMs,
  };
}

export class AxiosHttpClient implements IHttpClient {
  constructor(private readonly client: AxiosInstance) {}

  get<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.client.get<TResponse>(url, toAxiosConfig(options)),
    );
  }

  post<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.client.post<TResponse>(url, body, toAxiosConfig(options)),
    );
  }

  put<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.client.put<TResponse>(url, body, toAxiosConfig(options)),
    );
  }

  patch<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.client.patch<TResponse>(url, body, toAxiosConfig(options)),
    );
  }

  delete<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.client.delete<TResponse>(url, toAxiosConfig(options)),
    );
  }

  private async execute<TResponse>(
    request: () => Promise<AxiosResponse<TResponse>>,
  ): Promise<TResponse> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}
