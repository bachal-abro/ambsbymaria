'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  SpotLight,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  useDetectGPU
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Memoized materials for reuse
const goldMaterial = new THREE.MeshStandardMaterial({
  color: '#D4AF37',
  metalness: 1,
  roughness: 0.15,
  envMapIntensity: 2,
})

const goldAccentMaterial = new THREE.MeshStandardMaterial({
  color: '#B8941F',
  metalness: 1,
  roughness: 0.1,
  envMapIntensity: 1.5,
})

function DiamondRing() {
  const ringRef = useRef<THREE.Group>(null)
  const diamondRef = useRef<THREE.Mesh>(null)

  // Optimized animation loop - runs only when needed
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    
    if (diamondRef.current) {
      diamondRef.current.rotation.y += delta * 0.5
    }
  })

  // Memoize prongs to prevent recreation
  const prongs = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const angle = (i / 4) * Math.PI * 2
      const x = Math.cos(angle) * 0.8
      const z = Math.sin(angle) * 0.8
      return (
        <mesh key={i} position={[x, 0.3, z]}>
          <cylinderGeometry args={[0.03, 0.04, 0.4, 6]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={1}
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
      )
    })
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={ringRef}>
        {/* Ring Band - Reduced segments */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.15, 16, 32]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>

        {/* Ring Inner Details - Reduced segments */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.05, 0.02, 12, 24]} />
          <primitive object={goldAccentMaterial} attach="material" />
        </mesh>

        {/* Prongs */}
        {prongs}

        {/* Diamond - Optimized transmission settings */}
        <mesh 
          ref={diamondRef}
          position={[0, 0.8, 0]} 
          scale={[0.6, 0.8, 0.6]}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={256}
            transmission={0.95}
            roughness={0}
            thickness={0.5}
            ior={2.4}
            chromaticAberration={0.04}
            anisotropy={0.2}
            distortion={0}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            color="#ffffff"
          />
        </mesh>

        {/* Diamond Facets Highlights */}
        <mesh position={[0, 0.8, 0]} scale={[0.65, 0.85, 0.65]}>
          <octahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>

        {/* Reduced sparkles */}
        <Sparkles
          count={15}
          scale={[3, 3, 3]}
          size={1.5}
          speed={0.3}
          opacity={0.5}
          color="#D4AF37"
        />
      </group>
    </Float>
  )
}

function CinematicLighting() {
  return (
    <>
      {/* Key Light - Reduced shadow quality */}
      <SpotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={150}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={1024}
        color="#ffffff"
      />

      {/* Fill Light - No shadows */}
      <SpotLight
        position={[-5, 5, -3]}
        angle={0.4}
        penumbra={1}
        intensity={80}
        color="#E5C158"
      />

      {/* Rim Light */}
      <spotLight
        position={[0, 2, -5]}
        angle={0.5}
        penumbra={1}
        intensity={100}
        color="#D4AF37"
      />

      {/* Simplified lighting - removed extra point lights */}
      <ambientLight intensity={0.4} />

      <hemisphereLight
        color="#ffffff"
        groundColor="#1A1A1A"
        intensity={0.5}
      />
    </>
  )
}

function Scene() {
  const GPUTier = useDetectGPU()
  
  // Adaptive quality based on GPU
  const isMobile = GPUTier?.isMobile || false
  const isLowEnd = GPUTier?.tier === 0 || GPUTier?.tier === 1

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={45} />

      {/* Cinematic Lighting Setup */}
      <CinematicLighting />

      {/* Optimized Environment */}
      <Environment
        preset="studio"
        background={false}
        blur={0.6}
        resolution={128}
      />

      {/* Main 3D Model */}
      <DiamondRing />

      {/* Optimized Ground Shadows */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
        resolution={256}
        color="#D4AF37"
      />

      {/* Conditional Post-processing - disabled on low-end devices */}
      {!isLowEnd && !isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.7}
            mipmapBlur
          />
        </EffectComposer>
      )}

      {/* Optimized Controls */}
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
