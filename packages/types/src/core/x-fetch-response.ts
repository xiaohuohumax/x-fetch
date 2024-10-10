import type { Url } from "../endpoint/url"
import type { XFetchResponseHeaders } from "./x-fetch-response-headers"

/**
 * XFetch response object.
 */
export interface XFetchResponse<T> {
  /**
   * Response headers.
   */
  headers: XFetchResponseHeaders
  /**
   * Response status code.
   */
  status: number
  /**
   * Response status text.
   */
  statusText: string
  /**
   * Request URL.
   */
  url: Url
  /**
   * Response data.
   */
  data: T
}
