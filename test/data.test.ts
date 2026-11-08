import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  SKILL_CATEGORY_LABELS,
  type SkillCategory,
  data,
  previewFor,
} from "@/lib/portfolio";

const publicDir = join(import.meta.dir, "../public");
const CATEGORIES = new Set([
  "titulacao",
  "formacao",
  "curso",
  "evento",
  "declaracao",
]);
const SKILL_CATEGORIES = new Set(
  Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[],
);

describe("portfolio.data", () => {
  test("perfil mínimo preenchido", () => {
    expect(data.profile.name.length).toBeGreaterThan(0);
    expect(data.profile.fullName.length).toBeGreaterThan(0);
    expect(data.profile.avatar.startsWith("/")).toBe(true);
    expect(existsSync(join(publicDir, data.profile.avatar))).toBe(true);
  });

  test("tem certificados e ao menos 1 featured", () => {
    expect(data.certificates.length).toBeGreaterThan(0);
    expect(data.certificates.some((c) => c.featured)).toBe(true);
  });

  test("ids de certificado únicos", () => {
    const ids = data.certificates.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("cada certificado tem descrição, categoria e arquivos", () => {
    for (const cert of data.certificates) {
      expect(cert.title.length).toBeGreaterThan(0);
      expect((cert.description ?? "").trim().length).toBeGreaterThan(0);
      expect(CATEGORIES.has(cert.category)).toBe(true);
      expect(cert.files.length).toBeGreaterThan(0);
      expect(cert.description?.includes(" / ")).toBe(false);
    }
  });

  test("arquivos e previews existem em public/", () => {
    for (const cert of data.certificates) {
      for (const file of cert.files) {
        expect(existsSync(join(publicDir, file.path))).toBe(true);
      }
      const primary = cert.files[0];
      if (primary) {
        expect(existsSync(join(publicDir, previewFor(primary.path)))).toBe(
          true,
        );
      }
    }
  });

  test("skills com categoria válida e id único", () => {
    const ids = data.profile.skills.map((s) => s.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const skill of data.profile.skills) {
      expect(skill.label.length).toBeGreaterThan(0);
      expect(skill.icon.length).toBeGreaterThan(0);
      expect(SKILL_CATEGORIES.has(skill.category)).toBe(true);
    }
  });

  test("ongoing inglês com Método ACCENT", () => {
    const ingles = data.profile.ongoing.find((o) => o.id === "ingles");
    expect(ingles?.institution).toBe("Método ACCENT");
    if (ingles?.logo) {
      expect(existsSync(join(publicDir, ingles.logo))).toBe(true);
    }
  });
});
