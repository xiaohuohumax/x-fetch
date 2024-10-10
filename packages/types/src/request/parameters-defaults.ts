import type { EndpointMethod } from "../endpoint/method"
import type { Url } from "../endpoint/url"
import type { RequestParameters } from "./parameters"

/**
 * The default parameters for a request.
 */
export type RequestParametersDefaults = RequestParameters & {
  /**
   * HTTP URL.
   */
  url?: Url
  /**
   * HTTP method.
   */
  baseUrl: Url
  /**
   * HTTP method.
   */
  method: EndpointMethod
}
