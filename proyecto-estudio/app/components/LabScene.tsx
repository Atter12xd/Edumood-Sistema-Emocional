"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";

interface SphereData {
  id: number;
  position: [number, number, number];
  color: string;
  completed: boolean;
}

interface LabSphereProps {
  data: SphereData;
  onClick: (id: number) => void;
}

function LabNode({ data, onClick }: LabSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        data.position[1] + Math.sin(state.clock.elapsedTime * 1.8 + data.id) * 0.18;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + data.id);
    }
  });

  return (
    <group>
      <Icosahedron
        ref={meshRef}
        args={[0.6, 1]}
        position={data.position}
        onClick={() => onClick(data.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={data.completed ? "#10B981" : hovered ? "#60A5FA" : data.color}
          emissive={data.completed ? "#10B981" : hovered ? "#2563EB" : data.color}
          emissiveIntensity={data.completed ? 0.9 : hovered ? 0.6 : 0.35}
          metalness={0.6}
          roughness={0.15}
        />
      </Icosahedron>

      {/* Halo exterior */}
      <mesh position={data.position}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color={data.completed ? "#10B981" : data.color}
          transparent
          opacity={hovered ? 0.35 : 0.18}
          wireframe
        />
      </mesh>

      {/* Número */}
      <Text
        position={[data.position[0], data.position[1], data.position[2] + 0.85]}
        fontSize={0.32}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.id}
      </Text>

      {/* Checkmark si está completado */}
      {data.completed && (
        <Text
          position={[data.position[0], data.position[1] + 0.95, data.position[2]]}
          fontSize={0.42}
          color="#22C55E"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}
    </group>
  );
}

function EnergyCore() {
  const discRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!discRef.current) return;
    discRef.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <group position={[0, -1.5, 0]}>
      <mesh ref={discRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.8, 64]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 64]} />
        <meshBasicMaterial color="#1f2937" opacity={0.9} transparent />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function ConnectionField({ nodes }: { nodes: SphereData[] }) {
  const lines = useMemo(() => {
    const center: [number, number, number] = [0, 0, 0];
    return nodes.map((node) => ({
      id: node.id,
      points: [center, node.position],
      color: node.completed ? "#22C55E" : node.color,
    }));
  }, [nodes]);

  return (
    <group>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.25}
        />
      ))}
    </group>
  );
}

function EnergyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#93c5fd"
        transparent
        opacity={0.45}
      />
    </points>
  );
}

interface LabSceneProps {
  spheres: SphereData[];
  onSphereClick: (id: number) => void;
}

export default function LabScene({ spheres, onSphereClick }: LabSceneProps) {
  return (
    <div className="w-full h-[360px] sm:h-[480px] lg:h-[600px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 2.5, 9], fov: 55 }}>
        <color attach="background" args={["#030712"]} />

        {/* Luces */}
        <ambientLight intensity={0.25} />
        <spotLight
          position={[6, 10, 4]}
          angle={0.45}
          penumbra={0.5}
          intensity={1.1}
          color="#38bdf8"
          castShadow
        />
        <pointLight position={[-5, 6, -6]} intensity={0.6} color="#a855f7" />
        <pointLight position={[0, -4, 0]} intensity={0.5} color="#14b8a6" />

        {/* Elementos ambientales */}
        <EnergyParticles />
        <EnergyCore />
        <ConnectionField nodes={spheres} />

        {/* Nodos interactivos */}
        {spheres.map((sphere) => (
          <LabNode key={sphere.id} data={sphere} onClick={onSphereClick} />
        ))}

        {/* Controles de cámara */}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
    </div>
  );
}





