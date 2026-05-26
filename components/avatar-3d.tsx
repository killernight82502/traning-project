"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, ContactShadows, Stars } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import React from 'react';

type HunterClass = "shadow" | "knight" | "berserker" | "monarch" | "celestial" | "voidwalker";

interface Avatar3DProps {
  url: string;
  level: number;
  jobClass?: HunterClass;
  isPremium?: boolean;
  gender?: "male" | "female";
}

// Free 3D Character Models (GLB format)
export const CHARACTER_MODELS = {
  male: [
    { 
      id: "male-athletic", 
      name: "Athletic Male", 
      description: "Sporty athletic character",
      url: "https://models.bastion.club/Mannequin.glb",
      thumbnail: "🏃"
    },
    { 
      id: "male-casual", 
      name: "Casual Guy", 
      description: "Everyday casual outfit",
      url: "https://threejs.org/examples/models/gltf/Soldier.glb",
      thumbnail: "👨"
    },
    { 
      id: "male-warrior", 
      name: "Warrior", 
      description: "Battle-ready fighter",
      url: "",
      thumbnail: "⚔️"
    },
  ],
  female: [
    { 
      id: "female-athletic", 
      name: "Athletic Female", 
      description: "Sporty athletic character",
      url: "https://models.bastion.club/Woman.glb",
      thumbnail: "🏃‍♀️"
    },
    { 
      id: "female-casual", 
      name: "Casual Girl", 
      description: "Everyday casual outfit",
      url: "",
      thumbnail: "👩"
    },
    { 
      id: "female-warrior", 
      name: "Warrior", 
      description: "Battle-ready fighter",
      url: "",
      thumbnail: "🗡️"
    },
  ],
};

// Character model loader with error handling
function CharacterModel({ 
  url, 
  onError 
}: { 
  url: string; 
  onError: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  
  if (!url || hasError) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ModelWithErrorHandling url={url} onError={() => {
        setHasError(true);
        onError();
      }} />
    </Suspense>
  );
}

function ModelWithErrorHandling({ url, onError }: { url: string; onError: () => void }) {
  const { scene } = useGLTF(url);
  const clonedScene = useRef<THREE.Group | null>(null);

  useEffect(() => {
    clonedScene.current = scene.clone();
  }, [scene]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onError();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onError]);

  if (!clonedScene.current) return null;

  return (
    <primitive 
      object={clonedScene.current} 
      scale={1.5} 
      position={[0, -1.4, 0]} 
    />
  );
}

// Cybernetic Human Avatar - Futuristic Design
function HumanoidAvatar({ 
  level, 
  jobClass = "shadow",
  gender = "male"
}: { 
  level: number; 
  jobClass?: string;
  gender?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const neonRef = useRef<THREE.Mesh>(null);
  
  const isMonarch = level >= 30;
  const isElite = level >= 20;
  const isVeteran = level >= 10;
  const isMale = gender !== "female";

  // Cyberpunk neon colors
  const neonCyan = "#00ffff";
  const neonMagenta = "#ff00ff";
  const neonBlue = "#0066ff";
  const armorDark = "#0a0a15";
  const armorMetal = "#1a1a2e";

  // Theme colors based on class
  const primaryNeon = useMemo(() => {
    if (jobClass === "knight") return neonBlue;
    if (jobClass === "berserker") return "#ff3366";
    return neonCyan;
  }, [jobClass]);

  const secondaryNeon = useMemo(() => {
    if (jobClass === "knight") return "#00aaff";
    if (jobClass === "berserker") return "#ff6600";
    return neonMagenta;
  }, [jobClass]);

  // Animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.04;
    }
    
    if (neonRef.current && neonRef.current.material) {
      const mat = neonRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + Math.sin(t * 3) * 0.3;
    }
  });

  // Body proportions - lean cyber build
  const headSize = 0.18;

  return (
    <group ref={groupRef} scale={0.7} position={[0, -1.2, 0]}>
      <group ref={bodyRef}>
        {/* CYBER HEAD */}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[headSize, 32, 32]} />
          <meshPhysicalMaterial 
            color="#e8e8f0" 
            roughness={0.3}
            metalness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* VISOR/TECH EYES */}
        <mesh position={[-0.055, 1.37, 0.14]}>
          <boxGeometry args={[0.06, 0.025, 0.02]} />
          <meshPhysicalMaterial 
            color={primaryNeon}
            roughness={0.1}
            metalness={0.9}
            emissive={primaryNeon}
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0.055, 1.37, 0.14]}>
          <boxGeometry args={[0.06, 0.025, 0.02]} />
          <meshPhysicalMaterial 
            color={primaryNeon}
            roughness={0.1}
            metalness={0.9}
            emissive={primaryNeon}
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* CYBER NECK */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
          <meshPhysicalMaterial color={armorMetal} roughness={0.4} metalness={0.8} />
        </mesh>
        
        {/* TECH COLLAR */}
        <mesh position={[0, 1.1, 0]}>
          <torusGeometry args={[0.1, 0.015, 8, 32]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* CYBER TORSO - Tech Armor */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.45, 0.55, 0.22]} />
          <meshPhysicalMaterial 
            color={armorDark} 
            roughness={0.3}
            metalness={0.9}
            clearcoat={0.5}
          />
        </mesh>
        
        {/* CHEST PLATE */}
        <mesh position={[0, 0.85, 0.12]}>
          <boxGeometry args={[0.35, 0.35, 0.02]} />
          <meshPhysicalMaterial 
            color={armorMetal}
            roughness={0.2}
            metalness={0.95}
            emissive={primaryNeon}
            emissiveIntensity={isVeteran ? 0.8 : 0.3}
          />
        </mesh>
        
        {/* CHEST NEON LINES */}
        <mesh position={[0, 0.95, 0.135]}>
          <boxGeometry args={[0.25, 0.02, 0.01]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 0.85, 0.135]}>
          <boxGeometry args={[0.2, 0.015, 0.01]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 0.75, 0.135]}>
          <boxGeometry args={[0.15, 0.01, 0.01]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* TECH SHOULDERS - Angular armor */}
        <mesh position={[-0.32, 0.95, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshPhysicalMaterial color={armorDark} roughness={0.25} metalness={0.95} />
        </mesh>
        <mesh position={[-0.38, 0.9, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.12]} />
          <meshBasicMaterial ref={neonRef} color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        
        <mesh position={[0.32, 0.95, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshPhysicalMaterial color={armorDark} roughness={0.25} metalness={0.95} />
        </mesh>
        <mesh position={[0.38, 0.9, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.12]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* CYBER ARMS */}
        <group position={[-0.38, 0.65, 0]}>
          {/* Upper arm */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.055, 0.35, 12]} />
            <meshPhysicalMaterial color={armorDark} roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Neon accent */}
          <mesh position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.062, 0.057, 0.01, 12]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Forearm armor */}
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.1, 0.2, 0.08]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.25} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.22, 0.045]}>
            <boxGeometry args={[0.06, 0.15, 0.01]} />
            <meshBasicMaterial color={secondaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Gauntlet */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.09, 0.1, 0.07]} />
            <meshPhysicalMaterial color="#0a0a12" roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
        
        <group position={[0.38, 0.65, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.055, 0.35, 12]} />
            <meshPhysicalMaterial color={armorDark} roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.062, 0.057, 0.01, 12]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.1, 0.2, 0.08]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.25} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.22, 0.045]}>
            <boxGeometry args={[0.06, 0.15, 0.01]} />
            <meshBasicMaterial color={secondaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.09, 0.1, 0.07]} />
            <meshPhysicalMaterial color="#0a0a12" roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
        
        {/* CYBER WAIST */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.08, 16]} />
          <meshPhysicalMaterial color={armorDark} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.45, 0.1]}>
          <boxGeometry args={[0.12, 0.04, 0.02]} />
          <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* LOWER TORSO */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.38, 0.2, 0.18]} />
          <meshPhysicalMaterial color={armorDark} roughness={0.35} metalness={0.85} />
        </mesh>
        
        {/* CYBER LEGS */}
        <group position={[-0.12, 0.05, 0]}>
          {/* Thigh armor */}
          <mesh>
            <boxGeometry args={[0.14, 0.4, 0.14]} />
            <meshPhysicalMaterial color={armorDark} roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.075]}>
            <boxGeometry args={[0.08, 0.3, 0.01]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Knee guard */}
          <mesh position={[0, -0.05, 0.08]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Shin armor */}
          <mesh position={[0, -0.3, 0.02]}>
            <boxGeometry args={[0.12, 0.35, 0.1]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.25} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.3, 0.08]}>
            <boxGeometry args={[0.05, 0.25, 0.01]} />
            <meshBasicMaterial color={secondaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.55, 0.02]}>
            <boxGeometry args={[0.11, 0.15, 0.18]} />
            <meshPhysicalMaterial color="#050508" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
        
        <group position={[0.12, 0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.14, 0.4, 0.14]} />
            <meshPhysicalMaterial color={armorDark} roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.075]}>
            <boxGeometry args={[0.08, 0.3, 0.01]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, -0.05, 0.08]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.3, 0.02]}>
            <boxGeometry args={[0.12, 0.35, 0.1]} />
            <meshPhysicalMaterial color={armorMetal} roughness={0.25} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.3, 0.08]}>
            <boxGeometry args={[0.05, 0.25, 0.01]} />
            <meshBasicMaterial color={secondaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={[0, -0.55, 0.02]}>
            <boxGeometry args={[0.11, 0.15, 0.18]} />
            <meshPhysicalMaterial color="#050508" roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* WEAPONS BY CLASS */}
      {jobClass === "shadow" && (
        <group>
          {/* Dual Kunai */}
          <group position={[-0.55, 0.5, 0.1]} rotation={[0.3, 0.2, -0.5]}>
            <mesh>
              <coneGeometry args={[0.02, 0.35, 6]} />
              <meshPhysicalMaterial color={armorMetal} metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.015, 0.01, 0.12, 8]} />
              <meshPhysicalMaterial color={primaryNeon} emissive={primaryNeon} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.04, 0.02, 0.005]} />
              <meshPhysicalMaterial color="#1a1a2e" />
            </mesh>
          </group>
          <group position={[0.55, 0.5, 0.1]} rotation={[0.3, -0.2, 0.5]}>
            <mesh>
              <coneGeometry args={[0.02, 0.35, 6]} />
              <meshPhysicalMaterial color={armorMetal} metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.015, 0.01, 0.12, 8]} />
              <meshPhysicalMaterial color={primaryNeon} emissive={primaryNeon} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.04, 0.02, 0.005]} />
              <meshPhysicalMaterial color="#1a1a2e" />
            </mesh>
          </group>
        </group>
      )}

      {jobClass === "knight" && (
        <group>
          {/* Sword */}
          <group position={[0.6, 0.3, 0.15]} rotation={[0.2, -0.3, 0]}>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.04, 0.8, 0.008]} />
              <meshPhysicalMaterial color="#e0e0ff" metalness={0.9} roughness={0.1} emissive={primaryNeon} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.12, 0.03, 0.02]} />
              <meshPhysicalMaterial color={primaryNeon} emissive={primaryNeon} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.025, 0.03, 0.12, 8]} />
              <meshPhysicalMaterial color={armorMetal} metalness={0.95} />
            </mesh>
          </group>
          {/* Shield */}
          <group position={[-0.55, 0.4, 0.1]} rotation={[0.1, 0.2, 0]}>
            <mesh>
              <boxGeometry args={[0.25, 0.32, 0.04]} />
              <meshPhysicalMaterial color={armorDark} metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[0.15, 0.2, 0.01]} />
              <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshPhysicalMaterial color={primaryNeon} emissive={primaryNeon} emissiveIntensity={1} />
            </mesh>
          </group>
        </group>
      )}

      {jobClass === "berserker" && (
        <group position={[0.65, 0.2, 0.1]} rotation={[0.15, -0.2, 0.1]}>
          {/* Axe handle */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
            <meshPhysicalMaterial color="#3d2300" roughness={0.6} />
          </mesh>
          {/* Axe head */}
          <mesh position={[0.08, 0.35, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.25, 0.15, 0.03]} />
            <meshPhysicalMaterial color={secondaryNeon} emissive={secondaryNeon} emissiveIntensity={0.7} metalness={0.9} />
          </mesh>
          <mesh position={[-0.05, 0.35, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.2, 0.12, 0.03]} />
            <meshPhysicalMaterial color={secondaryNeon} emissive={secondaryNeon} emissiveIntensity={0.5} metalness={0.9} />
          </mesh>
          {/* Fire glow */}
          <pointLight position={[0, 0.35, 0.1]} intensity={0.8} color={secondaryNeon} distance={0.5} />
        </group>
      )}

      {jobClass === "monarch" && (
        <group position={[0.6, 0.1, 0.15]} rotation={[0.3, -0.1, 0]}>
          {/* Staff */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.025, 1.0, 8]} />
            <meshPhysicalMaterial color={armorMetal} metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Orb holder */}
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshPhysicalMaterial color="#1a1a3e" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Energy orb */}
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshPhysicalMaterial color={primaryNeon} emissive={primaryNeon} emissiveIntensity={2} transparent opacity={0.9} />
          </mesh>
          {/* Crown detail */}
          <mesh position={[0, 0.58, 0]}>
            <coneGeometry args={[0.03, 0.08, 4]} />
            <meshPhysicalMaterial color="#ffd700" emissive={primaryNeon} emissiveIntensity={0.5} metalness={0.9} />
          </mesh>
          {/* Staff glow */}
          <pointLight position={[0, 0.52, 0.1]} intensity={1.2} color={primaryNeon} distance={1} />
        </group>
      )}

      {jobClass === "celestial" && (
        <group position={[0.55, 0.6, 0.2]}>
          {/* Light orb */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} transparent opacity={0.8} />
          </mesh>
          {/* Inner glow */}
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Floating rings */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.12, 0.008, 8, 32]} />
            <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[0.1, 0.006, 8, 32]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} transparent opacity={0.5} />
          </mesh>
          {/* Light rays */}
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffffff" distance={1.5} />
        </group>
      )}

      {jobClass === "voidwalker" && (
        <group position={[0.55, 0.3, 0.1]} rotation={[0.2, -0.3, 0.15]}>
          {/* Void blade */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.06, 0.7, 0.01]} />
            <meshPhysicalMaterial color="#2a0a4a" emissive={primaryNeon} emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Blade edge glow */}
          <mesh position={[0, 0.35, 0.008]}>
            <boxGeometry args={[0.02, 0.7, 0.005]} />
            <meshBasicMaterial color={primaryNeon} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.15, 8]} />
            <meshPhysicalMaterial color="#1a0a2a" metalness={0.7} />
          </mesh>
          {/* Void energy */}
          <pointLight position={[0, 0.35, 0.1]} intensity={1} color={primaryNeon} distance={0.8} />
        </group>
      )}
      
      {/* AURA - Digital energy field */}
      {level >= 5 && (
        <mesh position={[0, 0.4, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.008, 8, 64]} />
          <meshBasicMaterial 
            color={primaryNeon} 
            transparent 
            opacity={0.7} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* DIGITAL PARTICLES */}
      {isElite && (
        <>
          {[...Array(12)].map((_, i) => (
            <mesh 
              key={`particle-${i}`}
              position={[
                Math.sin(i * 0.5 + Date.now() * 0.001) * 0.4,
                0.5 + Math.cos(i * 0.7) * 0.3,
                Math.cos(i * 0.5 + Date.now() * 0.001) * 0.3
              ]}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial 
                color={primaryNeon} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          ))}
        </>
      )}
      
      {/* CYBER EYES GLOW */}
      <pointLight position={[0, 1.37, 0.2]} intensity={1} color={primaryNeon} distance={0.8} />
      
      {/* LEVEL INDICATOR - Tech crown */}
      {isMonarch && (
        <group position={[0, 1.65, 0]}>
          {[...Array(5)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.sin(i * Math.PI * 0.4) * 0.12,
                0.06,
                Math.cos(i * Math.PI * 0.4) * 0.12
              ]}
            >
              <coneGeometry args={[0.02, 0.1, 4]} />
              <meshPhysicalMaterial 
                color="#ffd700"
                metalness={0.9}
                roughness={0.1}
                emissive={primaryNeon}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.03, 0]}>
            <torusGeometry args={[0.1, 0.01, 8, 32]} />
            <meshBasicMaterial color="#ffd700" blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ============================================
// MAIN AVATAR COMPONENT
// ============================================
export function Avatar3D({ 
  url, 
  level, 
  jobClass = "shadow", 
  isPremium = false,
  gender = "male",
}: Avatar3DProps) {
  const [modelError, setModelError] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check if model URL is valid (must be .glb or .gltf)
  useEffect(() => {
    if (!url) {
      setModelError(true);
      setChecked(true);
      return;
    }
    
    // Only accept GLB/GLTF 3D model files
    const isValid3DUrl = url.match(/\.(glb|gltf)(\?.*)?$/i);
    if (!isValid3DUrl) {
      setModelError(true);
      setChecked(true);
      return;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    fetch(url, { method: "HEAD", signal: controller.signal })
      .then(() => {
        setModelError(false);
      })
      .catch(() => {
        setModelError(true);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setChecked(true);
      });
      
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [url]);

  const borderColor = useMemo(() => {
    if (jobClass === "knight") return level >= 30 ? "#1e40af" : level >= 20 ? "#3b82f6" : "#60a5fa";
    if (jobClass === "berserker") return level >= 30 ? "#dc2626" : level >= 20 ? "#ef4444" : "#f97316";
    return level >= 30 ? "#7c3aed" : level >= 20 ? "#8b5cf6" : "#a855f7";
  }, [jobClass, level]);

  const useExternalModel = checked && url && !modelError;

  return (
    <div 
      className="w-48 h-64 rounded-xl overflow-hidden border-2 relative bg-gradient-to-b from-[#0a0a18] to-[#050510] flex items-center justify-center transition-all duration-500"
      style={{ borderColor }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 3, 2]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, 1, -2]} intensity={0.8} color={borderColor} />
        
        {useExternalModel ? (
          <Suspense fallback={<HumanoidAvatar level={level} jobClass={jobClass} gender={gender} />}>
            <CharacterModel url={url} onError={() => setModelError(true)} />
          </Suspense>
        ) : (
          <HumanoidAvatar level={level} jobClass={jobClass} gender={gender} />
        )}
        
        <Stars radius={50} depth={25} count={400} factor={1} saturation={0} fade speed={0.5} />
        <Environment preset="night" />
        <ContactShadows position={[0, -0.85, 0]} opacity={0.3} scale={4} blur={1} far={1} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.7} />
      </Canvas>
      
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full border border-white/15 bg-black/80 backdrop-blur-md">
        <span className="text-[8px] font-bold text-white/95 uppercase tracking-wider">
          Lv.{level}
        </span>
      </div>
    </div>
  );
}
