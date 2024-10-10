import type { EndpointParameters, EndpointParametersDefaults, Route } from "@xiaohuohumax/x-fetch-types"
import { deleteUndefinedProperties, objectLowercaseKeys } from "@xiaohuohumax/x-fetch-utils"
import mergeDeep from "deepmerge"
import { isPlainObject } from "is-plain-object"

/**
 * XFetch endpoint parameters merge function.
 * @param defaults Endpoint parameters defaults
 * @param route Route or endpoint parameters
 * @param options Additional options
 * @returns Merged endpoint parameters
 */
export function merge(defaults: EndpointParametersDefaults | null, route?: Route | EndpointParameters, options?: EndpointParameters): EndpointParametersDefaults {
  if (typeof route === "string") {
    const [method, url] = route.trim().split(/ +/, 2)
    options = Object.assign(url ? { method, url } : { url: method }, options)
  }
  else {
    options = Object.assign({}, route)
  }

  if (options.headers && !(options.headers instanceof Headers)) {
    options.headers = objectLowercaseKeys(options.headers)
    deleteUndefinedProperties(options.headers)
  }
  deleteUndefinedProperties(options)

  return mergeDeep(defaults || {}, options, {
    isMergeableObject: isPlainObject,
  }) as EndpointParametersDefaults
}
