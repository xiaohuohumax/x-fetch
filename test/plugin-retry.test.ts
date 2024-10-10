import type { XFetchResponse } from "@/types/dist"
import { XFetch } from "@/core/src/index"
import { retryPlugin } from "@/plugins/plugin-retry/src/index"
import { describe, expect, it, vi } from "vitest"

describe("test plugin-retry module", () => {
  const NewXFetch = XFetch.plugin(retryPlugin)

  it("test plugin-retry hook", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "https://example.com",
      retry: {
        enabled: true,
        retries: 1,
      },
    })
    const retryFunc = vi.fn()

    xfetch.request.hook.before("retry", retryFunc)

    await xfetch.request({
      url: "/error/{status}",
      request: {
        throwResponseError: false,
      },
      params: {
        status: 500,
      },
    }).catch(() => "")

    expect(retryFunc).toHaveBeenCalledTimes(2)
  })

  it("test plugin-retry timeout", { timeout: 5000 }, async () => {
    const abortController = new AbortController()

    const xfetch = new NewXFetch({
      baseUrl: "https://example.com",
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
      baseUrl: "https://example.com",
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
      baseUrl: "https://example.com",
      request: {
        throwResponseError: true,
      },
    })

    const res = await xfetch.request({
      url: "/error/500",
    }).then(() => "success").catch(e => e)

    expect(res).not.toBeTypeOf("string")
  })

  it("test plugin-retry doNotRetry", { timeout: 5000 }, async () => {
    const xfetch = new NewXFetch({
      baseUrl: "https://example.com",
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
      baseUrl: "https://example.com",
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
