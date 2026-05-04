import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const GlassSculpture = () => {
  const group = useRef<THREE.Group>(null);
  const accent = useMemo(() => new THREE.Color("#7CF7F1"), []);
  const accentTwo = useMemo(() => new THREE.Color("#B4A0FF"), []);
  const { size } = useThree();
  const isCompact = size.width < 768;

  const torusArgs = useMemo(
    () => [1.1, 0.34, isCompact ? 160 : 220, isCompact ? 24 : 32] as const,
    [isCompact],
  );
  const icosaDetail = isCompact ? 0 : 1;
  const dodecaDetail = isCompact ? 0 : 1;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.25) * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.9} floatIntensity={1.4}>
        <mesh position={[0, 0.2, 0]}>
          <torusKnotGeometry args={torusArgs} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={1.2}
            roughness={0.1}
            chromaticAberration={0.08}
            anisotropy={0.1}
            distortion={0.25}
            distortionScale={0.35}
            ior={1.4}
            color={accent}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.1}>
        <mesh position={[2.3, 1.2, -1]} scale={0.6}>
          <icosahedronGeometry args={[1, icosaDetail]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.9}
            roughness={0.15}
            chromaticAberration={0.05}
            distortion={0.2}
            distortionScale={0.3}
            ior={1.45}
            color={accentTwo}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.2}>
        <mesh position={[-2.2, -1.2, -0.6]} scale={0.7}>
          <dodecahedronGeometry args={[1, dodecaDetail]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={1}
            roughness={0.08}
            chromaticAberration={0.06}
            distortion={0.2}
            distortionScale={0.4}
            ior={1.35}
            color={accent}
          />
        </mesh>
      </Float>
    </group>
  );
};

const PortfolioScene = () => {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    const updateDpr = () => {
      if (typeof window === "undefined") return;
      setDpr(window.innerWidth < 768 ? [1, 1.5] : [1, 2]);
    };

    updateDpr();
    window.addEventListener("resize", updateDpr);
    return () => window.removeEventListener("resize", updateDpr);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 2]} intensity={1.2} />
      <directionalLight position={[-4, -2, -2]} intensity={0.6} color="#7c9dff" />
      <GlassSculpture />
      <Environment preset="sunset" />
    </Canvas>
  );
};

export default PortfolioScene;
