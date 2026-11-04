import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const points = useRef();
  const positions = React.useMemo(() => {
    const data = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i++) {
      const radius = 5 + Math.random() * 13;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);
  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.018;
    points.current.rotation.x = THREE.MathUtils.damp(points.current.rotation.x, state.pointer.y * 0.05, 2, delta);
  });
  return <Points ref={points} positions={positions} stride={3} frustumCulled>
    <PointMaterial transparent color="#a9dff0" size={0.032} sizeAttenuation depthWrite={false} opacity={0.78} />
  </Points>;
}
function CoreObject() {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.x += delta * 0.08;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, state.pointer.x * 0.12, 2, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, 2.8 + state.pointer.x * 0.28, 2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, state.pointer.y * 0.18, 2, delta);
  });
  return <group ref={group} position={[2.8, 0.1, -1.5]}>
    <mesh><icosahedronGeometry args={[1.35, 2]} /><meshStandardMaterial color="#3b8f9b" metalness={0.72} roughness={0.22} wireframe /></mesh>
    <mesh scale={0.72}><icosahedronGeometry args={[1.35, 3]} /><meshPhysicalMaterial color="#9b79ed" metalness={0.45} roughness={0.18} transmission={0.18} thickness={0.4} transparent opacity={0.8} /></mesh>
    <mesh rotation={[0.5, 0.25, 0.2]}><torusGeometry args={[1.9, 0.018, 8, 180]} /><meshBasicMaterial color="#8ff3dc" transparent opacity={0.88} /></mesh>
    <mesh rotation={[1.1, 0.4, 0.7]}><torusGeometry args={[2.25, 0.012, 8, 180]} /><meshBasicMaterial color="#f0a7cb" transparent opacity={0.68} /></mesh>
    <pointLight color="#9b79ed" intensity={17} distance={7} /><pointLight position={[2, -1, 1]} color="#75f0d5" intensity={11} distance={6} />
  </group>;
}
export default function TalentScene() {
  return <Canvas camera={{ position: [0, 0, 9], fov: 48 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={0.82} /><ParticleField /><CoreObject />
  </Canvas>;
}
