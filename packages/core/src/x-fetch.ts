import type { RequestInterface } from "@xiaohuohumax/x-fetch-request"
import type { EndpointHeaders, EndpointMethod, EndpointParams, RequestRequestOptions } from "@xiaohuohumax/x-fetch-types"
import { request } from "@xiaohuohumax/x-fetch-request"

type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never

type AnyFunction = (...args: any) => any

type ReturnTypeOf<T extends AnyFunction | AnyFunction[]> =
  T extends AnyFunction
    ? ReturnType<T>
    : T extends AnyFunction[]
      ? UnionToIntersection<Exclude<ReturnType<T[number]>, void>>
      : never

type Constructor<T> = new (...args: any[]) => T

/**
 * XFetch options.
 */
export interface XFetchOptions {
  /**
   * Base URL for all requests.
   */
  baseUrl: string
  /**
   * HTTP request method defaults.
   *
   * @default "GET"
   */
  method?: EndpointMethod
  /**
   * HTTP request headers defaults.
   */
  headers?: EndpointHeaders
  /**
   * HTTP request URI template parameters defaults.
   *
   * Parameters for the RFC6570 URI template.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc6570
   */
  params?: EndpointParams
  /**
   * HTTP request options.
   */
  request?: RequestRequestOptions
  /**
   * HTTP request header user-agent.
   */
  userAgent?: string
  [option: string]: any
}

/**
 * XFetch plugin type.
 *
 * @param xFetch XFetch instance.
 * @param options plugin options.
 * @returns plugin injected methods.
 */
export type XFetchPlugin<F, O extends XFetchOptions = XFetchOptions> = (
  xFetch: F,
  options: O,
) => { [key: string]: any } | void

/**
 * XFetch: A simple, lightweight HTTP request library based on the fetch API.
 *
 * Example usage:
 *
 * ```typescript
 * import { XFetch } from "@xiaohuohumax/x-fetch-core"
 *
 * const xFetch = new XFetch({
 *   baseUrl: "https://example.com",
 * })
 *
 * // Add a request interceptor.
 * xFetch.request.hook.before("request", (config) => {
 *   console.log("before request", config)
 * })
 *
 * xFetch.request("GET /api/users", {
 *   // Request options.
 * })
 * // or
 * xFetch.request({
 *   url: "/api/users",
 *   method: "GET",
 *   // Request options.
 * })
 * ```
 */
export class XFetch<O extends XFetchOptions = XFetchOptions> {
  /**
   * XFetch request util instance.
   */
  request: RequestInterface
  /**
   * XFetch plugins.
   */
  static plugins: XFetchPlugin<XFetch>[] = []

  constructor(public options: O) {
    this.request = request.defaults({
      ...options,
      headers: Object.assign(
        {},
        options.headers,
        options.userAgent ? { "user-agent": options.userAgent } : null,
      ),
    })

    const classConstructor = this.constructor as typeof XFetch
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options))
    }
  }

  /**
   * XFetch plugin decorator.
   *
   * Example usage:
   *
   * ```typescript
   * import type { XFetchOptions as XFetchCoreOptions } from "@xiaohuohumax/x-fetch-core"
   * import { XFetch as XFetchCore } from "@xiaohuohumax/x-fetch-core"
   * import { somePlugin, type SomePluginOptions } from "plugin"
   *
   * export const XFetch = XFetchCore.plugin(somePlugin)
   * export type XFetchOptions = XFetchCoreOptions & SomePluginOptions
   * ```
   *
   * @param this XFetch class.
   * @param plugins injected plugins.
   * @returns XFetch instance with new plugins.
   */
  static plugin<
    S extends Constructor<any> & { plugins: any[] },
    T extends XFetchPlugin<any>[],
  >(
    this: S,
    ...plugins: T
  ) {
    const currentPlugins = this.plugins

    const NewXFetch = class extends this {
      static plugins = currentPlugins.concat(
        plugins.filter(plugin => !currentPlugins.includes(plugin)),
      )
    }

    return NewXFetch as typeof this & Constructor<UnionToIntersection<ReturnTypeOf<T>>>
  }
}

export type XFetchInstance<O extends XFetchOptions = XFetchOptions> = typeof XFetch<O>
