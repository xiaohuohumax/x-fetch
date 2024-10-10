import type { EndpointMethod } from "./method"
import type { EndpointParameters } from "./parameters"
import type { Url } from "./url"

/**
 * Endpoint options
 */
export type EndpointOptions = EndpointParameters & {
  /**
   * HTTP method.
   */
  method: EndpointMethod
  /**
   * Endpoint URL
   */
  url: Url
}
