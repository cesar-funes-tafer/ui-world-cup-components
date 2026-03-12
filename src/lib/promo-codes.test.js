import { describe, expect, it } from "vitest";
import { parsePromoCodesInput, resolvePromoCodeForGoals } from "./promo-codes";

describe("parsePromoCodesInput", () => {
  it("returns object when a plain object is provided", () => {
    const config = { 0: "LOSS10" };
    expect(parsePromoCodesInput(config)).toEqual(config);
  });

  it("parses valid JSON string", () => {
    expect(parsePromoCodesInput('{"1":"GOAL15"}')).toEqual({ 1: "GOAL15" });
  });

  it("returns null for invalid input", () => {
    expect(parsePromoCodesInput("invalid-json")).toBeNull();
    expect(parsePromoCodesInput(["A"])).toBeNull();
  });
});

describe("resolvePromoCodeForGoals", () => {
  it("resolves code by goals from explicit promo config", () => {
    const promoCode = resolvePromoCodeForGoals(2, { 2: "GOAL20" });
    expect(promoCode).toBe("GOAL20");
  });

  it("falls back to default key when score key is missing", () => {
    const promoCode = resolvePromoCodeForGoals(1, { default: "PLAY5" });
    expect(promoCode).toBe("PLAY5");
  });

  it("falls back to secondary config when primary is empty", () => {
    const promoCode = resolvePromoCodeForGoals(
      3,
      { 3: "   " },
      { 3: "GOAL30" },
    );
    expect(promoCode).toBe("GOAL30");
  });
});
