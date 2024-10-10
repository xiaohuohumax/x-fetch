import type { XFetchOptions as XFetchCoreOptions } from "@xiaohuohumax/x-fetch-core"
import { XFetch as XFetchCore } from "@xiaohuohumax/x-fetch-core"
import { retryPlugin, type RetryPluginOptions } from "@xiaohuohumax/x-fetch-plugin-retry"

/**
 * XFetch options.
 */
export type XFetchOptions = XFetchCoreOptions & RetryPluginOptions

/**
 * XFetch: A simple, lightweight HTTP request library based on the fetch API, with plugins.
 *
 * plugins:
 *
 * - retry: retry failed requests.
 *
 * Example usage:
 *
 * ```typescript
 * import { XFetch } from "@xiaohuohumax/x-fetch"
 * const xFetch = new XFetch({
 *   baseUrl: "https://example.com",
 *   retry: {
 *     enabled: true,
 *     retries: 3,
 *   },
 * })
 *
 * // Add a retry interceptor.
 * xFetch.request.hook.before("retry", (config) => {
 *   console.log("before retry", config)
 * })
 *
 * // Add a request interceptor.
 * xFetch.request.hook.before("before", (config) => {
 *   console.log("before request", config)
 * })
 *
 * xFetch.request("GET /api/users", {
 *   // Request options.
 * })
 *
 * xFetch.request({
 *   url: "/api/users",
 *   method: "GET",
 *   // Request options.
 * })
 * ```
 */
export const XFetch = XFetchCore.plugin(retryPlugin)
