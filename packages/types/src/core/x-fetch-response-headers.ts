/**
 * XFetch Response Headers
 */
export interface XFetchResponseHeaders {
  "content-type"?: string
  "date"?: string
  "content-encoding"?: string
  "content-length"?: string
  "content-language"?: string
  "location"?: string
  "cache-control"?: string
  "server"?: string
  "set-cookie"?: string
  "expires"?: string
  [header: string]: string | number | undefined
}
