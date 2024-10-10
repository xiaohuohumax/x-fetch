import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"
import { withDefaults } from "./with-defaults"

/**
 * XFetch: A simple, lightweight HTTP request library based on the fetch API.
 *
 * Example usage:
 *
 * ```typescript
 * import { request } from "@xiaohuohumax/x-fetch-request"
 *
 * const req = request.defaults({
 *   baseUrl: "https://example.com",
 * })
 *
 * // Add a request interceptor.
 * req.hook.before("request", (config) => {
 *   console.log("before request", config)
 * })
 *
 * req("GET /api/users", {
 *   // Request options.
 * })
 *
 * req({
 *   url: "/api/users",
 *   method: "GET",
 *   // Request options.
 * })
 * ```
 */
export const request = withDefaults(endpoint, {})
