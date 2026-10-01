import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';
import { Product } from '../../types';

interface Product360ViewerProps {
  product: Product;
}

type MaterialFinish = 'obsidian' | 'gunmetal' | 'raw_wool' | 'sand';

export const Product360Viewer: React.FC<Product360ViewerProps> = ({ product }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<MaterialFinish>('obsidian');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const materialsRef = useRef<{ [key in MaterialFinish]: THREE.Material }>({} as any);
  const garmentMeshRef = useRef<THREE.Mesh | null>(null);
  const wireMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Create finishes
    materialsRef.current = {
      obsidian: new THREE.MeshStandardMaterial({
        color: 0x121418,
        roughness: 0.35,
        metalness: 0.65,
      }),
      gunmetal: new THREE.MeshStandardMaterial({
        color: 0x3d434f,
        roughness: 0.2,
        metalness: 0.9,
      }),
      raw_wool: new THREE.MeshStandardMaterial({
        color: 0x22242b,
        roughness: 0.9,
        metalness: 0.1,
      }),
      sand: new THREE.MeshStandardMaterial({
        color: 0x8a7f70,
        roughness: 0.6,
        metalness: 0.2,
      }),
    };

    // Product Geometry: Tailored garment silhouette
    const group = new THREE.Group();
    scene.add(group);

    // Torso / Overshirt / Jacket form
    const bodyGeo = new THREE.CylinderGeometry(1.1, 0.8, 2.2, 32, 16);
    const garmentMesh = new THREE.Mesh(bodyGeo, materialsRef.current[activeFinish]);
    garmentMeshRef.current = garmentMesh;
    group.add(garmentMesh);

    // Wireframe helper
    const wireGeo = new THREE.CylinderGeometry(1.12, 0.82, 2.22, 16, 8);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: isWireframe ? 0.8 : 0,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMeshRef.current = wireMesh;
    group.add(wireMesh);

    // Collar detail
    const collarGeo = new THREE.TorusGeometry(0.7, 0.1, 16, 32, Math.PI);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x20222a,
      roughness: 0.4,
      metalness: 0.5,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.x = Math.PI / 2.2;
    collar.position.set(0, 0.85, 0.1);
    group.add(collar);

    // Horn/Metallic Button Placket Details
    for (let i = 0; i < 4; i++) {
      const btnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
      const btnMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.1,
      });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, 0.5 - i * 0.4, 0.85);
      group.add(btn);
    }

    // Studio lighting
    const amb = new THREE.AmbientLight(0x20232a, 2);
    scene.add(amb);

    const dirLight1 = new THREE.DirectionalLight(0xfff5e6, 3);
    dirLight1.position.set(4, 4, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7391b4, 2);
    dirLight2.position.set(-4, -2, -4);
    scene.add(dirLight2);

    const goldPoint = new THREE.PointLight(0xe8c170, 2.5, 6);
    goldPoint.position.set(0, 2, 2);
    scene.add(goldPoint);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    let prevTouchX = 0;
    let prevTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevTouchX;
      const deltaY = e.touches[0].clientY - prevTouchY;
      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        group.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Material when finish changes
  useEffect(() => {
    if (garmentMeshRef.current && materialsRef.current[activeFinish]) {
      garmentMeshRef.current.material = materialsRef.current[activeFinish];
    }
  }, [activeFinish]);

  // Update Wireframe
  useEffect(() => {
    if (wireMeshRef.current) {
      const mat = wireMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isWireframe ? 0.75 : 0;
    }
  }, [isWireframe]);

  // Zoom
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newZ = Math.min(Math.max(cameraRef.current.position.z + delta, 3.2), 7.5);
    cameraRef.current.position.z = newZ;
    setZoomLevel(Math.round((7.5 - newZ) * 20 + 20));
  };

  return (
    <div className="relative w-full aspect-square bg-[#0b0c11] rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between p-4">
      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Toolbar */}
      <div className="relative z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
            360° Studio View
          </span>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            Drag to rotate in 3D
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded transition-colors ${
              autoRotate ? 'text-amber-300 bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Auto Spin"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-1.5 rounded transition-colors ${
              isWireframe ? 'text-amber-300 bg-white/10' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Wireframe Layer"
          >
            <Layers size={15} />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            className="p-1.5 text-neutral-400 hover:text-white rounded"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => handleZoom(0.5)}
            className="p-1.5 text-neutral-400 hover:text-white rounded"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
        </div>
      </div>

      {/* Bottom Material Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/70 backdrop-blur-md p-2.5 rounded-lg border border-white/10 pointer-events-auto">
        <span className="text-[11px] font-mono text-neutral-400 tracking-wider">
          FINISH:
        </span>
        <div className="flex items-center gap-2">
          {[
            { id: 'obsidian', label: 'Obsidian Matte', color: '#161820' },
            { id: 'gunmetal', label: 'Brushed Gunmetal', color: '#454c59' },
            { id: 'raw_wool', label: 'Raw Wool', color: '#272930' },
            { id: 'sand', label: 'Atelier Khaki', color: '#8a7f70' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFinish(item.id as MaterialFinish)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                activeFinish === item.id
                  ? 'bg-white/20 text-white font-medium border border-amber-400/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
