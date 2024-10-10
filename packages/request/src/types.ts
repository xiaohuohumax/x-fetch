import type { EndpointInterface } from "@xiaohuohumax/x-fetch-endpoint"
import type {
  EndpointMethod,
  RequestOptions,
  RequestParameters,
  Route,
  XFetchResponse,
} from "@xiaohuohumax/x-fetch-types"
import type { HookCollection } from "before-after-hook"

/**
 * Parse error options
 */
export interface ParseErrorOptions {
  /**
   * Request options
   */
  options: RequestOptions
  /**
   * Fetch error
   */
  error: Error
}

/**
 * Parse response options
 */
export interface ParseResponseOptions {
  /**
   * Fetch response
   */
  fetchResponse: Response
  /**
   * Request options
   */
  options: RequestOptions
}

/**
 * Request hooks
 */
export interface RequestHooks {
  /**
   * Request hook
   */
  "request": {
    /**
     * Request options
     */
    Options: RequestOptions
    /**
     * Request response
     */
    Result: XFetchResponse<any>
    Error: Error
  }
  /**
   * Parse options hook(before request)
   */
  "parse-options": {
    /**
     * Request options
     */
    Options: RequestOptions
    /**
     * Request init(fetch options)
     */
    Result: RequestInit
    Error: Error
  }
  /**
   * Parse error hook(request error)
   */
  "parse-error": {
    /**
     * Parse error options(fetch error, request options)
     */
    Options: ParseErrorOptions
    /**
     * Parse error result(parse fetch error to custom error)
     */
    Result: Error
    Error: Error
  }
  /**
   * Parse response hook(after request)
   */
  "parse-response": {
    /**
     * Parse response options(fetch response, request options)
     */
    Options: ParseResponseOptions
    /**
     * Parse response result(parse fetch response to custom response)
     */
    Result: XFetchResponse<any>
    Error: Error
  }
  [key: string]: {
    Options: unknown
    Result: unknown
    Error: unknown
  }
}

/**
 * Request interface
 */
export interface RequestInterface<D extends object = object> {
  /**
   * Sends a request based on endpoint options
   *
   * @param options Endpoint options, Must include either `url`
   * @returns XFetch response
   */
  <T = any, O extends RequestParameters = RequestParameters>(
    options: O
      & { method?: EndpointMethod }
      & ("url" extends keyof D ? { url?: string } : { url: string })
  ): Promise<XFetchResponse<T>>

  /**
   * Sends a request based on endpoint route and parameters
   *
   * @param route Endpoint route (request method + path or path only) e.g. "GET /users" or "/users"
   * @param options Endpoint parameters
   * @returns XFetch response
   */
  <T = any, R extends Route = Route>(route: R, options?: RequestParameters): Promise<XFetchResponse<T>>

  /**
   * Returns a new `request` with updated route and parameters
   *
   * @param newDefaults New default parameters
   * @returns New `request` with updated route and parameters
   */
  defaults: <O extends RequestParameters = RequestParameters>(newDefaults: O) => RequestInterface<D & O>

  /**
   * Request hook collection
   *
   * Example usage:
   *
   * ```typescript
   * request.hook.before("request", async (options) => {
   *   console.log("Request started", options)
   * })
   * ```
   */
  hook: HookCollection<RequestHooks>

  /**
   * XFetch endpoint interface
   */
  endpoint: EndpointInterface<D>
}
