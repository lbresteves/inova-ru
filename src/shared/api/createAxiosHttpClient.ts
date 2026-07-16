import { create } from "axios";
import { AxiosHttpClient } from "../base/AxiosHttpClient";
import type {
  HttpHeaders,
  IHttpClient,
} from "../types/IHttpClient";

export type AxiosHttpClientConfig = {
  baseURL: string;
  timeoutMs?: number;
  defaultHeaders?: HttpHeaders;
};

export function createAxiosHttpClient(
  config: AxiosHttpClientConfig,
): IHttpClient {
  const client = create({
    baseURL: config.baseURL,
    headers: config.defaultHeaders,
    timeout: config.timeoutMs,
  });

  return new AxiosHttpClient(client);
}
