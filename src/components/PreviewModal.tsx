"use client";

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

function FaceImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full bg-slate-100">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-2"
        sizes="(max-width: 768px) 90vw, 560px"
        priority={priority}
      />
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
  const front = cert ? frontFile(cert) : null;
  const back = cert ? backFile(cert) : null;
  const canFlip = !!front && !!back;
  const active = !front
    ? null
    : canFlip
      ? flipped
        ? back
        : front
      : front;
  const open = !!cert && !!front;

  useEffect(() => {
    setFlipped(false);
  }, [cert?.id]);

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
          {cert && front ? (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[min(92vh,960px)] flex-col"
            >
              <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-900/5 px-4 pt-10 pb-3 sm:px-6">
                {canFlip && back ? (
                  <>
                    <FlipCard
                      flipped={flipped}
                      onFlipChange={setFlipped}
                      axis="y"
                      flipOnClick
                      draggable
                      tilt={false}
                      glare={false}
                      hoverScale={1}
                      shadow={false}
                      width={560}
                      height={420}
                      radius={16}
                      background="#f8fafc"
                      ariaLabel={`Virar certificado ${cert.title}`}
                      className="mx-auto max-w-full"
                      front={
                        <FaceImage
                          src={previewFor(front.path)}
                          alt={`Frente de ${cert.title}`}
                          priority
                        />
                      }
                      back={
                        <FaceImage
                          src={previewFor(back.path)}
                          alt={`Verso de ${cert.title}`}
                        />
                      }
                    />
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Badge variant={flipped ? "outline" : "default"}>
                        Frente
                      </Badge>
                      <Badge variant={flipped ? "default" : "outline"}>
                        Verso
                      </Badge>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setFlipped((v) => !v)}
                      >
                        Virar carta
                      </Button>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Toque ou arraste a carta pra ver a outra face.
                    </p>
                  </>
                ) : (
                  <Image
                    src={previewFor(front.path)}
                    alt={`Preview de ${cert.title}`}
                    width={1400}
                    height={990}
                    className="mx-auto h-auto max-h-[min(62vh,620px)] w-full object-contain drop-shadow-lg"
                    priority
                  />
                )}
              </div>

              <div className="shrink-0 border-t border-white/40 bg-white/55 px-4 py-4 backdrop-blur-xl sm:px-6">
                <div className="mb-2.5 flex flex-wrap gap-2">
                  <Badge>{CATEGORY_LABELS[cert.category]}</Badge>
                  <Badge variant="outline">{cert.institution}</Badge>
                  {cert.hours != null ? (
                    <Badge variant="outline">{cert.hours}h</Badge>
                  ) : null}
                  {canFlip ? (
                    <Badge variant="secondary">
                      {flipped ? "Verso" : "Frente"}
                    </Badge>
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
                        Abrir {canFlip ? (flipped ? "verso" : "frente") : "PDF"}
                      </a>
                      <a
                        className={buttonVariants({ variant: "outline" })}
                        href={active.path}
                        download={downloadName(active.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Baixar {canFlip ? (flipped ? "verso" : "frente") : ""}
                      </a>
                    </>
                  ) : null}
                  {canFlip && front && back ? (
                    <a
                      className={buttonVariants({ variant: "ghost" })}
                      href={flipped ? front.path : back.path}
                      download={downloadName(flipped ? front.path : back.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Baixar {flipped ? "frente" : "verso"}
                    </a>
                  ) : null}
                  {cert.files
                    .filter(
                      (f) =>
                        f.path !== front?.path &&
                        f.path !== back?.path,
                    )
                    .map((extra) => (
                      <a
                        key={extra.path}
                        className={buttonVariants({ variant: "ghost" })}
                        href={extra.path}
                        download={downloadName(extra.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {extra.label}
                      </a>
                    ))}
                  {cert.verifyUrl ? (
                    <a
                      className={buttonVariants({ variant: "link" })}
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
