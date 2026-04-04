"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

// Floating Energy Orbs
function EnergyOrb({ position, color, size = 0.3, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Glowing Ring
function GlowingRing({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.6} />
    </mesh>
  );
}

// Floating Particles Grid
function ParticleField() {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 5;
      temp.push({ x, y, z, speed: 0.5 + Math.random() });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.x + Math.sin(t) * 0.5,
        particle.y + Math.cos(t * 0.5) * 0.3,
        particle.z
      );
      dummy.scale.setScalar(0.02 + Math.sin(t) * 0.01);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Energy Wave
function EnergyWave({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} rotation={[0, 0, 0]}>
      <circleGeometry args={[8, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Ambient and point lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f97316" />
      
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Energy orbs floating around */}
      <EnergyOrb position={[-4, 2, -2]} color="#8b5cf6" size={0.4} speed={0.8} />
      <EnergyOrb position={[4, -1, -3]} color="#f97316" size={0.3} speed={1.2} />
      <EnergyOrb position={[-2, -2, -1]} color="#06b6d4" size={0.25} speed={1} />
      <EnergyOrb position={[3, 3, -4]} color="#ec4899" size={0.35} speed={0.6} />
      <EnergyOrb position={[0, 4, -2]} color="#eab308" size={0.2} speed={1.5} />
      
      {/* Glowing rings */}
      <GlowingRing position={[-5, 0, -5]} color="#8b5cf6" scale={2} />
      <GlowingRing position={[5, 2, -6]} color="#f97316" scale={1.5} />
      <GlowingRing position={[0, -3, -4]} color="#06b6d4" scale={1.8} />
      
      {/* Energy wave */}
      <EnergyWave color="#8b5cf6" />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Central sparkle effect */}
      <Sparkles
        count={100}
        scale={[10, 10, 5]}
        size={3}
        speed={0.5}
        color="#a855f7"
        opacity={0.5}
      />
    </>
  );
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/20 rounded-full blur-[128px] animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[128px] animate-pulse-slow animation-delay-4000" />
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(139,92,246,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan pointer-events-none opacity-30" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
