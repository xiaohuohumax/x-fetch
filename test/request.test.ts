import { request } from "@/request/src/index"
// import { ProxyAgent, fetch as undiciFetch } from 'undici'
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { worker } from "./mock"

beforeAll(() => worker.listen())
afterAll(() => worker.close())

describe("test request module", () => {
  it("hello world", async () => {
    const res = await request({
      url: "http://example.com/hello",
    })
    expect(res.data.message).toBe("Hello World")
  })

  it("test timeout", async () => {
    const res = await request({
      url: "http://example.com/timeout",
      request: {
        timeout: 1,
      },
    }).then(() => "success").catch(() => "timeout")
    expect(res).toBe("timeout")

    const zero = await request({
      url: "http://example.com/timeout",
      request: {
        timeout: 0,
      },
    }).then(() => "success").catch(() => "timeout")
    expect(zero).toBe("timeout")

    const res2 = await request({
      url: "http://example.com/reply",
      method: "POST",
      request: {
        timeout: 10000,
      },
    }).then(() => "success").catch(() => "timeout")
    expect(res2).toBe("success")
  })

  it("test request body type by content-type", async () => {
    expect((await request({
      url: "http://example.com/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      },
    })).data).toEqual({ name: "xiaohuohumax" })

    expect((await request({
      url: "http://example.com/text",
    })).data).toEqual("text")

    expect((await request({
      url: "http://example.com/blob",
    })).data).to.an.instanceOf(Blob)
  })

  it("test fetch signal abort", async () => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 1)
    const res = await request({
      url: "http://example.com/timeout",
      request: {
        signal: controller.signal,
      },
    }).then(() => "success").catch(() => "abort")
    expect(res).toEqual("abort")
  })

  it("test request defaults", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
      ext: "ext",
    })
    expect(r.endpoint.DEFAULTS.baseUrl).toEqual("http://example.com")
    expect(r.endpoint.DEFAULTS).toHaveProperty("ext")
  })

  it("test request endpoint", async () => {
    const e = request.endpoint({
      baseUrl: "http://example.com",
      url: "/hello",
    })
    expect(e.url).toEqual("http://example.com/hello")
  })

  it("test request hook `request`", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })
    const beforeFunc = vi.fn((options) => {
      expect(options.method).toEqual("POST")
    })
    const afterFunc = vi.fn((response) => {
      expect(response.data).toEqual({ name: "xiaohuohumax" })
    })
    const errorFunc = vi.fn()
    const wrapFunc = vi.fn((request, options) => {
      return request(options)
    })

    r.hook.before("request", beforeFunc)
    r.hook.after("request", afterFunc)
    r.hook.error("request", errorFunc)
    r.hook.wrap("request", wrapFunc)

    await r({
      url: "/reply",
      method: "POST",
      body: { name: "xiaohuohumax" },
    })

    expect(beforeFunc).toHaveBeenCalledOnce()
    expect(afterFunc).toHaveBeenCalledOnce()
    expect(wrapFunc).toHaveBeenCalledOnce()
    expect(errorFunc).not.toHaveBeenCalled()
  })

  it("test request hook `request` error", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })
    const errorFunc = vi.fn()
    r.hook.error("request", errorFunc)
    await r({
      url: "/timeout",
      request: {
        timeout: 1,
      },
      body: { name: "xiaohuohumax" },
    })

    expect(errorFunc).toHaveBeenCalled()
  })

  it("test request hook `parse-options`", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })

    const beforeFunc = vi.fn((options) => {
      expect(options.method).toEqual("POST")
    })
    const afterFunc = vi.fn((requestInit) => {
      expect(requestInit).toHaveProperty("method")
    })
    const errorFunc = vi.fn()
    const wrapFunc = vi.fn((request, options) => {
      return request(options)
    })

    r.hook.before("parse-options", beforeFunc)
    r.hook.after("parse-options", afterFunc)
    r.hook.error("parse-options", errorFunc)
    r.hook.wrap("parse-options", wrapFunc)

    await r({
      url: "/reply",
      method: "POST",
      body: { name: "xiaohuohumax" },
    })

    expect(beforeFunc).toHaveBeenCalledOnce()
    expect(afterFunc).toHaveBeenCalledOnce()
    expect(wrapFunc).toHaveBeenCalledOnce()
    expect(errorFunc).not.toHaveBeenCalled()
  })

  it("test request hook `parse-error`", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })

    const beforeFunc = vi.fn(({ error, options }) => {
      expect(error).not.toBeNull()
      expect(options.method).toEqual("GET")
    })
    const afterFunc = vi.fn((error) => {
      expect(error).not.toBeNull()
    })
    const errorFunc = vi.fn()
    const wrapFunc = vi.fn((request, options) => {
      return request(options)
    })

    r.hook.before("parse-error", beforeFunc)
    r.hook.after("parse-error", afterFunc)
    r.hook.error("parse-error", errorFunc)
    r.hook.wrap("parse-error", wrapFunc)

    await r({
      url: "/timeout",
      request: {
        timeout: 1,
      },
      body: { name: "xiaohuohumax" },
    }).catch(() => { })

    expect(beforeFunc).toHaveBeenCalledOnce()
    expect(afterFunc).toHaveBeenCalledOnce()
    expect(wrapFunc).toHaveBeenCalledOnce()
    expect(errorFunc).not.toHaveBeenCalled()
  })

  it("test request hook `parse-response`", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })

    const beforeFunc = vi.fn(({ fetchResponse, options }) => {
      expect(fetchResponse.status).toEqual(200)
      expect(options.method).toEqual("POST")
    })
    const afterFunc = vi.fn((response) => {
      expect(response).not.toBeNull()
    })
    const errorFunc = vi.fn()
    const wrapFunc = vi.fn((request, options) => {
      return request(options)
    })

    r.hook.before("parse-response", beforeFunc)
    r.hook.after("parse-response", afterFunc)
    r.hook.error("parse-response", errorFunc)
    r.hook.wrap("parse-response", wrapFunc)

    await r({
      url: "/reply",
      method: "POST",
      body: { name: "xiaohuohumax" },
    }).catch(() => { })

    expect(beforeFunc).toHaveBeenCalledOnce()
    expect(afterFunc).toHaveBeenCalledOnce()
    expect(wrapFunc).toHaveBeenCalledOnce()
    expect(errorFunc).not.toHaveBeenCalled()
  })

  it("test request options autoParseRequestBody", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",

    })
    const close = await r({
      url: "/reply",
      method: "POST",
      body: { name: "xiaohuohumax" },
      request: {
        autoParseRequestBody: false,
      },
    }).then(() => "success").catch(() => "error")

    expect(close).toEqual("error")

    const open = await r({
      url: "/reply",
      method: "POST",
      body: { name: "xiaohuohumax" },
      request: {
        autoParseRequestBody: true,
      },
    }).then(() => "success").catch(() => "error")

    expect(open).toEqual("success")
  })

  it("test request options throwResponseError", async () => {
    const r = request.defaults({
      baseUrl: "http://example.com",
    })
    const throwError = await r({
      url: "/error/404",
      request: {
        throwResponseError: true,
      },
    }).then(() => "success").catch(() => "error")

    expect(throwError).toEqual("error")

    const returnError = await r({
      url: "/error/404",
      request: {
        throwResponseError: false,
      },
    }).then(() => "success").catch(() => "error")

    expect(returnError).toEqual("success")
  })

  it("test request options responseType", async () => {
    expect((await request({
      url: "http://example.com/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      },
      request: {
        responseType: "text",
      },
    })).data).toEqual("{\"name\":\"xiaohuohumax\"}")
    expect((await request({
      url: "http://example.com/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      },
      request: {
        responseType: "json",
      },
    })).data).toEqual({ name: "xiaohuohumax" })
    expect((await request({
      url: "http://example.com/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      },
      request: {
        responseType: "arraybuffer",
      },
    })).data).to.be.instanceOf(ArrayBuffer)
    expect((await request({
      url: "http://example.com/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      },
      request: {
        responseType: "stream",
      },
    })).data).to.be.instanceOf(ReadableStream)
  })

  // todo msw mock
  // it("test request options fetch", async () => {
  //   const r = request.defaults({
  //     baseUrl: "http://example.com",
  //     request: {
  //       fetch: (url: any, options: any) => {
  //         return undiciFetch(url, {
  //           ...options,
  //           // dispatcher: new ProxyAgent('https://api.github.com'),
  //         })
  //       },
  //     },
  //   })
  //   const res = await r({
  //     url: "/reply",
  //     method: "POST",
  //     body: { name: "xiaohuohumax" },
  //   })
  //   expect(res.data).toEqual({ name: "xiaohuohumax" })
  // })

  it("test request.defaults function", async () => {
    request.defaults({
      baseUrl: "/x-fetch",
      headers: {
        "X-Custom-Header": "x-fetch",
      },
      params: {
        id: 1,
      },
      body: "x-fetch",
      ext: "ext",
    })
  })

  it("test request headers", async () => {
    const headers = new Headers()
    const obj = await request({
      url: "http://example.com/reply",
      method: "POST",
      headers,
    }).then(() => "success").catch(() => "error")
    expect(obj).toEqual("success")

    const str = await request({
      url: "http://example.com/reply",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => "success").catch(() => "error")
    expect(str).toEqual("success")
  })

  it("test request body", async () => {
    const jsonStr = await request({
      url: "http://example.com/reply",
      method: "POST",
      body: "{\"name\":\"xiaohuohumax\"}",
    })
    expect(jsonStr.data).toEqual({ name: "xiaohuohumax" })

    const arr = await request({
      url: "http://example.com/reply",
      method: "POST",
      body: [1, 2],
    })
    expect(arr.data).toEqual([1, 2])
  })

  it("test request throw TypeError", async () => {
    const abortController = new AbortController()
    const typeError = new TypeError("Failed to fetch")
    setTimeout(() => abortController.abort(typeError), 10)

    const obj = await request({
      url: "http://example.com/timeout",
      request: {
        signal: abortController.signal,
      },
    }).then(() => "success").catch(() => "error")

    expect(obj).toEqual("error")
  })

  it("test request throw TypeError with cause", async () => {
    const abortController = new AbortController()
    const typeError = new TypeError("Failed to fetch")
    typeError.cause = new Error("TypeError error case message")
    setTimeout(() => abortController.abort(typeError), 10)

    const obj = await request({
      url: "http://example.com/timeout",
      request: {
        signal: abortController.signal,
      },
    }).then(() => "success").catch(e => e.message)

    expect(obj).toContain("TypeError error case message")

    const messageController = new AbortController()

    typeError.cause = "TypeError string case message"
    setTimeout(() => messageController.abort(typeError), 10)

    const message = await request({
      url: "http://example.com/timeout",
      request: {
        signal: messageController.signal,
      },
    }).then(() => "success").catch(e => e.message)

    expect(message).toContain("TypeError string case message")
  })

  it("test request 204, 205 response", async () => {
    const res = await request({
      url: "http://example.com/error/204",
    }).then(() => "success").catch(() => "error")
    expect(res).toEqual("success")
    const res2 = await request({
      url: "http://example.com/error/205",
    }).then(() => "success").catch(() => "error")
    expect(res2).toEqual("success")
  })

  it("test request HEAD response", async () => {
    const res = await request({
      url: "http://example.com/error/200",
      method: "HEAD",
    }).then(() => "success").catch(() => "error")
    expect(res).toEqual("success")

    const res2 = await request({
      url: "http://example.com/error/500",
      method: "HEAD",
    }).then(() => "success").catch(() => "error")
    expect(res2).toEqual("error")
  })
})
