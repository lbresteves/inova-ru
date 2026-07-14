import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { axiosClient } from "@shared/api";
import type { HttpRequestOptions, IHttpClient } from "../types/IHttpClient";

function toAxiosConfig(options: HttpRequestOptions = {}): AxiosRequestConfig {
  return {
    headers: options.headers,
    params: options.params,
    signal: options.signal,
  };
}

export class AxiosHttpClient implements IHttpClient {
  constructor(private readonly client: AxiosInstance) {}

  async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    const response = await this.client.get<T>(url, toAxiosConfig(options));
    return response.data;
  }

  async post<T>(
    url: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    const response = await this.client.post<T>(url, body, toAxiosConfig(options));
    return response.data;
  }

  async put<T>(
    url: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    const response = await this.client.put<T>(url, body, toAxiosConfig(options));
    return response.data;
  }

  async delete<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    const response = await this.client.delete<T>(url, toAxiosConfig(options));
    return response.data;
  }
}

export const httpClient: IHttpClient = new AxiosHttpClient(axiosClient);
