"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, ContactShadows, Float, MeshDistortMaterial, Stars, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import React from 'react';

interface Avatar3DProps {
  url: string;
  level: number;
  jobClass?: "shadow" | "knight" | "berserker";
  isPremium?: boolean;
  gender?: "male" | "female";
}

// ============================================
// ANIMATED HUMAN-LIKE BASE BODY
// ============================================
function AnimatedHumanBody({ themeColor, level, jobClass, gender = "male", isPremium = false }: { themeColor: string; level: number; jobClass: string; gender?: "male" | "female"; isPremium?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Group>(null);
  
  const isSovereign = level >= 30;
  const isMonarch = level >= 20;
  const isSlayer = level >= 10;
  const isFemale = gender === "female";

  // Skin tone based on class and gender
  const skinColor = useMemo(() => {
    if (isFemale) {
      if (jobClass === "berserker") return "#f0d0b8";
      if (jobClass === "knight") return "#fce4d4";
      return "#e8d4c4"; // shadow - fair skin
    }
    // Male skin tones
    if (jobClass === "berserker") return "#d4a574";
    if (jobClass === "knight") return "#e8c4a0";
    return "#c9a882"; // shadow - slightly pale
  }, [jobClass, isFemale]);

  // Hair color based on class and level
  const hairColor = useMemo(() => {
    if (jobClass === "shadow") return isSovereign ? "#9333ea" : isMonarch ? "#6366f1" : isFemale ? "#2a1a0a" : "#1a1a2e";
    if (jobClass === "knight") return isSovereign ? "#fbbf24" : isMonarch ? "#f59e0b" : isFemale ? "#8b4513" : "#d4a574";
    return isSovereign ? "#dc2626" : isMonarch ? "#ea580c" : isFemale ? "#4a2c2a" : "#1c1917"; // berserker
  }, [jobClass, isSovereign, isMonarch, isFemale]);

  // Eye color
  const eyeColor = useMemo(() => {
    if (jobClass === "shadow") return "#a855f7";
    if (jobClass === "knight") return "#3b82f6";
    return "#ef4444"; // berserker
  }, [jobClass]);

  // Lip color for female
  const lipColor = useMemo(() => {
    if (jobClass === "shadow") return "#c084fc";
    if (jobClass === "knight") return "#f472b6";
    return "#f87171"; // berserker
  }, [jobClass]);

  // Body proportions based on gender
  const bodyProportions = useMemo(() => ({
    shoulderWidth: isFemale ? 0.32 : 0.38,
    chestWidth: isFemale ? 0.30 : 0.38,
    waistWidth: isFemale ? 0.22 : 0.28,
    hipWidth: isFemale ? 0.30 : 0.32,
    armThickness: isFemale ? 0.055 : 0.07,
    legThickness: isFemale ? 0.08 : 0.10,
    headSize: isFemale ? 0.14 : 0.16,
  }), [isFemale]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Breathing animation for torso
    if (torsoRef.current) {
      const breathe = Math.sin(time * 1.5) * (isFemale ? 0.015 : 0.02);
      torsoRef.current.scale.y = 1 + breathe;
      torsoRef.current.scale.x = 1 - breathe * 0.5;
    }
    
    // Subtle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.03;
      headRef.current.position.y = (isFemale ? 1.50 : 1.55) + Math.sin(time * 1.5) * 0.01;
    }
    
    // Arm sway
    if (leftArmRef.current && rightArmRef.current) {
      const swayAmount = isFemale ? 0.06 : 0.08;
      leftArmRef.current.rotation.x = Math.sin(time * 0.7) * swayAmount;
      rightArmRef.current.rotation.x = Math.sin(time * 0.7 + Math.PI) * swayAmount;
    }
    
    // Eye glow pulse
    if (leftEyeRef.current && rightEyeRef.current) {
      const intensity = 2 + Math.sin(time * 3) * 1;
      const mat = leftEyeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity;
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    
    // Hair flow
    if (hairRef.current) {
      hairRef.current.rotation.z = Math.sin(time * 1.2) * 0.05;
    }
    
    // Overall hover for sovereign
    if (groupRef.current && isSovereign) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* LEGS */}
      <group position={[0, 0, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.12, 0, 0]}>
          {/* Thigh */}
          <mesh position={[0, 0.35, 0]}>
            <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
            <meshStandardMaterial color="#0a0a15" roughness={0.7} />
          </mesh>
          {/* Calf */}
          <mesh position={[0, 0.05, 0.02]}>
            <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
            <meshStandardMaterial color="#0a0a15" roughness={0.7} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.2, 0.03]}>
            <boxGeometry args={[0.12, 0.12, 0.22]} />
            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
        
        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.12, 0, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
            <meshStandardMaterial color="#0a0a15" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.05, 0.02]}>
            <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
            <meshStandardMaterial color="#0a0a15" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.2, 0.03]}>
            <boxGeometry args={[0.12, 0.12, 0.22]} />
            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* TORSO */}
      <group ref={torsoRef} position={[0, isFemale ? 0.72 : 0.75, 0]}>
        {/* Hips - wider for female */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[bodyProportions.hipWidth, 0.18, 0.18]} />
          <meshStandardMaterial color="#0a0a15" roughness={0.6} />
        </mesh>
        
        {/* Abdomen - narrower waist for female */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[bodyProportions.waistWidth, 0.25, 0.16]} />
          <meshStandardMaterial color="#0a0a15" roughness={0.6} />
        </mesh>
        
        {/* Chest */}
        <mesh position={[0, isFemale ? 0.25 : 0.28, 0.02]}>
          <boxGeometry args={[bodyProportions.chestWidth, 0.28, 0.2]} />
          <meshStandardMaterial color="#0a0a15" roughness={0.5} />
        </mesh>
        
        {/* Female chest shape */}
        {isFemale && (
          <>
            <mesh position={[-0.06, 0.26, 0.1]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color="#0a0a15" roughness={0.6} />
            </mesh>
            <mesh position={[0.06, 0.26, 0.1]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color="#0a0a15" roughness={0.6} />
            </mesh>
          </>
        )}
        
        {/* Male Pectorals */}
        {!isFemale && (
          <>
            <mesh position={[-0.09, 0.3, 0.12]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#0a0a15" roughness={0.6} />
            </mesh>
            <mesh position={[0.09, 0.3, 0.12]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#0a0a15" roughness={0.6} />
            </mesh>
          </>
        )}
      </group>

      {/* ARMS */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.28, 0.85, 0]}>
        {/* Shoulder */}
        <mesh position={[-0.05, 0.08, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#0a0a15" roughness={0.5} />
        </mesh>
        {/* Bicep */}
        <mesh position={[-0.08, -0.08, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.1, -0.32, 0]} rotation={[0.2, 0, 0.15]}>
          <capsuleGeometry args={[0.06, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.1, -0.52, 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {/* Gauntlet */}
        {level >= 2 && (
          <mesh position={[-0.1, -0.38, 0]} rotation={[0.2, 0, 0.15]}>
            <cylinderGeometry args={[0.07, 0.08, 0.15, 8]} />
            <meshStandardMaterial color="#222" metalness={0.8} emissive={themeColor} emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.28, 0.85, 0]}>
        <mesh position={[0.05, 0.08, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#0a0a15" roughness={0.5} />
        </mesh>
        <mesh position={[0.08, -0.08, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.1, -0.32, 0]} rotation={[0.2, 0, -0.15]}>
          <capsuleGeometry args={[0.06, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.1, -0.52, 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        {level >= 2 && (
          <mesh position={[0.1, -0.38, 0]} rotation={[0.2, 0, -0.15]}>
            <cylinderGeometry args={[0.07, 0.08, 0.15, 8]} />
            <meshStandardMaterial color="#222" metalness={0.8} emissive={themeColor} emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>

      {/* NECK */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>

      {/* HEAD */}
      <group ref={headRef} position={[0, isFemale ? 1.32 : 1.35, 0]}>
        {/* Face base - slightly smaller for female */}
        <mesh>
          <sphereGeometry args={[bodyProportions.headSize, 24, 24]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
        
        {/* Jaw/Chin - smaller for female */}
        <mesh position={[0, isFemale ? -0.06 : -0.08, 0.05]}>
          <sphereGeometry args={[isFemale ? 0.10 : 0.12, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
        
        {/* Eyes */}
        <group position={[0, isFemale ? 0.03 : 0.02, 0.14]}>
          {/* Left Eye */}
          <mesh ref={leftEyeRef} position={[-0.055, 0, 0]}>
            <sphereGeometry args={[isFemale ? 0.038 : 0.035, 16, 16]} />
            <meshStandardMaterial color="#fff" emissive={eyeColor} emissiveIntensity={3} />
          </mesh>
          {/* Left Pupil */}
          <mesh position={[-0.055, 0, 0.025]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
          </mesh>
          
          {/* Right Eye */}
          <mesh ref={rightEyeRef} position={[0.055, 0, 0]}>
            <sphereGeometry args={[isFemale ? 0.038 : 0.035, 16, 16]} />
            <meshStandardMaterial color="#fff" emissive={eyeColor} emissiveIntensity={3} />
          </mesh>
          {/* Right Pupil */}
          <mesh position={[0.055, 0, 0.025]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
          </mesh>
          
          {/* Eyebrows - thinner for female */}
          <mesh position={[-0.055, 0.05, 0.02]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[isFemale ? 0.04 : 0.05, isFemale ? 0.008 : 0.01, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.055, 0.05, 0.02]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[isFemale ? 0.04 : 0.05, isFemale ? 0.008 : 0.01, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          
          {/* Female eyelashes */}
          {isFemale && (
            <>
              <mesh position={[-0.055, 0.045, 0.035]}>
                <boxGeometry args={[0.04, 0.005, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
              <mesh position={[0.055, 0.045, 0.035]}>
                <boxGeometry args={[0.04, 0.005, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            </>
          )}
        </group>
        
        {/* Nose - smaller for female */}
        <mesh position={[0, isFemale ? -0.01 : -0.02, 0.16]}>
          <coneGeometry args={[isFemale ? 0.015 : 0.02, isFemale ? 0.03 : 0.04, 4]} />
          <meshStandardMaterial color={skinColor} roughness={0.9} />
        </mesh>
        
        {/* Mouth - with lipstick for female */}
        <mesh position={[0, isFemale ? -0.055 : -0.06, 0.14]}>
          <boxGeometry args={[isFemale ? 0.04 : 0.05, isFemale ? 0.015 : 0.01, 0.01]} />
          <meshStandardMaterial color={isFemale ? lipColor : "#8b6c5c"} />
        </mesh>
        
        {/* Female lower lip */}
        {isFemale && (
          <mesh position={[0, -0.065, 0.145]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color={lipColor} roughness={0.4} />
          </mesh>
        )}
        
        {/* Ears - smaller for female */}
        <mesh position={[-0.17, 0.02, 0]}>
          <sphereGeometry args={[isFemale ? 0.035 : 0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
        <mesh position={[0.17, 0.02, 0]}>
          <sphereGeometry args={[isFemale ? 0.035 : 0.04, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
        
        {/* Female earrings for premium/monarch+ */}
        {isFemale && (isPremium || isMonarch) && (
          <>
            <mesh position={[-0.17, -0.01, 0.02]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color={isSovereign ? "#ffd700" : "#c0c0c0"} metalness={0.9} roughness={0.1} emissive={themeColor} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0.17, -0.01, 0.02]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color={isSovereign ? "#ffd700" : "#c0c0c0"} metalness={0.9} roughness={0.1} emissive={themeColor} emissiveIntensity={0.5} />
            </mesh>
          </>
        )}
        
        {/* HAIR */}
        <group ref={hairRef}>
          {/* Base hair */}
          <mesh position={[0, isFemale ? 0.06 : 0.08, -0.02]}>
            <sphereGeometry args={[bodyProportions.headSize + 0.03, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} />
          </mesh>
          
          {/* FEMALE HAIR STYLES */}
          {isFemale && (
            <>
              {/* Long flowing hair for shadow female */}
              {jobClass === "shadow" && (
                <>
                  {/* Long back hair */}
                  <mesh position={[0, 0.05, -0.12]} rotation={[0.1, 0, 0]}>
                    <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
                    <meshStandardMaterial color={hairColor} roughness={0.6} />
                  </mesh>
                  {/* Side strands */}
                  <mesh position={[-0.12, 0, 0.02]} rotation={[0, 0, 0.3]}>
                    <capsuleGeometry args={[0.025, 0.18, 4, 8]} />
                    <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={isSlayer ? 0.3 : 0} />
                  </mesh>
                  <mesh position={[0.12, 0, 0.02]} rotation={[0, 0, -0.3]}>
                    <capsuleGeometry args={[0.025, 0.18, 4, 8]} />
                    <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={isSlayer ? 0.3 : 0} />
                  </mesh>
                  {/* Top bun/ponytail for high levels */}
                  {isMonarch && (
                    <mesh position={[0, 0.18, -0.05]}>
                      <sphereGeometry args={[0.06, 12, 12]} />
                      <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={0.4} />
                    </mesh>
                  )}
                </>
              )}
              
              {/* Elegant wavy hair for knight female */}
              {jobClass === "knight" && (
                <>
                  {/* Wavy back hair */}
                  <mesh position={[0, 0.02, -0.1]} rotation={[0.15, 0, 0]}>
                    <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
                    <meshStandardMaterial color={hairColor} roughness={0.5} />
                  </mesh>
                  {/* Side curls */}
                  <mesh position={[-0.13, -0.02, 0.04]} rotation={[0.2, 0, 0.4]}>
                    <torusGeometry args={[0.04, 0.015, 8, 8, Math.PI * 1.3]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                  <mesh position={[0.13, -0.02, 0.04]} rotation={[0.2, 0, -0.4]}>
                    <torusGeometry args={[0.04, 0.015, 8, 8, Math.PI * 1.3]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                  {/* Tiara/crown for monarch+ */}
                  {isMonarch && (
                    <mesh position={[0, 0.15, 0.08]}>
                      <torusGeometry args={[0.1, 0.015, 6, 8, Math.PI]} />
                      <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} emissive={themeColor} emissiveIntensity={0.5} />
                    </mesh>
                  )}
                </>
              )}
              
              {/* Wild flowing hair for berserker female */}
              {jobClass === "berserker" && (
                <>
                  {/* Wild back hair */}
                  <mesh position={[0, 0.08, -0.08]} rotation={[-0.2, 0, 0]}>
                    <capsuleGeometry args={[0.09, 0.28, 8, 16]} />
                    <meshStandardMaterial color={hairColor} roughness={0.7} />
                  </mesh>
                  {/* Spiky strands */}
                  <mesh position={[-0.08, 0.15, 0.02]} rotation={[0.3, 0.2, -0.4]}>
                    <coneGeometry args={[0.025, 0.12, 4]} />
                    <meshStandardMaterial color={hairColor} emissive="#ff4444" emissiveIntensity={isMonarch ? 0.4 : 0} />
                  </mesh>
                  <mesh position={[0.08, 0.15, 0.02]} rotation={[0.3, -0.2, 0.4]}>
                    <coneGeometry args={[0.025, 0.12, 4]} />
                    <meshStandardMaterial color={hairColor} emissive="#ff4444" emissiveIntensity={isMonarch ? 0.4 : 0} />
                  </mesh>
                  <mesh position={[0, 0.18, 0.04]} rotation={[0.4, 0, 0]}>
                    <coneGeometry args={[0.03, 0.1, 4]} />
                    <meshStandardMaterial color={hairColor} emissive="#ff4444" emissiveIntensity={isMonarch ? 0.4 : 0} />
                  </mesh>
                </>
              )}
            </>
          )}
          
          {/* MALE HAIR STYLES */}
          {!isFemale && (
            <>
              {/* Spiky hair for shadow */}
              {jobClass === "shadow" && (
                <>
                  <mesh position={[0, 0.22, 0]} rotation={[0.3, 0, 0]}>
                    <coneGeometry args={[0.04, 0.15, 4]} />
                    <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={isSlayer ? 0.5 : 0} />
                  </mesh>
                  <mesh position={[-0.08, 0.2, 0.02]} rotation={[0.2, 0.3, -0.2]}>
                    <coneGeometry args={[0.035, 0.12, 4]} />
                    <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={isSlayer ? 0.5 : 0} />
                  </mesh>
                  <mesh position={[0.08, 0.2, 0.02]} rotation={[0.2, -0.3, 0.2]}>
                    <coneGeometry args={[0.035, 0.12, 4]} />
                    <meshStandardMaterial color={hairColor} emissive={themeColor} emissiveIntensity={isSlayer ? 0.5 : 0} />
                  </mesh>
                </>
              )}
              
              {/* Flowing hair for knight */}
              {jobClass === "knight" && (
                <>
                  <mesh position={[-0.15, 0, -0.05]} rotation={[0, 0.5, 0.2]}>
                    <capsuleGeometry args={[0.03, 0.2, 4, 8]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                  <mesh position={[0.15, 0, -0.05]} rotation={[0, -0.5, -0.2]}>
                    <capsuleGeometry args={[0.03, 0.2, 4, 8]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                </>
              )}
              
              {/* Wild hair for berserker */}
              {jobClass === "berserker" && (
                <>
                  <mesh position={[0, 0.25, 0]} rotation={[0.4, 0, 0]}>
                    <coneGeometry args={[0.06, 0.18, 4]} />
                    <meshStandardMaterial color={hairColor} emissive="#ff4444" emissiveIntensity={isMonarch ? 0.5 : 0} />
                  </mesh>
                  <mesh position={[-0.1, 0.22, -0.02]} rotation={[0.1, 0.2, -0.3]}>
                    <coneGeometry args={[0.04, 0.14, 4]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                  <mesh position={[0.1, 0.22, -0.02]} rotation={[0.1, -0.2, 0.3]}>
                    <coneGeometry args={[0.04, 0.14, 4]} />
                    <meshStandardMaterial color={hairColor} />
                  </mesh>
                </>
              )}
            </>
          )}
        </group>
      </group>
    </group>
  );
}

// ============================================
// HUNTER EQUIPMENT (Armor, Weapons, Effects)
// ============================================
function HunterEquipment({ 
  level, 
  jobClass = "shadow", 
  isPremium = false, 
  isCustomModel = false 
}: { 
  level: number, 
  jobClass?: "shadow" | "knight" | "berserker", 
  isPremium?: boolean,
  isCustomModel?: boolean
}) {
  const isSovereign = level >= 30;
  const isMonarch = level >= 20;
  const isSlayer = level >= 10;

  const themeColor = useMemo(() => {
    if (jobClass === "knight") return level >= 30 ? "#facc15" : level >= 20 ? "#3b82f6" : "#60a5fa";
    if (jobClass === "berserker") return level >= 30 ? "#ef4444" : level >= 20 ? "#f97316" : "#fb923c";
    return level >= 30 ? "#a21caf" : level >= 20 ? "#8b5cf6" : "#a855f7";
  }, [level, jobClass]);

  const getProg = (min: number, max: number) => Math.min(Math.max((level - min) / (max - min), 0), 1);
  const weaponScale = 0.8 + (level * 0.02);

  const equipOffset = isCustomModel ? -0.1 : 0;

  return (
    <group position={[0, equipOffset, 0]}>
      {/* MANA CORE - Chest */}
      {level >= 5 && (
        <mesh position={[0, 1.0, 0.16]} scale={0.5 + (level * 0.015)}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <MeshDistortMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2 + (level * 0.08)} speed={2.5} distort={0.25 + (level * 0.008)} />
        </mesh>
      )}

      {/* CHESTPLATE */}
      {level >= 11 && (
        <group position={[0, 0.98, 0.08]}>
          <mesh>
            <boxGeometry args={[0.42 + getProg(11, 20) * 0.08, 0.32, 0.22]} />
            <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Center line glow */}
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[0.02, 0.25]} />
            <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={3} />
          </mesh>
        </group>
      )}

      {/* PAULDRONS (Shoulder Armor) */}
      {level >= 18 && (
        <>
          <group position={[-0.32, 1.02, 0]} rotation={[0, 0, 0.35]}>
            <mesh>
              <sphereGeometry args={[0.12 + getProg(18, 30) * 0.06, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} emissive={themeColor} emissiveIntensity={0.4} />
            </mesh>
            {jobClass === "berserker" && isMonarch && (
              <mesh position={[0, 0.12, 0]} rotation={[0.3, 0, 0]}>
                <coneGeometry args={[0.04, 0.15, 4]} />
                <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1} />
              </mesh>
            )}
          </group>
          <group position={[0.32, 1.02, 0]} rotation={[0, 0, -0.35]}>
            <mesh>
              <sphereGeometry args={[0.12 + getProg(18, 30) * 0.06, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} emissive={themeColor} emissiveIntensity={0.4} />
            </mesh>
          </group>
        </>
      )}

      {/* WEAPONS */}
      {/* SHADOW HUNTER - Dual Daggers */}
      {jobClass === "shadow" && (
        <group position={[0.32, 0.55, 0.15]} rotation={[0.15, -0.15, -0.25]}>
          {/* Right Dagger */}
          <group scale={weaponScale * 0.9}>
            {/* Blade - Tapered shape */}
            <mesh position={[0, 0.35, 0]}>
              <coneGeometry args={[0.025, 0.55, 4]} />
              <meshStandardMaterial color="#2a2a3a" metalness={0.95} roughness={0.1} emissive={themeColor} emissiveIntensity={0.8 + level * 0.05} />
            </mesh>
            {/* Blade edge glow */}
            <mesh position={[0, 0.35, 0.012]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.012, 0.52, 4]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2 + level * 0.1} transparent opacity={0.7} />
            </mesh>
            {/* Guard/Crossguard */}
            <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.08, 0.015, 0.015]} />
              <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Handle */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.012, 0.015, 0.12, 8]} />
              <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
            </mesh>
            {/* Handle wrapping */}
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[0, -0.03 - i * 0.025, 0.008]}>
                <boxGeometry args={[0.02, 0.008, 0.005]} />
                <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.5} />
              </mesh>
            ))}
            {/* Pommel */}
            <mesh position={[0, -0.15, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
          
          {/* Second Dagger (for Monarch+) */}
          {isMonarch && (
            <group position={[-0.45, 0.15, 0]} rotation={[0, 0.35, 0.4]} scale={weaponScale * 0.9}>
              {/* Blade */}
              <mesh position={[0, 0.35, 0]}>
                <coneGeometry args={[0.025, 0.55, 4]} />
                <meshStandardMaterial color="#2a2a3a" metalness={0.95} roughness={0.1} emissive={themeColor} emissiveIntensity={0.8 + level * 0.05} />
              </mesh>
              <mesh position={[0, 0.35, 0.012]}>
                <coneGeometry args={[0.012, 0.52, 4]} />
                <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2 + level * 0.1} transparent opacity={0.7} />
              </mesh>
              {/* Guard */}
              <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.08, 0.015, 0.015]} />
                <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Handle */}
              <mesh position={[0, -0.08, 0]}>
                <cylinderGeometry args={[0.012, 0.015, 0.12, 8]} />
                <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
              </mesh>
              {/* Pommel */}
              <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* HOLY KNIGHT - Longsword & Shield */}
      {jobClass === "knight" && (
        <>
          {/* Longsword */}
          <group position={[0.32, 0.6, 0.18]} rotation={[0.08, -0.08, -0.12]} scale={weaponScale}>
            {/* Blade - Fullered design */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.04, 0.75, 0.008]} />
              <meshStandardMaterial color="#e8e8f0" metalness={1} roughness={0.05} />
            </mesh>
            {/* Blade tip */}
            <mesh position={[0, 0.85, 0]}>
              <coneGeometry args={[0.02, 0.12, 4]} />
              <meshStandardMaterial color="#e8e8f0" metalness={1} roughness={0.05} />
            </mesh>
            {/* Fuller (blood groove) */}
            <mesh position={[0, 0.4, 0.005]}>
              <boxGeometry args={[0.015, 0.55, 0.003]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={isSovereign ? 3 : 1.5} />
            </mesh>
            {/* Edge glow */}
            <mesh position={[0, 0.45, 0.006]}>
              <boxGeometry args={[0.038, 0.72, 0.002]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} transparent opacity={0.5} />
            </mesh>
            {/* Crossguard */}
            <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.12, 0.025, 0.025]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Guard decorations */}
            <mesh position={[-0.055, 0.04, 0]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.055, 0.04, 0]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Handle/Grip */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.018, 0.02, 0.16, 8]} />
              <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
            </mesh>
            {/* Wire wrapping on handle */}
            {[...Array(7)].map((_, i) => (
              <mesh key={i} position={[0, -0.01 - i * 0.022, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.018, 0.003, 4, 8]} />
                <meshStandardMaterial color="#c4a000" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Pommel */}
            <mesh position={[0, -0.17, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
          
          {/* Shield */}
          <group position={[-0.38, 0.6, 0.1]} rotation={[0, 0.35, 0.18]} scale={0.8 + (level * 0.03)}>
            {/* Shield body - Curved heater shield */}
            <mesh>
              <boxGeometry args={[0.32, 0.48, 0.035]} />
              <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Shield face */}
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.30, 0.46, 0.01]} />
              <meshStandardMaterial color="#0a0a15" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Shield rim */}
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[0.34, 0.50, 0.015]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Shield boss (center) */}
            <mesh position={[0, 0.05, 0.04]}>
              <sphereGeometry args={[0.05, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#c4a000" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Cross emblem */}
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.03, 0.25, 0.005]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.15, 0.03, 0.005]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={2} />
            </mesh>
            {/* Handle on back */}
            <mesh position={[0, 0.05, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.04, 0.01, 4, 8, Math.PI]} />
              <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
            </mesh>
          </group>
        </>
      )}

      {/* BERSERKER - Battle Axe */}
      {jobClass === "berserker" && (
        <group position={[0.32, 0.75, 0.25]} rotation={[-0.35, -0.18, -0.28]} scale={weaponScale}>
          {/* Axe Handle */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 1.4, 8]} />
            <meshStandardMaterial color="#2a1a0a" roughness={0.85} />
          </mesh>
          {/* Handle grip wrapping */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[0, -0.5 + i * 0.12, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.025, 0.006, 4, 8]} />
              <meshStandardMaterial color="#1a0a00" roughness={0.9} />
            </mesh>
          ))}
          {/* Axe head - Double bit */}
          <group position={[0, 0.55, 0]}>
            {/* Main head body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
              <meshStandardMaterial color="#2a2a3a" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Left blade */}
            <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.08, 0.18, 4]} />
              <meshStandardMaterial color="#3a3a4a" metalness={0.95} roughness={0.08} />
            </mesh>
            {/* Left blade edge */}
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.04, 0.16, 4]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.5 + level * 0.08} />
            </mesh>
            {/* Right blade */}
            <mesh position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.08, 0.18, 4]} />
              <meshStandardMaterial color="#3a3a4a" metalness={0.95} roughness={0.08} />
            </mesh>
            {/* Right blade edge */}
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.04, 0.16, 4]} />
              <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1.5 + level * 0.08} />
            </mesh>
            {/* Top spike (for Monarch+) */}
            {isMonarch && (
              <mesh position={[0, 0.15, 0]}>
                <coneGeometry args={[0.03, 0.15, 4]} />
                <meshStandardMaterial color="#3a3a4a" metalness={0.95} roughness={0.05} emissive={themeColor} emissiveIntensity={0.5} />
              </mesh>
            )}
          </group>
          {/* Bottom spike/pommel */}
          <mesh position={[0, -0.75, 0]}>
            <coneGeometry args={[0.025, 0.1, 4]} />
            <meshStandardMaterial color="#2a2a3a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Energy effect on blade */}
          <mesh position={[0, 0.55, 0.02]} scale={weaponScale}>
            <planeGeometry args={[0.35, 0.18]} />
            <MeshDistortMaterial color={themeColor} emissive={themeColor} emissiveIntensity={1} speed={5} distort={0.25} transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {/* SOVEREIGN EFFECTS */}
      {isSovereign && (
        <group position={[0, 1.1, -0.45]}>
          <Float speed={4} rotationIntensity={1.8} floatIntensity={1.8}>
            <mesh position={[-0.55, 0, 0]} rotation={[0, 0.28, 0.55]}>
              <boxGeometry args={[0.18, 2.8, 0.008]} />
              <MeshDistortMaterial color={themeColor} emissive={themeColor} emissiveIntensity={4.5} speed={12} distort={0.55} />
            </mesh>
            <mesh position={[0.55, 0, 0]} rotation={[0, -0.28, -0.55]}>
              <boxGeometry args={[0.18, 2.8, 0.008]} />
              <MeshDistortMaterial color={themeColor} emissive={themeColor} emissiveIntensity={4.5} speed={12} distort={0.55} />
            </mesh>
          </Float>
        </group>
      )}

      {/* PARTICLES */}
      <Sparkles 
        count={25 + level * 12} 
        scale={[1.8, 3.5, 1.8]} 
        size={2.5 + level * 0.12} 
        speed={1.2 + level * 0.04} 
        color={themeColor} 
        position={[0, 0.9, 0]}
      />

      {/* PREMIUM EFFECTS */}
      {isPremium && (
        <>
          <group position={[0, 1.6, 0]} rotation={[Math.PI / 14, 0, 0]}>
            <Float speed={1.8} rotationIntensity={0.45} floatIntensity={0.45}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.26, 0.012, 16, 64]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={4.5} />
              </mesh>
            </Float>
          </group>
          <Sparkles
            count={120}
            scale={[1.4, 2.8, 1.4]}
            size={4}
            speed={1.4}
            color="#FFD700"
            position={[0, 0.9, 0]}
            opacity={0.75}
          />
        </>
      )}
    </group>
  );
}

// ============================================
// ENHANCED ANIMATED AVATAR (FALLBACK)
// ============================================
function AnimatedHunterAvatar({ level, jobClass = "shadow", isPremium = false, gender = "male" }: { level: number, jobClass?: "shadow" | "knight" | "berserker", isPremium?: boolean, gender?: "male" | "female" }) {
  const groupRef = useRef<THREE.Group>(null);
  const isSovereign = level >= 30;

  const themeColor = useMemo(() => {
    if (jobClass === "knight") return level >= 30 ? "#facc15" : level >= 20 ? "#3b82f6" : "#60a5fa";
    if (jobClass === "berserker") return level >= 30 ? "#ef4444" : level >= 20 ? "#f97316" : "#fb923c";
    return level >= 30 ? "#a21caf" : level >= 20 ? "#8b5cf6" : "#a855f7";
  }, [level, jobClass]);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth floating
      const hoverSpeed = jobClass === "shadow" ? 1.8 : jobClass === "berserker" ? 1.0 : 1.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * hoverSpeed) * 0.04 - 0.45;
      
      // Slow rotation for sovereigns
      if (isSovereign) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <AnimatedHumanBody themeColor={themeColor} level={level} jobClass={jobClass} gender={gender} isPremium={isPremium} />
      <HunterEquipment level={level} jobClass={jobClass} isPremium={isPremium} />
    </group>
  );
}

// ============================================
// MODEL COMPONENT (GLTF Loader)
// ============================================
function Model({ url, level, jobClass, isPremium, onError }: { url: string, level: number, jobClass: "shadow" | "knight" | "berserker", isPremium: boolean, onError?: () => void }) {
  const { scene } = useGLTF(url, undefined, undefined, (error) => {
    console.error("GLTF Load Error:", error);
    setTimeout(() => onError?.(), 0);
  });
  
  const clonedScene = useMemo(() => {
    try {
      return scene.clone();
    } catch (err) {
      setTimeout(() => onError?.(), 0);
      return null;
    }
  }, [scene, onError]);

  const groupRef = useRef<THREE.Group>(null);
  const isSovereign = level >= 30;
  const isElite = level >= 15;

  const themeColor = useMemo(() => {
    if (jobClass === "knight") return level >= 30 ? "#facc15" : level >= 20 ? "#3b82f6" : "#60a5fa";
    if (jobClass === "berserker") return level >= 30 ? "#ef4444" : level >= 20 ? "#f97316" : "#fb923c";
    return level >= 30 ? "#a21caf" : level >= 20 ? "#8b5cf6" : "#a855f7";
  }, [level, jobClass]);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (level >= 10 && mesh.material) {
          (mesh.material as any).emissive = new THREE.Color(themeColor);
          (mesh.material as any).emissiveIntensity = isSovereign ? 0.45 : 0.18;
        }
      }
    });
  }, [clonedScene, level, themeColor, isSovereign]);

  useFrame((state) => {
    if (groupRef.current) {
      const hoverSpeed = jobClass === "shadow" ? 1.8 : 1.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * hoverSpeed) * 0.04 - 0.5;
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={isSovereign ? 2.1 : isElite ? 1.95 : 1.75} position={[0, -1.75, 0]} />
      <HunterEquipment level={level} jobClass={jobClass} isPremium={isPremium} isCustomModel={true} />
    </group>
  );
}

// ============================================
// ERROR BOUNDARY
// ============================================
class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.warn("Avatar3D Runtime Catch:", error); }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ============================================
// MODEL WRAPPER
// ============================================
function ModelWrapper({ url, level, jobClass, isPremium, gender = "male" }: { url: string, level: number, jobClass: "shadow" | "knight" | "berserker", isPremium: boolean, gender?: "male" | "female" }) {
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!url) {
      setIsUrlValid(false);
      setIsChecking(false);
      return;
    }
    
    setLoadError(false);
    setIsChecking(true);
    
    if (!url.startsWith('http') && !url.startsWith('/')) {
      setIsUrlValid(false);
      setIsChecking(false);
      return;
    }

    const checkModel = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal 
        });
        setIsUrlValid(true);
      } catch (err) {
        console.warn("Model pre-flight failed, using fallback:", url);
        setLoadError(true);
      } finally {
        clearTimeout(timeoutId);
        setIsChecking(false);
      }
    };

    checkModel();
  }, [url]);

  if (isChecking) return <AnimatedHunterAvatar level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />;
  if (isUrlValid === false || loadError) return <AnimatedHunterAvatar level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />;

  return (
    <Suspense fallback={<AnimatedHunterAvatar level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />}>
      {isUrlValid && (
        <SceneErrorBoundary key={url} fallback={<AnimatedHunterAvatar level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />}>
          <Model url={url} level={level} jobClass={jobClass} isPremium={isPremium} onError={() => setLoadError(true)} />
        </SceneErrorBoundary>
      )}
    </Suspense>
  );
}

// ============================================
// LEVEL AURA
// ============================================
function LevelAura({ level }: { level: number }) {
  const auraRef = useRef<THREE.Group>(null);
  
  const auraProps = useMemo(() => {
    const scale = 1 + (level / 100);
    let color = "#8b5cf6"; 
    if (level >= 30) color = "#ff0000";
    else if (level >= 20) color = "#00ffff";
    else if (level >= 10) color = "#3b82f6";
    return { color, scale };
  }, [level]);

  useFrame((state) => {
    if (auraRef.current) {
      auraRef.current.rotation.y += 0.018;
      const pulse = Math.sin(state.clock.elapsedTime * 1.8) * 0.08 + 1;
      auraRef.current.scale.set(auraProps.scale * pulse, auraProps.scale * pulse, auraProps.scale * pulse);
    }
  });

  return (
    <group ref={auraRef}>
      <mesh scale={[1.3, 2.8, 1.3]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.65, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={auraProps.color} transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export function Avatar3D({ url, level, jobClass = "shadow", isPremium = false, gender = "male" }: Avatar3DProps) {
  return (
    <div className="w-40 h-48 rounded-xl overflow-hidden border-2 relative bg-gradient-to-b from-[#0a0a18] to-[#050510] flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
         style={{ borderColor: level >= 30 ? "#ef4444" : level >= 20 ? "#06b6d4" : level >= 10 ? "#3b82f6" : "#8b5cf6" }}>
      
      <Canvas camera={{ position: [0, 0.3, 3], fov: 36 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 5, 4]} intensity={1.3} color="#ffffff" />
        <pointLight position={[-4, 2, -4]} intensity={0.7} color={themeColorMapping(level)} />
        <pointLight position={[0, -2, 2]} intensity={0.3} color={themeColorMapping(level)} />
        
        <SceneErrorBoundary fallback={<AnimatedHunterAvatar level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />}>
          <ModelWrapper url={url} level={level} jobClass={jobClass} isPremium={isPremium} gender={gender} />
          <LevelAura level={level} />
          <Stars radius={80} depth={45} count={2500} factor={3.5} saturation={0} fade speed={1.3} />
        </SceneErrorBoundary>
        
        <Environment preset="night" />
        <ContactShadows position={[0, -0.95, 0]} opacity={0.65} scale={5.5} blur={2.2} far={1.8} />
        
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.6} maxPolarAngle={Math.PI / 1.9} />
      </Canvas>
      
      {/* HUD */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 opacity-50">
        <div className="w-8 h-0.5 bg-purple-500/40 rounded-full" />
        <div className="w-4 h-0.5 bg-purple-500/25 rounded-full" />
      </div>

      {/* Level Tag */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full border border-white/10 bg-black/75 backdrop-blur-md whitespace-nowrap">
        <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.18em] flex items-center gap-2">
          {getHunterTitle(level, jobClass)} - Rank {level}
        </span>
      </div>

      {/* Screen Effects */}
      <div className={`absolute inset-0 pointer-events-none z-10 opacity-15 bg-[radial-gradient(circle,transparent_60%,${level >= 30 ? '#ef4444' : '#3b82f6'}22_100%)]`} />
    </div>
  );
}

function themeColorMapping(level: number) {
  if (level >= 30) return "#ef4444";
  if (level >= 20) return "#06b6d4";
  if (level >= 10) return "#3b82f6";
  return "#8b5cf6";
}

function getHunterTitle(level: number, jobClass: string = "shadow") {
  const prefix = jobClass === "knight" ? "Holy" : jobClass === "berserker" ? "Inferno" : "Shadow";
  
  if (level >= 30) return `${prefix} Sovereign`;
  if (level >= 20) return `${prefix} Monarch`;
  if (level >= 10) return `${prefix} Slayer`;
  return `${prefix} Trainee`;
}
