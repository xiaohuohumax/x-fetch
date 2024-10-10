import type { EndpointOptions, EndpointParameters, EndpointParametersDefaults, Route } from "@xiaohuohumax/x-fetch-types"
import type { EndpointInterface } from "./types"
import { merge } from "./merge"
import { parse } from "./parse"

function endpointWithDefaults(defaults: EndpointParametersDefaults, route: Route | EndpointOptions, options?: EndpointParameters) {
  return parse(merge(defaults, route, options))
}

export function withDefaults(oldDefaults: EndpointParametersDefaults | null, newDefaults: EndpointParameters): EndpointInterface {
  const DEFAULTS = merge(oldDefaults, newDefaults)
  const endpointResult = endpointWithDefaults.bind(null, DEFAULTS)

  return Object.assign(endpointResult, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse,
  }) as EndpointInterface
}
