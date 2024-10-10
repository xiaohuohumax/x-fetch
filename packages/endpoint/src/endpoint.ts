import { DEFAULTS } from "./defaults"
import { withDefaults } from "./with-defaults"

/**
 * XFetch Http request options utility.
 *
 * Example usage:
 *
 * ```typescript
 * import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"
 *
 * const newEndpoint = endpoint.defaults({
 *   baseUrl: "https://example.com",
 *   headers: {
 *     "content-type": "application/json",
 *   },
 * })
 *
 * const e = newEndpoint("/api/users")
 *
 * console.log(e)
 *
 * // {
 * //   method: 'GET',
 * //   url: 'https://example.com/api/users',
 * //   headers: { 'content-type': 'application/json' }
 * // }
 * ```
 */
export const endpoint = withDefaults(null, DEFAULTS)
