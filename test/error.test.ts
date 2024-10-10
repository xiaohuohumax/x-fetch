import type { XFetchRequestErrorOptions } from "@/error/src/index"
import { XFetchError, XFetchRequestError, XFetchTimeoutError } from "@/error/src/index"
import { describe, expect, it } from "vitest"

describe("test error module", () => {
  it("test XFetchError", () => {
    try {
      throw new XFetchError("test error")
    }
    catch (error) {
      expect(error).toBeInstanceOf(XFetchError)
    }
  })

  it("test XFetchTimeoutError", () => {
    try {
      throw new XFetchTimeoutError("test error", {
        request: {
          method: "GET",
          url: "http://example.com",
        },
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(XFetchTimeoutError)
    }
  })

  it("test XFetchRequestError", () => {
    const options: XFetchRequestErrorOptions = {

      request: {
        method: "GET",
        url: "http://example.com",
      },
    }

    try {
      throw new XFetchRequestError("test error", options)
    }
    catch (error) {
      expect(error).toBeInstanceOf(XFetchRequestError)
      const e = error as XFetchRequestError
      expect(e.status).toBeUndefined()
      expect(e.response).toBeUndefined()
      expect(e.request).not.toBeNull()
    }

    options.status = 404
    options.response = {
      headers: {},
      status: 404,
      statusText: "Not Found",
      url: "http://example.com",
      data: "test response",
    }

    try {
      throw new XFetchRequestError("test error", options)
    }
    catch (error) {
      expect(error).toBeInstanceOf(XFetchRequestError)
      const e = error as XFetchRequestError
      expect(e.status).toEqual(404)
      expect(e.response).not.toBeNull()
      expect(e.request).not.toBeNull()
    }

    try {
      options.statusText = "Not Found"
      throw new XFetchRequestError("test error", options)
    }
    catch (error) {
      const e = error as XFetchRequestError
      expect(e.statusText).toEqual("Not Found")
    }
  })
})
