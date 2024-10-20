import type { XFetchResponse } from "@/types/dist"
import { XFetch } from "@/core/src/index"
import { retryPlugin } from "@/plugins/plugin-retry/src/index"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { worker } from "./mock"

beforeAll(() => worker.listen())
afterAll(() => worker.close())

describe("test plugin-retry module", () => {
  const NewXFetch = XFetch.plugin(retryPlugin)

  it("test plugin-retry disabled", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: false,
      },
    })
    const retryFunc = vi.fn()
    const requestFunc = vi.fn()

    xfetch.request.hook.before("retry", retryFunc)
    xfetch.request.hook.before("request", requestFunc)

    await xfetch.request({
      url: "/error/500",
      request: {
        throwResponseError: false,
      },
      retry: {
        enabled: true,
      },
    }).catch(() => "")

    expect(retryFunc).toHaveBeenCalledTimes(0)
    expect(requestFunc).toHaveBeenCalledTimes(1)
  })

  it("test plugin-retry hook", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
    })
    const retryFunc = vi.fn()

    xfetch.request.hook.before("retry", retryFunc)

    await xfetch.request({
      url: "/error/500",
      request: {
        throwResponseError: false,
      },
    }).catch(() => "")

    expect(retryFunc).toHaveBeenCalledTimes(1)
  })

  it("test plugin-retry retries", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
    })
    const retry500Func = vi.fn()
    const retry501Func = vi.fn()

    xfetch.request.hook.before("retry", (options) => {
      if (options.url.includes("500")) {
        retry500Func()
      }
      else if (options.url.includes("501")) {
        retry501Func()
      }
    })

    const req500 = xfetch.request({
      url: "/error/500",
      request: {
        throwResponseError: false,
      },
      retry: {
        retries: 1,
      },
    }).catch(() => "")

    const req501 = xfetch.request({
      url: "/error/501",
      request: {
        throwResponseError: false,
      },
      retry: {
        retries: 2,
      },
    }).catch(() => "")

    await Promise.all([req500, req501])

    expect(retry500Func).toHaveBeenCalledTimes(1)
    expect(retry501Func).toHaveBeenCalledTimes(2)
  })

  it("test plugin-retry timeout", { timeout: 5000 }, async () => {
    const abortController = new AbortController()

    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
      request: {
        signal: abortController.signal,
      },
    })
    setTimeout(() => abortController.abort(), 10)

    const res = await xfetch.request({
      url: "/timeout",
    }).then(() => "success").catch(e => e)

    expect(res).not.toBeTypeOf("string")
  })

  it("test plugin-retry abort", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
      request: {
        timeout: 10,
      },
    })

    const res = await xfetch.request({
      url: "/timeout",
    }).then(() => "success").catch(e => e)

    expect(res).not.toBeTypeOf("string")
  })

  it("test plugin-retry throwResponseError", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      request: {
        throwResponseError: true,
      },
      retry: {
        enabled: true,
        retries: 1,
      },
    })

    const res = await xfetch.request({
      url: "/error/500",
    }).then(() => "success").catch(e => e)

    expect(res).not.toBeTypeOf("string")
  })

  it("test plugin-retry doNotRetry", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
        doNotRetry: [500],
      },
      request: {
        throwResponseError: false,
      },
    })

    const res = await xfetch.request<XFetchResponse<any>>({
      url: "/error/500",
    })

    expect(res.status).toEqual(500)
  })

  it("test plugin-retry override", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
    })

    const retryFunc = vi.fn()

    xfetch.request.hook.before("retry", retryFunc)

    await xfetch.request<XFetchResponse<any>>({
      url: "/error/500",
      retry: {
        enabled: false,
      },
    }).catch(() => "")

    expect(retryFunc).toBeCalledTimes(0)
  })
})
