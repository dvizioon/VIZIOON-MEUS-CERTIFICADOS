"use client";

import { ScanIcon, ZoomInIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import FlipCard from "@/components/FlipCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  CATEGORY_LABELS,
  type Certificate,
  backFile,
  downloadName,
  frontFile,
  previewFor,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.35;

function FaceImage({
  src,
  alt,
  zoom,
  priority,
}: {
  src: string;
  alt: string;
  zoom: number;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-auto bg-slate-100">
      <div
        className="flex min-h-full min-w-full items-center justify-center transition-transform duration-200"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <div className="relative h-[420px] w-[560px] max-w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 90vw, 640px"
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
}

function ZoomControls({
  zoom,
  onZoomIn,
  onReset,
}: {
  zoom: number;
  onZoomIn: () => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute top-3 left-3 z-20 flex gap-1.5">
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        className="border border-border bg-white/90 shadow-sm"
        aria-label="Aproximar"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ZoomInIcon />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        className="border border-border bg-white/90 shadow-sm"
        aria-label="Tamanho normal"
        disabled={zoom <= ZOOM_MIN}
        onClick={(e) => {
          e.stopPropagation();
          onReset();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ScanIcon />
      </Button>
    </div>
  );
}

export function PreviewModal({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const files = cert?.files ?? [];
  const front = cert ? frontFile(cert) : null;
  const back = cert ? backFile(cert) : null;
  const canFlip = !!front && !!back && files.length === 2;
  const pageFile = files[Math.min(page, Math.max(files.length - 1, 0))] ?? null;
  const active = canFlip ? (flipped ? back : front) : pageFile;
  const open = !!cert && files.length > 0;
  const zoomed = zoom > ZOOM_MIN;

  useEffect(() => {
    setFlipped(false);
    setPage(0);
    setZoom(ZOOM_MIN);
  }, [cert?.id]);

  useEffect(() => {
    setZoom(ZOOM_MIN);
  }, [flipped, page]);

  const zoomIn = () =>
    setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))));
  const resetZoom = () => setZoom(ZOOM_MIN);

  return (
    <Dialog
      open={open}
      modal="trap-focus"
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        aria-describedby={undefined}
        className={cn(
          "gap-0 overflow-hidden border-white/40 bg-white/70 p-0 shadow-2xl",
          "ring-1 ring-white/50 backdrop-blur-2xl sm:max-w-4xl",
          "max-h-[min(92vh,960px)]",
        )}
      >
        <AnimatePresence mode="wait">
          {cert && files.length > 0 ? (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[min(92vh,960px)] flex-col"
            >
              <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-900/5 px-4 pt-10 pb-3 sm:px-6">
                {canFlip && front && back ? (
                  <>
                    <div className="relative mx-auto w-full max-w-[640px]">
                      <ZoomControls
                        zoom={zoom}
                        onZoomIn={zoomIn}
                        onReset={resetZoom}
                      />
                      <FlipCard
                        flipped={flipped}
                        onFlipChange={setFlipped}
                        axis="y"
                        flipOnClick={!zoomed}
                        draggable={!zoomed}
                        tilt={false}
                        glare={false}
                        hoverScale={1}
                        shadow={false}
                        width={640}
                        height={480}
                        radius={16}
                        background="#f8fafc"
                        ariaLabel={`Virar certificado ${cert.title}`}
                        className="mx-auto max-w-full"
                        front={
                          <FaceImage
                            src={previewFor(front.path)}
                            alt={`Frente de ${cert.title}`}
                            zoom={zoom}
                            priority
                          />
                        }
                        back={
                          <FaceImage
                            src={previewFor(back.path)}
                            alt={`Verso de ${cert.title}`}
                            zoom={zoom}
                          />
                        }
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFlipped(false)}
                        className="border-0 bg-transparent p-0"
                      >
                        <Badge variant={flipped ? "outline" : "default"}>
                          Frente
                        </Badge>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipped(true)}
                        className="border-0 bg-transparent p-0"
                      >
                        <Badge variant={flipped ? "default" : "outline"}>
                          Verso
                        </Badge>
                      </button>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Toque ou arraste pra virar. Use a lupa pra aproximar.
                    </p>
                  </>
                ) : pageFile ? (
                  <>
                    <div className="relative mx-auto w-full max-w-[720px]">
                      <ZoomControls
                        zoom={zoom}
                        onZoomIn={zoomIn}
                        onReset={resetZoom}
                      />
                      <div className="overflow-auto rounded-2xl border border-border bg-slate-100">
                        <div
                          className="flex justify-center transition-transform duration-200"
                          style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: "center top",
                          }}
                        >
                          <Image
                            key={pageFile.path}
                            src={previewFor(pageFile.path)}
                            alt={`${pageFile.label} - ${cert.title}`}
                            width={1400}
                            height={1680}
                            className="h-auto max-h-[min(62vh,620px)] w-full object-contain"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                    {files.length > 1 ? (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {files.map((file, i) => (
                          <button
                            key={file.path}
                            type="button"
                            onClick={() => setPage(i)}
                            className="border-0 bg-transparent p-0"
                          >
                            <Badge variant={page === i ? "default" : "outline"}>
                              {file.label}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <p className="text-center text-sm text-muted-foreground">
                      Use a lupa pra aproximar.
                    </p>
                  </>
                ) : null}
              </div>

              <div className="shrink-0 border-t border-white/40 bg-white/55 px-4 py-4 backdrop-blur-xl sm:px-6">
                <div className="mb-2.5 flex flex-wrap gap-2">
                  <Badge>{CATEGORY_LABELS[cert.category]}</Badge>
                  <Badge variant="outline">{cert.institution}</Badge>
                  {cert.hours != null ? (
                    <Badge variant="outline">{cert.hours}h</Badge>
                  ) : null}
                  {active ? (
                    <Badge variant="secondary">{active.label}</Badge>
                  ) : null}
                </div>

                <DialogTitle className="mb-1 text-lg font-semibold tracking-tight text-blue-950 sm:text-xl">
                  {cert.title}
                </DialogTitle>

                {cert.description ? (
                  <p className="mb-3 line-clamp-3 text-base text-slate-600">
                    {cert.description}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {active ? (
                    <>
                      <a
                        className={buttonVariants({ variant: "default" })}
                        href={active.path}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir {active.label}
                      </a>
                      <a
                        className={buttonVariants({ variant: "outline" })}
                        href={active.path}
                        download={downloadName(active.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Baixar {active.label}
                      </a>
                    </>
                  ) : null}
                  {files
                    .filter((f) => f.path !== active?.path)
                    .map((extra) => (
                      <a
                        key={extra.path}
                        className={buttonVariants({ variant: "ghost" })}
                        href={extra.path}
                        download={downloadName(extra.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Baixar {extra.label}
                      </a>
                    ))}
                  {cert.verifyUrl ? (
                    <a
                      className={buttonVariants({ variant: "secondary" })}
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verificar autenticidade
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
