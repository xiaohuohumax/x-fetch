import type { EndpointInterface } from "@xiaohuohumax/x-fetch-endpoint"
import type { RequestOptions, RequestParameters, Route, XFetchResponse } from "@xiaohuohumax/x-fetch-types"
import type { RequestHooks, RequestInterface } from "./types"
import Hook from "before-after-hook"
import { fetchWrapper } from "./fetch-wrapper"

export function withDefaults(oldEndpoint: EndpointInterface, newDefaults: RequestParameters): RequestInterface {
  const endpoint = oldEndpoint.defaults(newDefaults)
  const hook = new Hook.Collection<RequestHooks>()

  const newApi = function (route: Route | RequestOptions, parameters?: RequestParameters): Promise<XFetchResponse<any>> {
    const requestOptions = endpoint.parse(endpoint.merge(<Route>route, parameters))
    return hook("request", fetchWrapper.bind(null, hook), requestOptions)
  }

  return Object.assign(newApi, {
    endpoint,
    hook,
    defaults: withDefaults.bind(null, endpoint),
  }) as RequestInterface<typeof endpoint.DEFAULTS & typeof newDefaults>
}
