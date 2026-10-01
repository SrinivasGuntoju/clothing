import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

export const OrderConfirmationBox: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire confetti after a brief pause
    const confettiTimer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fef08a', '#ffffff', '#cbd5e1'],
      });
    }, 500);

    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Box Group
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    // 1. Lower Box Body
    const boxGeo = new THREE.BoxGeometry(1.6, 1.0, 1.6);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      roughness: 0.3,
      metalness: 0.7,
    });
    const boxBody = new THREE.Mesh(boxGeo, boxMat);
    boxBody.position.y = -0.5;
    boxGroup.add(boxBody);

    // Gold Ribbon around box body
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ribHoriz = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.01, 0.25), ribbonMat);
    ribHoriz.position.y = -0.5;
    boxGroup.add(ribHoriz);

    const ribVert = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.01, 1.62), ribbonMat);
    ribVert.position.y = -0.5;
    boxGroup.add(ribVert);

    // 2. Lid (Which animates open)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.05, 0);
    boxGroup.add(lidGroup);

    const lidGeo = new THREE.BoxGeometry(1.68, 0.25, 1.68);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidGroup.add(lidMesh);

    // Gold bow on lid
    const bowMesh = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 16, 32), ribbonMat);
    bowMesh.rotation.x = Math.PI / 2;
    bowMesh.position.y = 0.2;
    lidGroup.add(bowMesh);

    // Studio Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(amb);

    const key = new THREE.DirectionalLight(0xffecc2, 3);
    key.position.set(3, 4, 3);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7c94b3, 2);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    let animId: number;
    let clock = new THREE.Clock();
    let lidLiftProgress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle box rotation
      boxGroup.rotation.y = time * 0.4;

      // Animate lid opening upwards smoothly
      if (lidLiftProgress < 1) {
        lidLiftProgress = Math.min(1, lidLiftProgress + delta * 0.6);
        const ease = 1 - Math.pow(1 - lidLiftProgress, 3);
        lidGroup.position.y = 0.05 + ease * 0.9;
        lidGroup.rotation.x = -ease * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      clearTimeout(confettiTimer);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
