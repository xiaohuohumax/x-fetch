import type { XFetchRequestErrorOptions } from "@xiaohuohumax/x-fetch-error"
import type { RequestOptions, XFetchResponse, XFetchResponseType } from "@xiaohuohumax/x-fetch-types"
import type { HookCollection } from "before-after-hook"
import type { ParseErrorOptions, ParseResponseOptions, RequestHooks } from "./types"
import { XFetchError, XFetchRequestError, XFetchTimeoutError } from "@xiaohuohumax/x-fetch-error"
import { mergeSignals, omit } from "@xiaohuohumax/x-fetch-utils"
import { safeParse } from "fast-content-type-parse"
import { isPlainObject } from "is-plain-object"

/**
 * Parse request options to fetch options.
 * @param options request options
 * @returns fetch options
 */
async function parseOptions(options: RequestOptions): Promise<RequestInit> {
  let headers: Headers
  if (options.headers instanceof Headers) {
    headers = options.headers
  }
  else {
    headers = new Headers()
    for (const [name, value] of Object.entries(options.headers || {})) {
      if (typeof value === "string") {
        headers.append(name, value)
      }
    }
  }

  // auto set content-type and accept
  if (!headers.has("content-type")) {
    headers.append("content-type", "application/json")
  }
  if (!headers.has("accept")) {
    headers.append("accept", "application/json")
  }

  let body = options.body

  const mimeType = safeParse(headers.get("content-type")!)
  if (
    body
    && mimeType?.type === "application/json"
    && options.request?.autoParseRequestBody !== false
  ) {
    if (typeof body !== "string" && (isPlainObject(body) || Array.isArray(body))) {
      body = JSON.stringify(body)
    }
  }

  if (options.method === "GET" || options.method === "HEAD") {
    body = undefined
  }

  const fetchExtOptions = omit(options, [
    "request",
    "baseUrl",
    "headers",
    "body",
    "params",
    "method",
    "url",
  ])

  const signal = options.request?.signal

  return Object.assign(
    fetchExtOptions,
    {
      headers,
      method: options.method,
      ...(body && { duplex: "half" }),
    },
    body ? { body } : null,
    signal ? { signal } : null,
  )
}

/**
 * Parse error.
 * @param pOptions parse error options
 * @returns parsed error
 */
async function parseError(pOptions: ParseErrorOptions): Promise<Error> {
  const { error, options } = pOptions
  let message = "Unknown Error"

  if (error instanceof Error) {
    if (error instanceof XFetchError || error.name === "AbortError") {
      return error
    }
    message = error.message

    if (error.name === "TypeError" && "cause" in error) {
      if (error.cause instanceof Error) {
        message = error.cause.message
      }
      else if (typeof error.cause === "string") {
        message = error.cause
      }
    }
  }

  const requestError = new XFetchRequestError(message, {
    request: options,
  })
  requestError.cause = error

  return requestError
}

/**
 * Parse response.
 * @param pOptions parse response options
 * @returns parsed response
 */
async function parseResponse(pOptions: ParseResponseOptions): Promise<XFetchResponse<any>> {
  const { fetchResponse, options } = pOptions
  const status = fetchResponse.status
  const responseHeaders = Object.fromEntries(fetchResponse.headers.entries())

  const response: XFetchResponse<any> = {
    url: options.url,
    status,
    statusText: fetchResponse.statusText,
    headers: responseHeaders,
    data: undefined,
  }

  if (status === 204 || status === 304) {
    return response
  }

  const errorOptions: XFetchRequestErrorOptions = {
    status,
    statusText: fetchResponse.statusText,
    request: options,
    response,
  }

  response.data = await parseResponseBody(fetchResponse, options)

  let requestError: XFetchRequestError | undefined
  if (options.method === "HEAD") {
    if (status < 400) {
      return response
    }
    requestError = new XFetchRequestError("HEAD request failed", errorOptions)
  }

  if (status >= 400 && status < 600) {
    requestError = new XFetchRequestError("Request failed", errorOptions)
  }

  if (requestError && options.request?.throwResponseError !== false) {
    throw requestError
  }

  return response
}

/**
 * Parse response body.
 * @param response fetch response
 * @param options request options
 * @returns parsed response body
 */
async function parseResponseBody(response: Response, options: RequestOptions): Promise<any> {
  let responseType: XFetchResponseType = "arrayBuffer"

  const contentType = response.headers.get("content-type")
  if (contentType) {
    const mimeType = safeParse(contentType)
    if (mimeType.type === "application/json") {
      responseType = "json"
    }
    else if (mimeType.type === "multipart/form-data") {
      responseType = "formData"
    }
    else if (mimeType.type.startsWith("text/")) {
      responseType = "text"
    }
    else {
      responseType = "blob"
    }
  }

  if (options.request?.responseType) {
    responseType = options.request.responseType
  }

  switch (responseType) {
    case "json": {
      return await response.json().catch(() => ({}))
    }
    case "text": {
      return await response.text().catch(() => "")
    }
    case "blob": {
      return await response.blob().catch(() => new Blob())
    }
    case "stream": {
      return response.body
    }
    case "formData": {
      return await response.formData().catch(() => new FormData())
    }
    case "arraybuffer":
    case "arrayBuffer":
    default: {
      return await response.arrayBuffer().catch(() => new ArrayBuffer(0))
    }
  }
}

/**
 * XFetch Fetch wrapper.
 * @param hook request hook collection
 * @param options request options
 * @returns XFetch response
 */
export async function fetchWrapper(hook: HookCollection<RequestHooks>, options: RequestOptions): Promise<XFetchResponse<any>> {
  const fetch: typeof globalThis.fetch = options.request?.fetch || globalThis.fetch

  const fetchOptions = await hook("parse-options", parseOptions, options)

  let fetchResponse: Response
  const timeout = options.request?.timeout
  let timeoutId: any
  const hasTimeout = typeof timeout === "number"

  try {
    const signals = []

    if (hasTimeout) {
      const timeoutAbortController = new AbortController()
      signals.push(timeoutAbortController.signal)

      timeoutId = setTimeout(() => timeoutAbortController.abort(
        new XFetchTimeoutError("Request Timeout", {
          request: options,
        }),
      ), Math.max(timeout || 0, 0))
    }

    if (fetchOptions?.signal) {
      signals.push(fetchOptions.signal)
    }

    fetchOptions.signal = mergeSignals(signals)
    fetchResponse = await fetch(options.url, fetchOptions)
  }
  catch (error) {
    throw await hook("parse-error", parseError, { error: error as Error, options })
  }
  finally {
    clearTimeout(timeoutId)
  }

  return await hook("parse-response", parseResponse, { fetchResponse, options })
}
