import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet } from '@/data/planets';

interface Props {
  planet: Planet;
}

function PlanetMesh({ planet }: { planet: Planet }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useLoader(THREE.TextureLoader, planet.image);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  // Fade in on mount / planet swap
  const [t0] = useState(() => performance.now());

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.02;
    if (groupRef.current) {
      const t = performance.now() / 1000;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
    const elapsed = (performance.now() - t0) / 600;
    const fade = Math.min(1, elapsed);
    if (matRef.current) matRef.current.opacity = fade;
    if (haloMatRef.current) haloMatRef.current.opacity = 0.18 * fade;
  });

  // Parse rgba glow color
  const haloColor = useMemo(() => {
    const m = planet.glowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return new THREE.Color('#ffffff');
    return new THREE.Color(`rgb(${m[1]},${m[2]},${m[3]})`);
  }, [planet.glowColor]);

  const isSun = planet.id === 'sun';

  return (
    <group ref={groupRef} rotation={[0.18, 0, 0.05]}>
      {/* Atmospheric halo */}
      <mesh ref={haloRef} scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color={haloColor}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          ref={matRef}
          map={texture}
          transparent
          opacity={0}
          emissive={isSun ? new THREE.Color('#ff8a1a') : new THREE.Color('#000000')}
          emissiveIntensity={isSun ? 0.6 : 0}
          emissiveMap={isSun ? texture : null}
          roughness={isSun ? 1 : 0.85}
          metalness={0}
        />
      </mesh>

      {/* Saturn rings */}
      {planet.hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
          <ringGeometry args={[1.25, 1.95, 96]} />
          <meshBasicMaterial
            color={new THREE.Color('#c9a66a')}
            side={THREE.DoubleSide}
            transparent
            opacity={0.4}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}
    </group>
  );
}

export default function CenterPlanet3D({ planet }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setScale(0.6);
      else if (w < 1024) setScale(0.8);
      else setScale(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const size = Math.round(planet.size * scale * (planet.hasRings ? 1.4 : 1.1));
  const isSun = planet.id === 'sun';

  return (
    <div
      key={planet.id}
      className="planet-enter absolute top-1/2 left-1/2 z-10"
      style={{
        width: size,
        height: size,
        maxWidth: 'min(65vw, 340px)',
        maxHeight: 'min(65vw, 340px)',
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
        filter: `drop-shadow(0 0 60px ${planet.glowColor})`,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={isSun ? 1.2 : 0.35} />
        <pointLight position={[-4, 3, 4]} intensity={isSun ? 0.4 : 1.6} color="#ffffff" />
        <pointLight position={[3, -2, 2]} intensity={0.25} color="#88aaff" />
        <Suspense fallback={null}>
          <PlanetMesh planet={planet} />
        </Suspense>
      </Canvas>
    </div>
  );
}
