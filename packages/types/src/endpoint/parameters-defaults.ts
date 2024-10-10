import type { EndpointMethod } from "./method"
import type { EndpointParameters } from "./parameters"
import type { Url } from "./url"

/**
 * Endpoint default parameters.
 */
export type EndpointParametersDefaults = EndpointParameters & {
  /**
   * HTTP base URL.
   */
  baseUrl: Url
  /**
   * HTTP method.
   */
  method: EndpointMethod
}
