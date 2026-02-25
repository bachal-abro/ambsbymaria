'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  useGLTF,
  Stage,
  Float
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import type { Material } from '@/types'

interface JewelryModelProps {
  material: Material
  modelPath?: string
}

function Ring({ material }: JewelryModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusGeometry args={[1, 0.3, 32, 100]} />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metallic}
          roughness={material.roughness}
          envMapIntensity={1.5}
        />
        {/* Diamond */}
        <mesh position={[0, 1, 0]} castShadow>
          <octahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.5}
            envMapIntensity={3}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={2.4}
          />
        </mesh>
      </mesh>
    </Float>
  )
}

function Necklace({ material }: JewelryModelProps) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Chain */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const radius = 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <mesh
              key={i}
              position={[x, Math.sin(angle * 3) * 0.2, z]}
              castShadow
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={material.color}
                metalness={material.metallic}
                roughness={material.roughness}
                envMapIntensity={1.5}
              />
            </mesh>
          )
        })}
        {/* Pendant */}
        <mesh position={[0, -1.5, 2]} castShadow>
          <octahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.5}
            envMapIntensity={3}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={2.4}
          />
        </mesh>
      </group>
    </Float>
  )
}

function Bracelet({ material }: JewelryModelProps) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={meshRef} rotation={[Math.PI / 6, 0, 0]}>
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2
          const radius = 1.5
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const isDiamond = i % 3 === 0
          return (
            <mesh
              key={i}
              position={[x, 0, z]}
              rotation={[0, angle, 0]}
              castShadow
            >
              {isDiamond ? (
                <>
                  <octahedronGeometry args={[0.15, 0]} />
                  <meshPhysicalMaterial
                    color="#ffffff"
                    metalness={0}
                    roughness={0}
                    transmission={0.9}
                    thickness={0.3}
                    envMapIntensity={3}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={2.4}
                  />
                </>
              ) : (
                <>
                  <boxGeometry args={[0.2, 0.1, 0.1]} />
                  <meshStandardMaterial
                    color={material.color}
                    metalness={material.metallic}
                    roughness={material.roughness}
                    envMapIntensity={1.5}
                  />
                </>
              )}
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function Earrings({ material }: JewelryModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  const Earring = ({ position }: { position: [number, number, number] }) => (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={position}>
        {/* Hook */}
        <mesh castShadow>
          <torusGeometry args={[0.15, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color={material.color}
            metalness={material.metallic}
            roughness={material.roughness}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Drop */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <octahedronGeometry args={[0.3, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.4}
            envMapIntensity={3}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={2.4}
          />
        </mesh>
      </group>
    </Float>
  )

  return (
    <group ref={groupRef}>
      <Earring position={[-0.8, 0, 0]} />
      <Earring position={[0.8, 0, 0]} />
    </group>
  )
}

interface Product3DViewerProps {
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  material: Material
  modelPath?: string
  autoRotate?: boolean
  className?: string
}

export default function Product3DViewer({
  category,
  material,
  modelPath,
  autoRotate = true,
  className = '',
}: Product3DViewerProps) {
  const [loading, setLoading] = useState(true)

  const JewelryComponent = {
    rings: Ring,
    necklaces: Necklace,
    bracelets: Bracelet,
    earrings: Earrings,
  }[category]

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center bg-white z-10"
        >
          <div className="loading-spinner w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full" />
        </motion.div>
      )}
      
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={() => setLoading(false)}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={0.3} color="#D4899E" />

          {/* Environment */}
          <Environment
            preset="studio"
            background={false}
            blur={0.8}
          />

          {/* Model */}
          <JewelryComponent material={material} modelPath={modelPath} />

          {/* Shadows */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
