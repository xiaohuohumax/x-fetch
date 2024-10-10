import type { EndpointParameters } from "../endpoint/parameters"
import type { RequestRequestOptions } from "./request-options"

/**
 * Request parameters.
 */
export interface RequestParameters extends EndpointParameters {
  /**
   * Request settings options.
   */
  request?: RequestRequestOptions
}
