import type { EndpointMethod, EndpointParametersDefaults, EndpointResult } from "@xiaohuohumax/x-fetch-types"
import { omit, parseUriTemplate } from "@xiaohuohumax/x-fetch-utils"

/**
 * XFetch endpoint parameters parser.
 * @param options parameters
 * @returns parsed parameters
 */
export function parse(options: EndpointParametersDefaults): EndpointResult {
  let url = (options.url as string || "/").replace(/:([a-z]\w+)/g, "{$1}")

  if (!/^http/i.test(url)) {
    url = options.baseUrl + url
  }

  const extOptions = omit(options, [
    "baseUrl",
    "method",
    "url",
    "headers",
    "body",
    "params",
  ])

  return Object.assign(
    extOptions,
    {
      method: options.method.toUpperCase() as EndpointMethod,
      url: parseUriTemplate(url, options.params || {}),
    },
    options.headers ? { headers: options.headers } : {},
    options.body ? { body: options.body } : {},
  )
}
