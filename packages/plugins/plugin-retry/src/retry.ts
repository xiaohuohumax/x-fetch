import type { XFetch } from "@xiaohuohumax/x-fetch-core"
import type { XFetchResponse } from "@xiaohuohumax/x-fetch-types"
import type { Retry, RetryPlugin, RetryPluginOptions } from "./types"
import { XFetchRequestError, XFetchTimeoutError } from "@xiaohuohumax/x-fetch-error"
import promiseRetry from "promise-retry"
import { DEFAULTS } from "./defaults"

/**
 * XFetch plugin for retrying requests.
 * @param xFetch XFetch instance.
 * @param options Options for retry plugin.
 * @returns Retry plugin.
 */
export function retryPlugin(xFetch: XFetch, options: RetryPluginOptions): RetryPlugin {
  let state: Required<Retry> = Object.assign(DEFAULTS, options.retry)

  xFetch.request.hook.wrap("request", async (request, options) => {
    state = Object.assign(state, options.retry)

    if (!state.enabled) {
      return await request(options)
    }

    return await promiseRetry(async (retry, _number) => {
      let response: XFetchResponse<any>
      try {
        response = await xFetch.request.hook("retry", request, options)
      }
      catch (error) {
        if (error instanceof Error && (error.name === "AbortError" || error instanceof XFetchTimeoutError)) {
          throw error
        }
        return retry(error)
      }

      if (!state.doNotRetry.includes(response.status) && response.status >= 400) {
        return retry(new XFetchRequestError(response.statusText, {
          status: response.status,
          statusText: response.statusText,
          request: options,
          response,
        }))
      }

      return response
    }, state)
  })

  return { }
}
