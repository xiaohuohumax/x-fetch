/**
 * XFetch response type
 *
 * ps: `stream` means the response is a fetch stream(ReadableStream).
 */
export type XFetchResponseType = "json"
  | "text"
  | "blob"
  | "stream"
  | "formData"
  // TODO: 大版本升级时，arraybuffer将被舍弃
  | "arraybuffer"
  | "arrayBuffer"
