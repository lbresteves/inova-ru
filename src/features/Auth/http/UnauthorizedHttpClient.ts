import { ApiError } from "@shared/api/ApiError";
import type {
  HttpRequestOptions,
  IHttpClient,
} from "@shared/types/IHttpClient";

export class UnauthorizedHttpClient implements IHttpClient {
  constructor(
    private readonly httpClient: IHttpClient,
    private readonly onUnauthorized: () => Promise<void> | void,
  ) {}

  get<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() => this.httpClient.get<TResponse>(url, options));
  }

  post<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.httpClient.post<TBody, TResponse>(url, body, options),
    );
  }

  put<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.httpClient.put<TBody, TResponse>(url, body, options),
    );
  }

  patch<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() =>
      this.httpClient.patch<TBody, TResponse>(url, body, options),
    );
  }

  delete<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.execute(() => this.httpClient.delete<TResponse>(url, options));
  }

  private async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          await this.onUnauthorized();
        } catch {
          // Preserve the original HTTP error even if local cleanup fails.
        }
      }

      throw error;
    }
  }
}
