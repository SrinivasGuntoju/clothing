import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CinematicIntroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setShowCinematicIntro, setIsAuthOpen, setAuthMode, setActiveView } = useShop();
  const [isRevealed, setIsRevealed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    // Reveal text after small delay
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090c, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 1. Group for Fashion Geometry
    const fashionGroup = new THREE.Group();
    scene.add(fashionGroup);

    // Mannequin Torso / Modern Sculptural Fashion Silhouette
    // Shoulders & Chest
    const torsoGeo = new THREE.CylinderGeometry(1.4, 0.9, 2.4, 32, 8);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x161820,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = -0.3;
    fashionGroup.add(torsoMesh);

    // Wireframe overlay for futuristic holographic feel
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.Mesh(torsoGeo, wireMat);
    wireMesh.position.y = -0.3;
    wireMesh.scale.set(1.02, 1.02, 1.02);
    fashionGroup.add(wireMesh);

    // Architectural Collar & Lapel accents
    const collarGeo = new THREE.TorusGeometry(0.8, 0.12, 16, 64, Math.PI);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe5c07b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.rotation.x = Math.PI / 2.3;
    collarMesh.position.set(0, 0.9, 0.1);
    fashionGroup.add(collarMesh);

    // Floating Orbiting Luxury Rings / Astrolabe Rings
    const ringGeo1 = new THREE.TorusGeometry(2.5, 0.03, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, goldMat);
    ring1.rotation.x = Math.PI / 4;
    fashionGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x8a92a5,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    fashionGroup.add(ring2);

    // 2. Soft Gold & White Dust Particles
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
      particleScales[i / 3] = Math.random() * 0.04 + 0.01;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe6cf8b,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Three-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1c24, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 3.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x738ba5, 1.8);
    fillLight.position.set(-5, 0, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xe8c170, 4, 10);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Group rotation
      fashionGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.5;
      fashionGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08 - targetY * 0.3;
      fashionGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.12;

      // Rings spin
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.x = elapsedTime * 0.28;

      // Particle floating
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleEnterStore = () => {
    try {
      sessionStorage.setItem('venaro_intro_seen', 'true');
    } catch {}
    setShowCinematicIntro(false);
    setActiveView('home');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    try {
      sessionStorage.setItem('venaro_intro_seen', 'true');
    } catch {}
    setShowCinematicIntro(false);
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090c] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/40 to-[#08090c]/90 pointer-events-none z-1" />

      {/* Top Header Zone */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="text-xl font-brand tracking-[0.25em] text-white font-bold">
            VÉNARO
          </span>
          <span className="text-[10px] tracking-widest text-amber-300/80 uppercase font-mono px-2 py-0.5 rounded border border-amber-400/20 bg-amber-400/5">
            ATELIER 2026
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 text-white/50 hover:text-white transition-colors"
            title={audioEnabled ? 'Mute ambient' : 'Ambient sound'}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={handleEnterStore}
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Skip Intro
          </button>
        </div>
      </header>

      {/* Central Brand Identity Revelation */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto my-auto pointer-events-auto">
        <div
          className={`transition-all duration-1000 transform ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/90 mb-4 font-mono">
            Haute Menswear & Spatial Engineering
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-brand tracking-[0.2em] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 mb-6 drop-shadow-2xl">
            VÉNARO
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-display tracking-[0.3em] uppercase text-neutral-300 font-medium mb-10 max-w-xl mx-auto">
            "DEFINE YOUR EVERYDAY."
          </p>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <button
              onClick={handleEnterStore}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase rounded hover:bg-neutral-200 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-white/10 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900/80 backdrop-blur-md text-white font-medium text-xs tracking-[0.2em] uppercase rounded border border-white/15 hover:border-amber-400/40 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span>Already a client?</span>
            <button
              onClick={() => handleOpenAuth('login')}
              className="text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Footer Markers */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 py-6 text-xs text-white/40 tracking-wider max-w-7xl mx-auto w-full font-mono">
        <div>MILAN · TOKYO · MUMBAI · NEW YORK</div>
        <div className="mt-2 sm:mt-0">© 2026 VÉNARO S.P.A. ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
};
