import { describe, expect, test } from "bun:test";
import { cn } from "@/lib/utils";

describe("cn", () => {
  test("junta classes", () => {
    expect(cn("a", "b")).toContain("a");
    expect(cn("a", "b")).toContain("b");
  });

  test("ignora valores falsy", () => {
    expect(cn("ok", false && "no", null, undefined)).toContain("ok");
  });
});
