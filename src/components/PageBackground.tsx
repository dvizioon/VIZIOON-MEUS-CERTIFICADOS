"use client";

import GradientASCII from "@/components/GradientASCII";

export function PageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-[#f1f5f9]"
      aria-hidden
    >
      <GradientASCII
        colors={["#ffffff", "#3b82f6"]}
        shape="horizon"
        characters=" =+xX0S8#@"
        cellSize={17}
        density={0.7}
        glyphOpacity={0.58}
        glow={0.16}
        depthOfField={0.08}
        flicker={0.1}
        softness={0.6}
        scale={1}
        flow={0.45}
        speed={0.7}
        gradientOpacity={0.68}
        grain={0.05}
        variation={0}
        mouseInteraction
        scrambleRadius={0.09}
        clickEffect="wave"
        intro
        lightMode={false}
      />
    </div>
  );
}
