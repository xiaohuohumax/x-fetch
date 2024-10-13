import { deleteUndefinedProperties, getUriTemplateVariableNames, objectLowercaseKeys, omit, parseUriTemplate } from "@/utils/src/index"
import { describe, expect, it } from "vitest"
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
})
