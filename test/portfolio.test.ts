import { describe, expect, test } from "bun:test";
import {
  CATEGORY_LABELS,
  browseShelf,
  downloadName,
  featuredCertificates,
  groupByInstitution,
  previewFor,
  primaryFile,
  SHELF_LABELS,
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

describe("browseShelf", () => {
  test("particiona todos os certificados nas 3 abas", () => {
    const counts = { academica: 0, tecnica: 0, curta: 0 };
    for (const cert of data.certificates) {
      counts[browseShelf(cert)] += 1;
    }
    expect(counts.academica).toBeGreaterThan(0);
    expect(counts.tecnica).toBeGreaterThan(0);
    expect(counts.curta).toBeGreaterThan(0);
    expect(counts.academica + counts.tecnica + counts.curta).toBe(
      data.certificates.length,
    );
  });

  test("rótulos das abas existem", () => {
    for (const key of ["todos", "academica", "tecnica", "curta"] as const) {
      expect(SHELF_LABELS[key].length).toBeGreaterThan(0);
    }
  });
});
