import type { XFetchResponseType } from "../core/x-fetch-response-type"
import type { RequestFetch } from "./fetch"
import type { RequestSignal } from "./signal"

/**
 * Request settings options.
 */
export interface RequestRequestOptions {
  /**
   * fetch signal.
   *
   * abort fetch request when signal is aborted.
   */
  signal?: RequestSignal
  /**
   * auto parse request body.
   *
   * if true, request body will be parsed automatically according to request content-type.
   *
   * @default true
   */
  autoParseRequestBody?: boolean
  /**
   * throw response error.
   *
   * if true, throw response error when fetch response status code is in the range of 400-599.
   *
   * @default true
   */
  throwResponseError?: boolean
  /**
   * response type.
   *
   * [`json`, `text`, `blob`, `stream`, `arrayBuffer`, `formData`]
   *
   * **warning**: `arraybuffer` are deprecated, use `arrayBuffer` instead.
   *
   * if set, response data will be parsed according to response type.
   * if not set, request body will be parsed automatically according to request content-type.
   * @see {@link autoParseRequestBody}
   *
   *
   * @default undefined 'arrayBuffer'
   */
  responseType?: XFetchResponseType
  /**
   * timeout(ms).
   *
   * @default undefined
   */
  timeout?: number
  /**
   * fetch function.
   *
   * you can use custom fetch function, default use browser built-in fetch function.
   * Example usage:
   *
   * ```TypeScript
   * import { ProxyAgent, fetch as undiciFetch } from 'undici'
   *
   * const request: RequestRequestOptions = {
   *   fetch: (url: any, options: any) => {
   *     return undiciFetch(url, {
   *       ...options,
   *       dispatcher: new ProxyAgent('https://....'),
   *     })
   *   },
   * }
   * ```
   */
  fetch?: RequestFetch
  [option: string]: any
}
