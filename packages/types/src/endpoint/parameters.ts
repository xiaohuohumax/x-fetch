import type { EndpointHeaders } from "./headers"
import type { EndpointParams } from "./params"
import type { Url } from "./url"

/**
 * Endpoint parameters.
 */
export interface EndpointParameters {
  /**
   * HTTP base URL.
   */
  baseUrl?: Url
  /**
   * HTTP headers.
   */
  headers?: EndpointHeaders
  /**
   * HTTP request body.
   */
  body?: any
  /**
   * HTTP query/path parameters.
   */
  params?: EndpointParams
  [parameter: string]: unknown
}
