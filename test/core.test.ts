import { XFetch } from "@/core/src/index"
import { XFetchRequestError, XFetchTimeoutError } from "@/request/src/index"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { rfc6570TestCases, worker } from "./mock"

beforeAll(() => worker.listen())
afterAll(() => worker.close())

describe("test core module", () => {
  it("hello world", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
    })
    const res = await xfetch.request({
      url: "/hello",
    })
    expect(res.data.message).toBe("Hello World")
  })

  it("test typescript support", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
    })
    interface Body {
      name: string
    }
    const res = await xfetch.request<Body>({
      url: "/reply",
      method: "POST",
      body: {
        name: "xiaohuohumax",
      } as Body,
    })
    expect(res.data.name).toBe("xiaohuohumax")
  })

  it("test xfetch url rfc6570", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
    })

    rfc6570TestCases.forEach((testCase) => {
      const expected = xfetch.request.endpoint({
        url: testCase.url,
        params: testCase.params,
      })
      expect(expected.url).toEqual(`http://example.com${testCase.expected}`)
    })
  })

  it("test xfetch plugin", async () => {
    const pluginFunc = vi.fn((message: string) => {
      expect(message).toEqual("hello world")
    })
    interface TestPlugin {
      log: (message: string) => void
    }
    function testPlugin(_xfetch: typeof XFetch, _options: any): TestPlugin {
      return {
        log: pluginFunc,
      }
    }
    const NewXFetch = XFetch.plugin(testPlugin)

    const xfetch = new NewXFetch({
      baseUrl: "http://example.com",
    })

    xfetch.log("hello world")

    expect(pluginFunc).toHaveBeenCalledOnce()
  })

  it("text xfetch error", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
    })
    await xfetch.request({
      url: "/error/{status}",
      request: {
        throwResponseError: true,
      },
      params: {
        status: 404,
      },
    }).catch(error => expect(error).toBeInstanceOf(XFetchRequestError))

    await xfetch.request({
      url: "/timeout",
      request: {
        timeout: 0,
      },
    }).catch(error => expect(error).toBeInstanceOf(XFetchTimeoutError))
  })

  it("text xfetch userAgent", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
      userAgent: "xfetch",
    })
    const res = await xfetch.request({
      url: "/request",
    })
    expect(res.data["user-agent"]).toEqual("xfetch")
  })
})
