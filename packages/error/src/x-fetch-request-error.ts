import type { RequestOptions, XFetchResponse } from "@xiaohuohumax/x-fetch-types"
import { XFetchError } from "./x-fetch-error"

/**
 * XFetch request error options.
 */
export interface XFetchRequestErrorOptions {
  status?: number
  statusText?: string
  request: RequestOptions
  response?: XFetchResponse<any>
}

/**
 * XFetch request error class.
 */
export class XFetchRequestError extends XFetchError {
  name: string = "XFetchRequestError"
  /**
   * request status code.
   */
  status?: number
  /**
   * request status text.
   */
  statusText?: string
  /**
   * request options.
   */
  request?: RequestOptions
  /**
   * request response.
   */
  response?: XFetchResponse<any>
  constructor(message: string, options: XFetchRequestErrorOptions) {
    super(message)
    const request = options.request
    const requestStr = `[${request.method}] ${request.url}`
    const statusStr = options.status
      ? options.statusText
        ? `(${options.status} ${options.statusText})`
        : `(${options.status})`
      : ""
    this.message = `${requestStr} ${statusStr} ${message}`.trim()
    this.status = options.status
    this.statusText = options.statusText
    this.request = options.request
    this.response = options.response
  }
}
