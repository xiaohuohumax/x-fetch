import { endpoint } from "@/endpoint/src/index"
import { describe, expect, it } from "vitest"
import { rfc6570TestCases } from "./mock"

describe("test endpoint module", () => {
  it("test endpoint default options", async () => {
    expect(endpoint.DEFAULTS).toEqual({
      baseUrl: "",
      method: "GET",
    })
  })

  it("test endpoint.defaults function", async () => {
    const e = endpoint.defaults({
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

    expect(e.DEFAULTS.baseUrl).toEqual("/x-fetch")
    expect(e.DEFAULTS.headers).toEqual({
      "x-custom-header": "x-fetch",
    })
    expect(e.DEFAULTS.params).toEqual({
      id: 1,
    })
    expect(e.DEFAULTS.body).toBeTypeOf("string")
    expect(e.DEFAULTS.ext).toEqual("ext")
  })

  it("test endpoint instance options override defaults options", async () => {
    const e = endpoint.defaults({
      baseUrl: "/x-fetch",
      params: {
        id: 1,
        age: 100,
      },
      body: "old-x-fetch",
    })
    expect(e({
      url: "/user/{id}{?age}",
      method: "POST",
      params: {
        id: 2,
        age: 200,
      },
    }).url).toEqual("/x-fetch/user/2?age=200")

    expect(e({
      url: "/user/{id}{?age}",
      body: "new-x-fetch",
    }).body).toEqual("new-x-fetch")
  })

  it("test endpoint instance function with {options}", async () => {
    const e = endpoint.defaults({
      baseUrl: "/x-fetch",
      params: {
        id: 1,
      },
    })

    expect(e({
      url: "/user/{id}{?age}",
      method: "GET",
      params: {
        age: 100,
        name: "xiaohuohumax",
      },
    }).url).toEqual("/x-fetch/user/1?age=100&name=xiaohuohumax")
  })

  it("test endpoint instance function with {url, options}", async () => {
    const e = endpoint.defaults({
      baseUrl: "/x-fetch",
      params: {
        id: 1,
      },
    })

    const res = e("GET /user/{id}{?age}", {
      params: {
        age: 100,
        name: "xiaohuohumax",
      },
    })

    expect(res.url).toEqual("/x-fetch/user/1?age=100&name=xiaohuohumax")
    expect(res.method, "method should be GET").toEqual("GET")

    expect(e("/user/{id}").method, "not passing method should default to GET").toEqual("GET")
  })

  it("test endpoint url by rfc6570", async () => {
    rfc6570TestCases.forEach((testCase) => {
      expect(
        endpoint({
          url: `/base${testCase.url}`,
          params: testCase.params,
        }).url,
      ).toEqual(`/base${testCase.expected}`)
    })

    rfc6570TestCases.forEach((testCase) => {
      expect(
        endpoint(`/base${testCase.url}`, {
          params: testCase.params,
        }).url,
      ).toEqual(`/base${testCase.expected}`)
    })

    rfc6570TestCases.forEach((testCase) => {
      const e = endpoint.defaults({
        baseUrl: "",
        params: testCase.params,
      })
      expect(
        e(`/base${testCase.url}`).url,
      ).toEqual(`/base${testCase.expected}`)
    })
  })

  it("test endpoint instances are not shared", async () => {
    const e1 = endpoint.defaults({
      baseUrl: "/x-fetch",
    })

    const e2 = endpoint.defaults({
      baseUrl: "/x-fetch",
    })

    expect(e1).not.toBe(e2)
  })

  it("test endpoint headers use Headers", async () => {
    const headers = new Headers({
      "X-Custom-Header": "x-fetch",
    })
    const e = endpoint({
      url: "/user",
      headers,
    })
    expect(e.headers).toBeInstanceOf(Headers)
  })

  it("test endpoint empty url", async () => {
    // @ts-expect-error test empty url
    const e = endpoint({})
    expect(e.url).toEqual("/")
  })
})
