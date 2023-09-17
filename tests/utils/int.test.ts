import { Integer } from "@lc/utils"

describe("Integer", () => {
  test("create", () => {
    expect(Integer.create(2)).toBe(2);
    expect(Integer.create(2.2)).toBe(2);
    expect(Integer.create(2.9)).toBe(2);
    expect(Integer.create(-2.3)).toBe(-2);
  })

  test("toInt", () => {
    expect(Integer.toInt("23")).toBe(23);
    expect(Integer.toInt("23.534")).toBe(23);
  })

  test("checkIsInt", () => {
    expect(Integer.checkIsInt(1.2)).toBe(false);
    expect(Integer.checkIsInt(2)).toBe(true);
  })

})