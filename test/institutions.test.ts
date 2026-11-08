import { describe, expect, test } from "bun:test";
import {
  FALLBACK_INSTITUTION,
  INSTITUTIONS,
  institutionFor,
} from "@/data/institutions";

describe("institutionFor", () => {
  test("resolve match conhecido", () => {
    const org = institutionFor("UTFPR");
    expect(org.id).toBe("utfpr");
    expect(org.name).toBe("UTFPR");
  });

  test("resolve alias Bradesco", () => {
    expect(institutionFor("Fundação Bradesco").id).toBe("bradesco");
    expect(institutionFor("Bradesco").id).toBe("bradesco");
  });

  test("desconhecido cai no fallback com o nome original", () => {
    const org = institutionFor("Escola Inventada XYZ");
    expect(org.id).toBe(FALLBACK_INSTITUTION.id);
    expect(org.name).toBe("Escola Inventada XYZ");
    expect(org.logos).toEqual(FALLBACK_INSTITUTION.logos);
  });
});

describe("INSTITUTIONS", () => {
  test("ids únicos", () => {
    const ids = INSTITUTIONS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("cada org tem logo e match", () => {
    for (const org of INSTITUTIONS) {
      expect(org.logos.length).toBeGreaterThan(0);
      expect(org.match.length).toBeGreaterThan(0);
    }
  });
});
