import type { RequestOptions } from "@xiaohuohumax/x-fetch-types"
import { XFetchError } from "./x-fetch-error"

/**
 * XFetch timeout error options.
 */
export interface XFetchTimeoutErrorOptions {
  request: RequestOptions
}

/**
 * XFetch request timeout error.
 */
export class XFetchTimeoutError extends XFetchError {
  name: string = "XFetchTimeoutError"
  /**
   * request options.
   */
  request: RequestOptions
  constructor(message: string, options: XFetchTimeoutErrorOptions) {
    super(message)
    this.request = options.request
  }
}
