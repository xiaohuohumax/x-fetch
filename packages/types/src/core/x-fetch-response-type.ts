/**
 * XFetch response type
 *
 * ps: `stream` means the response is a fetch stream(ReadableStream).
 */
export type XFetchResponseType = "json"
  | "text"
  | "blob"
  | "stream"
  | "arraybuffer"
