import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface InteractiveParticleSystemProps {
  onError?: () => void;
}

const InteractiveParticleSystem: React.FC<InteractiveParticleSystemProps> = ({ onError }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let animationFrameId: number;

    const init = () => {
      try {
        // Scene setup
        scene = new THREE.Scene();

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50; // Adjusted for better particle visibility

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current?.appendChild(renderer.domElement);

        // Particle setup
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3); // For color variation

        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 100; // Spread particles
          colors[i] = Math.random(); // Random initial colors
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


        const material = new THREE.PointsMaterial({
          size: 0.15, // Particle size
          vertexColors: true, // Use per-vertex colors
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending, // For a glowing effect
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Mouse interaction setup
        document.addEventListener('mousemove', onMouseMove, false);

        // Animation loop
        animate();

      } catch (error) {
        console.error('Error initializing Three.js scene:', error);
        if (onError) {
          onError();
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      // Simple interaction: move particles based on mouse
      // More complex interactions can be added here
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      if (particles) {
        // Example: Rotate particles based on mouse position
         particles.rotation.x = mouseY * 0.2;
         particles.rotation.y = mouseX * 0.2;
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Particle animation (e.g., gentle movement)
      if (particles) {
        particles.rotation.z += 0.001; // Slow rotation

        // Animate individual particles (optional, can be performance intensive)
        // const positions = particles.geometry.attributes.position.array as Float32Array;
        // for (let i = 0; i < positions.length; i += 3) {
        //   positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.01;
        // }
        // particles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    window.addEventListener('resize', handleResize, false);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current?.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (particles && particles.geometry) {
        particles.geometry.dispose();
      }
      if (particles && particles.material) {
        // Check if material is an array or single
        if (Array.isArray(particles.material)) {
          particles.material.forEach(mat => mat.dispose());
        } else {
          (particles.material as THREE.Material).dispose();
        }
      }
      if (scene) {
        // Dispose of all scene children
        while(scene.children.length > 0){ 
            const object = scene.children[0];
            if(object instanceof THREE.Mesh || object instanceof THREE.Points) {
                if(object.geometry) object.geometry.dispose();
                if(Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else if (object.material) {
                    (object.material as THREE.Material).dispose();
                }
            }
            scene.remove(object); 
        }
      }
    };
  }, [onError]);

  return <div ref={mountRef} className="fixed inset-0 z-[-1]" />; // Ensure it's behind other content
};

export default InteractiveParticleSystem;
