/**
 * XFetch endpoint headers(request headers)
 */
export type EndpointHeaders = Headers | {
  "accept"?: string
  "accept-encoding"?: string
  "accept-language"?: string
  "authorization"?: string
  "host"?: string
  "referer"?: string
  "user-agent"?: string
  "content-type"?: string
  "cookie"?: string
  [header: string]: string | undefined
}
