import { VERSION } from "@/types/src/index"
import { describe, expect, it } from "vitest"

describe("test types module", () => {
  it("should have a version", () => {
    expect(VERSION).toBeTypeOf("string")
  })
})
