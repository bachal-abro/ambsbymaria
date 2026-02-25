'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Float,
  Sparkles,
  useDetectGPU
} from '@react-three/drei'
import * as THREE from 'three'

// Shared materials — polished gold
const chainMaterial = new THREE.MeshStandardMaterial({
  color: '#D4AF37',
  metalness: 0.95,
  roughness: 0.25,
  envMapIntensity: 1.2,
})

const ballMaterial = new THREE.MeshStandardMaterial({
  color: '#B8941F',
  metalness: 0.95,
  roughness: 0.2,
  envMapIntensity: 1.2,
})

const LINK_COUNT = 20
const NECKLACE_RADIUS = 2.2

function ChainLinkNecklace() {
  const necklaceRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (necklaceRef.current) {
      necklaceRef.current.rotation.y += delta * 0.12
      necklaceRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.03
    }
  })

  const { links, balls } = useMemo(() => {
    const linkData: Array<{
      x: number; y: number; z: number
      angle: number; isVertical: boolean
    }> = []
    const ballData: Array<{ x: number; y: number; z: number }> = []

    for (let i = 0; i < LINK_COUNT; i++) {
      const angle = (i / LINK_COUNT) * Math.PI * 2
      const x = Math.cos(angle) * NECKLACE_RADIUS
      const z = Math.sin(angle) * NECKLACE_RADIUS
      const isVertical = i % 2 === 0

      linkData.push({ x, y: 0, z, angle, isVertical })

      // Ball joint halfway to the next link
      const midAngle = ((i + 0.5) / LINK_COUNT) * Math.PI * 2
      ballData.push({
        x: Math.cos(midAngle) * NECKLACE_RADIUS,
        y: 0,
        z: Math.sin(midAngle) * NECKLACE_RADIUS,
      })
    }

    return { links: linkData, balls: ballData }
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={necklaceRef} rotation={[0.35, 0, 0.08]}>
        {/* Chain Links — elongated torus, alternating orientation */}
        {links.map((link, i) => (
          <group
            key={`link-${i}`}
            position={[link.x, link.y, link.z]}
            rotation={[0, -link.angle + Math.PI / 2, 0]}
          >
            <mesh
              rotation={link.isVertical ? [0, 0, 0] : [Math.PI / 2, 0, 0]}
              scale={[1.9, 1, 1]}
            >
              <torusGeometry args={[0.17, 0.038, 12, 28]} />
              <primitive object={chainMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Ball Joints at connection points */}
        {balls.map((ball, i) => (
          <mesh key={`ball-${i}`} position={[ball.x, ball.y, ball.z]}>
            <sphereGeometry args={[0.075, 14, 14]} />
            <primitive object={ballMaterial} attach="material" />
          </mesh>
        ))}

        {/* Subtle sparkles around the necklace */}
        <Sparkles
          count={20}
          scale={[6, 3, 6]}
          size={1.2}
          speed={0.3}
          opacity={0.5}
          color="#FFE87C"
        />
      </group>
    </Float>
  )
}

function CinematicLighting() {
  return (
    <>
      {/* Key Light */}
      <spotLight
        position={[5, 8, 5]}
        angle={0.35}
        penumbra={0.6}
        intensity={30}
        color="#ffffff"
      />

      {/* Fill Light — warm gold tint */}
      <spotLight
        position={[-5, 4, -2]}
        angle={0.5}
        penumbra={1}
        intensity={15}
        color="#FFE8A0"
      />

      {/* Rim Light — subtle back edge */}
      <spotLight
        position={[0, 2, -5]}
        angle={0.5}
        penumbra={1}
        intensity={12}
        color="#FFF5D0"
      />

      <ambientLight intensity={0.6} />

      <hemisphereLight
        color="#fff8f0"
        groundColor="#f5ede0"
        intensity={0.5}
      />
    </>
  )
}

function Scene() {
  const GPUTier = useDetectGPU()

  const isMobile = GPUTier?.isMobile || false
  const isLowEnd = GPUTier?.tier === 0 || GPUTier?.tier === 1

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6.5]} fov={45} />

      <CinematicLighting />

      <Environment
        preset="studio"
        background={false}
        blur={0.6}
        resolution={128}
      />

      {/* Main 3D Model — Chain Link Necklace */}
      <ChainLinkNecklace />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.2}
        scale={10}
        blur={2.5}
        far={4}
        resolution={256}
        color="#888888"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.3}
        rotateSpeed={0.4}
      />
    </>
  )
}

export default function Hero3DScene() {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      frameloop="demand"
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
