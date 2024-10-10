import type { EndpointHeaders } from "./headers"
import type { EndpointMethod } from "./method"
import type { Url } from "./url"

/**
 * Endpoint result.
 */
export interface EndpointResult {
  /**
   * HTTP method.
   */
  method: EndpointMethod
  /**
   * HTTP URL.
   */
  url: Url
  /**
   * HTTP headers.
   */
  headers?: EndpointHeaders
  /**
   * HTTP request body.
   */
  body?: any
  [option: string]: unknown
}
