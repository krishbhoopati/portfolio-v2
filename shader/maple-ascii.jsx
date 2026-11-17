import { createRoot } from "react-dom/client";
import GradientASCII from "./GradientASCII.jsx";

const mounts = new Set([
  ...document.querySelectorAll("[data-maple-ascii]"),
  ...document.querySelectorAll("#maple-ascii"),
]);

mounts.forEach((mount) => {
  const cellSize = Number(mount.dataset.cellSize) || 27;
  createRoot(mount).render(
    <GradientASCII
      colors={["#0d4da7", "#f32836", "#e10613", "#c8102e"]}
      shape="horizon"
      characters=" .·•●"
      cellSize={cellSize}
      density={0.8}
      glyphOpacity={0.85}
      glow={1.05}
      depthOfField={0.52}
      flicker={0.6}
      softness={0.91}
      scale={0.95}
      flow={0.85}
      speed={1.25}
      gradientOpacity={0.9}
      grain={0.05}
      variation={13}
      mouseInteraction
      scrambleRadius={0.27}
      clickEffect="burst"
      intro
      lightMode={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
});
