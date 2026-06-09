"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import { useRef, Suspense } from "react"
import type { Mesh, Group } from "three"

function Knot() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15
      ref.current.rotation.y += delta * 0.2
    }
  })
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={ref} scale={1.5}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0e7490"
          emissiveIntensity={0.45}
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const ref = useRef<Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })
  const dots = Array.from({ length: 60 }, (_, i) => {
    const r = 4 + (i % 5)
    const a = (i / 60) * Math.PI * 2
    return [Math.cos(a) * r, ((i % 9) - 4) * 0.6, Math.sin(a) * r] as const
  })
  return (
    <group ref={ref}>
      {dots.map((p, i) => (
        <mesh key={i} position={p as unknown as [number, number, number]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#67e8f9" />
        </mesh>
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} color="#a5f3fc" />
        <pointLight position={[-5, -3, -2]} intensity={2} color="#06b6d4" />
        <Knot />
        <Particles />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
