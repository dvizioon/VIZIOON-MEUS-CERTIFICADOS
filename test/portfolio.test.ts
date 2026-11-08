import { describe, expect, test } from "bun:test";
import {
  CATEGORY_LABELS,
  downloadName,
  featuredCertificates,
  groupByInstitution,
  previewFor,
  primaryFile,
  sortedCertificates,
  data,
} from "@/lib/portfolio";

describe("previewFor", () => {
  test("troca extensão do arquivo por preview png", () => {
    expect(previewFor("/certificates/foo.pdf")).toBe(
      "/certificates/previews/foo.png",
    );
    expect(previewFor("/certificates/bar.PNG")).toBe(
      "/certificates/previews/bar.png",
    );
  });

  test("aceita só o nome do arquivo", () => {
    expect(previewFor("baz.webp")).toBe("/certificates/previews/baz.png");
  });
});

describe("downloadName", () => {
  test("pega o nome no fim do path", () => {
    expect(downloadName("/certificates/x.pdf")).toBe("x.pdf");
  });

  test("fallback se path vazio", () => {
    expect(downloadName("")).toBe("certificado.pdf");
  });
});

describe("primaryFile", () => {
  test("retorna o primeiro arquivo", () => {
    const cert = data.certificates.find((c) => c.files.length > 0);
    expect(cert).toBeDefined();
    expect(primaryFile(cert!)).toEqual(cert!.files[0]);
  });
});

describe("featuredCertificates", () => {
  test("só featured e ordenado por priority", () => {
    const list = featuredCertificates();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((c) => c.featured)).toBe(true);
    for (let i = 1; i < list.length; i++) {
      expect(list[i]!.priority).toBeGreaterThanOrEqual(list[i - 1]!.priority);
    }
  });
});

describe("sortedCertificates", () => {
  test("não muta o array original e ordena por priority", () => {
    const before = data.certificates.map((c) => c.id);
    const sorted = sortedCertificates();
    expect(data.certificates.map((c) => c.id)).toEqual(before);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]!.priority).toBeGreaterThanOrEqual(
        sorted[i - 1]!.priority,
      );
    }
  });
});

describe("groupByInstitution", () => {
  test("agrupa e ordena instituições", () => {
    const groups = groupByInstitution(data.certificates);
    expect(groups.length).toBeGreaterThan(0);
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    expect(total).toBe(data.certificates.length);
    for (let i = 1; i < groups.length; i++) {
      expect(groups[i]!.institution.order).toBeGreaterThanOrEqual(
        groups[i - 1]!.institution.order,
      );
    }
  });
});

describe("CATEGORY_LABELS", () => {
  test("tem todos os filtros", () => {
    for (const key of [
      "todos",
      "titulacao",
      "formacao",
      "curso",
      "evento",
      "declaracao",
    ] as const) {
      expect(CATEGORY_LABELS[key].length).toBeGreaterThan(0);
    }
  });
});
