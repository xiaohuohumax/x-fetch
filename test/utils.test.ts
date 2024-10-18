import { deleteUndefinedProperties, getUriTemplateVariableNames, mergeSignals, objectLowercaseKeys, omit, parseUriTemplate } from "@/utils/src/index"
import { describe, expect, it, vi } from "vitest"
import { rfc6570TestCases } from "./mock"

describe("test utils module", () => {
  it("test util parseUriTemplate", async () => {
    rfc6570TestCases.forEach((testCase) => {
      expect(
        parseUriTemplate(testCase.url, testCase.params),
      ).toEqual(testCase.expected)
    })

    expect(
      parseUriTemplate("http://example.com/users", { names: ["xiaohuohumax", "name2"] }),
    ).toEqual("http://example.com/users?names=xiaohuohumax&names=name2")

    expect(
      parseUriTemplate("http://example.com/users", { name: "xiaohuohumax" }),
    ).toEqual("http://example.com/users?name=xiaohuohumax")
  })

  it("test util getUriTemplateVariableNames", async () => {
    rfc6570TestCases.forEach((testCase) => {
      expect(
        getUriTemplateVariableNames(testCase.url),
      ).toEqual(new Set(Object.keys(testCase.params)))
    })

    expect(
      getUriTemplateVariableNames("http://example.com/"),
    ).toEqual(new Set([]))
  })

  it("test util objectLowercaseKeys", async () => {
    expect(
      objectLowercaseKeys({
        "HELLO": "WORLD",
        "Hobby": ["reading", "swimming"],
        "FIRST-NAME": "name",
        "NULL": null,
        "UNDEFINED": undefined,
      }),
    ).toEqual({
      "hello": "WORLD",
      "hobby": ["reading", "swimming"],
      "first-name": "name",
      "null": null,
      "undefined": undefined,
    })

    expect(objectLowercaseKeys()).toBeUndefined()
  })

  it("test util deleteUndefinedProperties", async () => {
    const obj = {
      "hello": "WORLD",
      "hobby": ["reading", "swimming"],
      "first-name": "name",
      "null": null,
      "undefined": undefined,
    }
    deleteUndefinedProperties(obj)
    expect(obj).toEqual({
      "hello": "WORLD",
      "hobby": ["reading", "swimming"],
      "first-name": "name",
      "null": null,
    })

    expect(deleteUndefinedProperties()).toBeUndefined()
  })

  it("test util omit", async () => {
    const obj = omit({
      name: "xiaohuohumax",
      age: 100,
    }, ["name"])

    expect(obj).not.toHaveProperty("name")
    expect(obj).toHaveProperty("age")
  })

  it("test util mergeSignals", async () => {
    expect(mergeSignals([])).toBeNull()
    const abortController1 = new AbortController()
    const abortController2 = new AbortController()

    expect(mergeSignals([
      abortController1.signal,
    ])).toBeInstanceOf(AbortSignal)

    expect(mergeSignals([
      abortController1.signal,
      abortController2.signal,
    ])).toBeInstanceOf(AbortSignal)

    const mergedSignal = mergeSignals([
      abortController1.signal,
      abortController2.signal,
    ])

    const abortFunc = vi.fn()

    mergedSignal?.addEventListener("abort", abortFunc)

    await new Promise((resolve) => {
      setTimeout(() => {
        abortController1.abort()
        resolve("")
      }, 10)
    })

    expect(abortFunc).toHaveBeenCalled()

    const mergedAbortedSignal = mergeSignals([
      abortController1.signal,
      abortController2.signal,
    ])

    expect(mergedAbortedSignal?.aborted).toBe(true)
  })

  it("test util signals contention", async () => {
    interface Callback {
      (reason?: any): void
    }

    function createSignalMock() {
      return {
        aborted: false,
        reason: undefined,
        callbacks: [] as Callback[],
        addEventListener(_type: string, callback: Callback) {
          this.callbacks.push(callback)
        },
        abort(reason?: any) {
          this.aborted = true
          this.reason = reason
          this.callbacks.forEach((callback: Callback) => callback(reason))
        },
        removeEventListener: vi.fn(),
      }
    }

    const signal1 = createSignalMock()
    const signal2 = createSignalMock()

    const mergedSignal = mergeSignals([signal1, signal2] as any as AbortSignal[])

    mergedSignal?.addEventListener("abort", () => {
      expect(mergedSignal?.aborted).toBe(true)
      expect(mergedSignal?.reason).toBe("reason1")
    })

    signal1.abort("reason1")
    signal2.abort("reason2")
  })
})
