import { createRoot } from "react-dom/client";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

const mount = document.querySelector("#sunlife-shader");

if (mount) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pixelDensity = Math.min(window.devicePixelRatio || 1, 2);

  createRoot(mount).render(
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={pixelDensity}
      fov={45}
      pointerEvents="none"
      lazyLoad
    >
      <ShaderGradient
        type="waterPlane"
        animate={reduceMotion ? "off" : "on"}
        brightness={1.2}
        cAzimuthAngle={180}
        cDistance={2.4}
        cPolarAngle={95}
        cameraZoom={1}
        color1="#FBCC53"
        color2="#FA7616"
        color3="#FBE09C"
        envPreset="city"
        grain="off"
        lightType="3d"
        positionX={0}
        positionY={-2.1}
        positionZ={0}
        reflection={0.1}
        rotationX={0}
        rotationY={0}
        rotationZ={225}
        shader="defaults"
        uAmplitude={0}
        uDensity={1.8}
        uFrequency={5.5}
        uSpeed={0.18}
        uStrength={3}
        uTime={0.2}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}
