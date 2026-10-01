import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroFashionCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Fashion Mannequin Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 1. Torso - Structured Sartorial Silhouette
    const torsoGeo = new THREE.CylinderGeometry(1.2, 0.8, 2.2, 32);
    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      roughness: 0.35,
      metalness: 0.7,
    });
    const torso = new THREE.Mesh(torsoGeo, darkObsidianMat);
    torso.position.y = -0.2;
    modelGroup.add(torso);

    // 2. Architectural Lapels (Gold & Gunmetal Trim)
    const lapelLeftGeo = new THREE.BoxGeometry(0.3, 1.4, 0.1);
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const lapelLeft = new THREE.Mesh(lapelLeftGeo, goldTrimMat);
    lapelLeft.position.set(-0.4, 0.4, 0.85);
    lapelLeft.rotation.z = -0.3;
    modelGroup.add(lapelLeft);

    const lapelRight = new THREE.Mesh(lapelLeftGeo, goldTrimMat);
    lapelRight.position.set(0.4, 0.4, 0.85);
    lapelRight.rotation.z = 0.3;
    modelGroup.add(lapelRight);

    // 3. Floating Architectural Rings around torso
    const orbitRingGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xa0a8b8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ringA = new THREE.Mesh(orbitRingGeo, titaniumMat);
    ringA.rotation.x = Math.PI / 3;
    modelGroup.add(ringA);

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.015, 16, 100), goldTrimMat);
    ringB.rotation.y = Math.PI / 4;
    modelGroup.add(ringB);

    // 4. Subtle particles
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.5) * 8;
      pPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 5. Studio Three-Point Lighting
    const ambientLight = new THREE.AmbientLight(0x181a20, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd1, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const coolRimLight = new THREE.DirectionalLight(0x7395b8, 2.5);
    coolRimLight.position.set(-4, -2, -3);
    scene.add(coolRimLight);

    const warmPointLight = new THREE.PointLight(0xe8c170, 3, 8);
    warmPointLight.position.set(0, 3, 2);
    scene.add(warmPointLight);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX = (x - 0.5) * 2;
      mouseY = -(y - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      modelGroup.rotation.y = time * 0.3 + targetX * 0.8;
      modelGroup.rotation.x = Math.sin(time * 0.4) * 0.05 - targetY * 0.4;
      modelGroup.position.y = Math.sin(time * 0.8) * 0.08;

      ringA.rotation.z = time * 0.4;
      ringB.rotation.x = time * 0.3;

      particles.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] lg:h-[580px] flex items-center justify-center">
      {/*  */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Floating HUD Badges */}
      <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded text-[11px] font-mono text-neutral-300 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span></span>
      </div>

      <div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded text-[10px] font-mono text-amber-300/90 pointer-events-none border border-amber-400/20">
        ATELIER SCULPT v2.6
      </div>
    </div>
  );
};
