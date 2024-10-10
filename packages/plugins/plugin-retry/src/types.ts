import type { XFetchOptions } from "@xiaohuohumax/x-fetch-core"
import type { EndpointParameters, RequestOptions, RequestRequestOptions, XFetchResponse } from "@xiaohuohumax/x-fetch-types"
import type { WrapOptions } from "retry"
import "@xiaohuohumax/x-fetch-request"

/**
 * Retry options.
 */
export type Retry = Omit<WrapOptions, "retries"> & {
  /**
   * Whether to enable retry.
   * @default false
   */
  enabled?: boolean
  /**
   * The HTTP status codes that should not be retried.
   * @default [400, 401, 403, 404, 422, 451]
   */
  doNotRetry?: number[]
  /**
   * The maximum amount of times to retry the operation.
   * @default 3
   */
  retries?: number
}

/**
 * Retry plugin options.
 */
export interface RetryPluginOptions extends XFetchOptions {
  /**
   * Retry plugin options.
   */
  retry?: Retry
}

/**
 * Retry plugin interface.
 */
export interface RetryPlugin { }

declare module "@xiaohuohumax/x-fetch-core" {
  interface XFetchOptions {
    retry?: Retry
  }
}

declare module "@xiaohuohumax/x-fetch-request" {
  /**
   * Add hook types for retry plugin.
   *
   * @see https://www.npmjs.com/package/before-after-hook
   */
  interface RequestHooks {
    retry: {
      Options: RequestOptions
      Result: XFetchResponse<any>
      Error: Error
    }
  }
}

declare module "@xiaohuohumax/x-fetch-types" {
  /**
   * Request parameters.
   */
  interface RequestParameters extends EndpointParameters {
    /**
     * Request settings options.
     */
    request?: RequestRequestOptions
    /**
     * Retry options.
     */
    retry?: Retry
  }
}
