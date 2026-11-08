"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  CATEGORY_LABELS,
  type Certificate,
  downloadName,
  previewFor,
  primaryFile,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function PreviewModal({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  const file = cert ? primaryFile(cert) : null;
  const preview = file ? previewFor(file.path) : null;
  const open = !!cert && !!file && !!preview;

  return (
    <Dialog
      open={open}
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
          "max-h-[min(90vh,900px)]",
        )}
      >
        <AnimatePresence mode="wait">
          {cert && file && preview ? (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[min(90vh,900px)] flex-col"
            >
              <div className="relative min-h-0 flex-1 bg-slate-900/5 px-4 pt-10 pb-3 sm:px-6">
                <Image
                  src={preview}
                  alt={`Preview de ${cert.title}`}
                  width={1400}
                  height={990}
                  className="mx-auto h-auto max-h-[min(58vh,560px)] w-full object-contain drop-shadow-lg"
                  priority
                />
              </div>

              <div className="shrink-0 border-t border-white/40 bg-white/55 px-4 py-4 backdrop-blur-xl sm:px-6">
                <div className="mb-2.5 flex flex-wrap gap-2">
                  <Badge>{CATEGORY_LABELS[cert.category]}</Badge>
                  <Badge variant="outline">{cert.institution}</Badge>
                  {cert.hours != null ? (
                    <Badge variant="outline">{cert.hours}h</Badge>
                  ) : null}
                </div>

                <DialogTitle className="mb-1 text-lg font-semibold tracking-tight text-blue-950 sm:text-xl">
                  {cert.title}
                </DialogTitle>

                {cert.description ? (
                  <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                    {cert.description}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <a
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "rounded-full",
                    )}
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir PDF
                  </a>
                  <a
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full",
                    )}
                    href={file.path}
                    download={downloadName(file.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Baixar
                  </a>
                  {cert.files.slice(1).map((extra) => (
                    <a
                      key={extra.path}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "rounded-full",
                      )}
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
                      className={cn(buttonVariants({ variant: "link" }))}
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
