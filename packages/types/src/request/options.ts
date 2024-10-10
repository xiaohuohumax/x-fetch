import type { EndpointResult } from "../endpoint/result"
import type { RequestRequestOptions } from "./request-options"

/**
 * Request options.
 */
export type RequestOptions = EndpointResult & {
  /**
   * Request settings options.
   */
  request?: RequestRequestOptions
}
