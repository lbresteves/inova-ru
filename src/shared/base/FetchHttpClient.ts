import { ApiError } from "../api/ApiError";
import type {
  HttpQueryParams,
  HttpRequestOptions,
  IHttpClient,
} from "../types/IHttpClient";

interface IFetchHttpClientConfig extends HttpRequestOptions {
  baseURL?: string;
}

type AbortState = {
  signal?: AbortSignal;
  timedOut: () => boolean;
  cleanup: () => void;
};

function appendQueryParams(url: string, params?: HttpQueryParams): string {
  if (!params) {
    return url;
  }

  const query = Object.entries(params).flatMap(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    return values
      .filter((item) => item !== undefined && item !== null)
      .map(
        (item) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
      );
  });

  if (query.length === 0) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}${query.join("&")}`;
}

function createAbortState(
  externalSignal?: AbortSignal,
  timeoutMs?: number,
): AbortState {
  if (timeoutMs === undefined) {
    return {
      signal: externalSignal,
      timedOut: () => false,
      cleanup: () => undefined,
    };
  }

  const controller = new AbortController();
  let didTimeOut = false;
  const onExternalAbort = () => controller.abort();
  const timeout = setTimeout(() => {
    didTimeOut = true;
    controller.abort();
  }, timeoutMs);

  externalSignal?.addEventListener("abort", onExternalAbort, { once: true });
  if (externalSignal?.aborted) {
    controller.abort();
  }

  return {
    signal: controller.signal,
    timedOut: () => didTimeOut,
    cleanup: () => {
      clearTimeout(timeout);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    },
  };
}

async function readResponseData(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const content = await response.text();
  if (!content) {
    return undefined;
  }

  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

function getResponseMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "Não foi possível concluir a solicitação.";
}

export class FetchHttpClient implements IHttpClient {
  private static instance: FetchHttpClient;
  private defaultConfig: IFetchHttpClientConfig;

  private constructor(defaultConfig: IFetchHttpClientConfig = {}) {
    this.defaultConfig = defaultConfig;
  }

  static getInstance(
    defaultConfig: IFetchHttpClientConfig = {},
  ): FetchHttpClient {
    if (!FetchHttpClient.instance) {
      FetchHttpClient.instance = new FetchHttpClient(defaultConfig);
    } else {
      FetchHttpClient.instance.defaultConfig = {
        ...FetchHttpClient.instance.defaultConfig,
        ...defaultConfig,
      };
    }

    return FetchHttpClient.instance;
  }

  get<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  post<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("POST", url, body, options);
  }

  put<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("PUT", url, body, options);
  }

  patch<TBody, TResponse>(
    url: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("PATCH", url, body, options);
  }

  delete<TResponse>(
    url: string,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("DELETE", url, undefined, options);
  }

  private async request<TResponse>(
    method: string,
    url: string,
    body: unknown,
    options: HttpRequestOptions = {},
  ): Promise<TResponse> {
    const fullUrl = appendQueryParams(this.buildURL(url), options.params);
    const timeoutMs = options.timeoutMs ?? this.defaultConfig.timeoutMs;
    const abortState = createAbortState(options.signal, timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          ...this.defaultConfig.headers,
          ...options.headers,
        },
        signal: abortState.signal,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      const data = await readResponseData(response);

      if (!response.ok) {
        throw new ApiError(
          getResponseMessage(data),
          "http",
          response.status,
          data,
        );
      }

      return data as TResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (abortState.timedOut()) {
        throw new ApiError(
          "O servidor demorou para responder. Tente novamente.",
          "timeout",
        );
      }

      if (options.signal?.aborted) {
        throw new ApiError("A solicitação foi cancelada.", "cancelled");
      }

      throw new ApiError(
        "Não foi possível conectar ao servidor.",
        "network",
      );
    } finally {
      abortState.cleanup();
    }
  }

  private buildURL(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const baseURL = this.defaultConfig.baseURL?.replace(/\/$/, "") || "";
    const path = url.replace(/^\//, "");
    return `${baseURL}/${path}`;
  }
}
