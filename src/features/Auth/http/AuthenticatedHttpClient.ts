import type {
  HttpRequestOptions,
  IHttpClient,
} from "@shared/types/IHttpClient";

export interface IAccessTokenProvider {
  getAccessToken(): Promise<string | null>;
}

export class AuthenticatedHttpClient implements IHttpClient {
  constructor(
    private readonly httpClient: IHttpClient,
    private readonly tokenProvider: IAccessTokenProvider,
  ) {}

  async get<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.httpClient.get<TResponse>(
      url,
      await this.withAuthorization(options),
    );
  }

  async post<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.httpClient.post<TBody, TResponse>(
      url,
      body,
      await this.withAuthorization(options),
    );
  }

  async put<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.httpClient.put<TBody, TResponse>(
      url,
      body,
      await this.withAuthorization(options),
    );
  }

  async patch<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.httpClient.patch<TBody, TResponse>(
      url,
      body,
      await this.withAuthorization(options),
    );
  }

  async delete<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.httpClient.delete<TResponse>(
      url,
      await this.withAuthorization(options),
    );
  }

  private async withAuthorization(
    options: HttpRequestOptions = {},
  ): Promise<HttpRequestOptions> {
    const token = await this.tokenProvider.getAccessToken();
    if (!token) {
      return options;
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
