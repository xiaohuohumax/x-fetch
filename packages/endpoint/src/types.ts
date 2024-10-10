import type {
  EndpointMethod,
  EndpointParameters,
  EndpointParametersDefaults,
  EndpointResult,
  Route,
} from "@xiaohuohumax/x-fetch-types"

/**
 * Endpoint interface.
 */
export interface EndpointInterface<D extends object = object> {
  /**
   * Generic endpoint request with options and parameters
   *
   * @param options Endpoint options, Must include either `url`
   * @returns Endpoint result
   */
  <O extends EndpointParameters = EndpointParameters>(
    options: O
      & { method?: EndpointMethod }
      & ("url" extends keyof D ? { url?: string } : { url: string })
  ): EndpointResult & Pick<D & O, keyof EndpointResult>

  /**
   * Generic endpoint result with route and parameters
   *
   * @param route Endpoint route (request method + path) e.g. "GET /users"
   * @param parameters Endpoint parameters
   * @returns Endpoint result
   */
  <R extends Route, P extends EndpointParameters>(route: R, parameters?: P): EndpointResult

  /**
   * Endpoint defaults(default route and parameters)
   */
  DEFAULTS: D & EndpointParametersDefaults

  /**
   * Returns a new `endpoint` interface with new defaults
   * @param newDefaults New defaults parameters
   * @returns New `endpoint` interface with new defaults
   */
  defaults: <O extends EndpointParameters = EndpointParameters>(newDefaults: O) => EndpointInterface<D & O>

  merge: {
    /**
     * Merges parameters with defaults and endpoint defaults
     * @param route Endpoint route (request method + path or path only) e.g. "GET /users" or "/users"
     * @param parameters Endpoint parameters
     * @returns Merged parameters
     */
    <R extends Route, P extends EndpointParameters = EndpointParameters>(route: R, parameters?: P): EndpointParametersDefaults & D & P

    /**
     * Merges parameters with defaults and endpoint defaults
     * @param options Endpoint options, Must include either `url`
     * @returns Merged parameters
     */
    <P extends EndpointParameters = EndpointParameters>(options: P): EndpointParametersDefaults & D & P
  }

  /**
   * Parses parameters to endpoint result
   * @param options Endpoint parameters
   * @returns Endpoint result
   */
  parse: <O extends EndpointParametersDefaults = EndpointParametersDefaults>(options: O) => EndpointResult & Pick<O, keyof EndpointResult>
}
