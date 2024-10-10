import { XFetch } from "@/x-fetch/src/index"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { worker } from "./mock"

beforeAll(() => worker.listen())
afterAll(() => worker.close())

describe("test x-fetch module", () => {
  it("hello world", async () => {
    const xfetch = new XFetch({
      baseUrl: "http://example.com",
    })
    const res = await xfetch.request({
      url: "/hello",
    })
    expect(res.data.message).toEqual("Hello World")
  })
})
