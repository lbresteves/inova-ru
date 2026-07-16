export type HttpHeaders = Record<string, string>;

export type HttpQueryPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type HttpQueryParams = Record<
  string,
  HttpQueryPrimitive | HttpQueryPrimitive[]
>;

export interface HttpRequestOptions {
  headers?: HttpHeaders;
  params?: HttpQueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface IHttpClient {
  get<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;

  post<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;

  put<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;

  patch<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;

  delete<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;
}
