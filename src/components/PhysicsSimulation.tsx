import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const PhysicsSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[PhysicsSimulation] useEffect START - Diagnostic v4');
    if (!mountRef.current) {
      console.log('[PhysicsSimulation] mountRef.current is null, exiting useEffect early.');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0x000000, 0); // Transparent background - Original
    renderer.setClearColor(0xff0000, 1); // DEBUG: Red background
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // m/s²
    world.broadphase = new CANNON.NaiveBroadphase();

    // Materials
    const sphereMaterial = new CANNON.Material('sphereMaterial');
    const groundMaterial = new CANNON.Material('groundMaterial');
    const contactMaterial = new CANNON.ContactMaterial(groundMaterial, sphereMaterial, {
      friction: 0.0,
      restitution: 0.7, // Bounciness
    });
    world.addContactMaterial(contactMaterial);

    // Ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be horizontal
    world.addBody(groundBody);

    console.log('[PhysicsSimulation] Before sphere creation loop - Diagnostic v4');
    // Newton's Cradle Spheres
    const numSpheres = 5;
    const sphereRadius = 1;
    const sphereSpacing = 0.1; // Small gap
    const spheres: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    // const sphereThreeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }); // Original
    const sphereThreeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0.5 }); // DEBUG: Green spheres

    const cradleLength = 5; // Length of the "strings"

    for (let i = 0; i < numSpheres; i++) {
      console.log(`[PhysicsSimulation] Sphere loop iteration: ${i} - Diagnostic v4`);
      // Create Cannon.js body
      const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3((i - (numSpheres - 1) / 2) * (2 * sphereRadius + sphereSpacing), cradleLength + sphereRadius, 0),
        shape: new CANNON.Sphere(sphereRadius),
        material: sphereMaterial,
      });
      world.addBody(sphereBody);

      // Create Three.js mesh
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereThreeMaterial);
      scene.add(sphereMesh);
      spheres.push({ mesh: sphereMesh, body: sphereBody });

      // Constraint (string)
      const pivotPoint = new CANNON.Vec3((i - (numSpheres - 1) / 2) * (2 * sphereRadius + sphereSpacing), cradleLength * 2 + sphereRadius, 0);
      
      // A simpler constraint to a fixed point above each sphere
       const fixedPointBody = new CANNON.Body({ mass: 0 }); // Static body
       fixedPointBody.position.copy(pivotPoint);
       world.addBody(fixedPointBody); // Add to world so it's considered by constraint

       const distConstraint = new CANNON.DistanceConstraint(sphereBody, fixedPointBody, cradleLength);
       world.addConstraint(distConstraint);
       console.log(`[PhysicsSimulation] Sphere ${i} constrained - Diagnostic v4`);
    }
    console.log('[PhysicsSimulation] After sphere creation loop - Diagnostic v4');

    // Give the first sphere an initial impulse
    if (spheres.length > 0) {
      console.log('[PhysicsSimulation] Applying initial impulse - Diagnostic v4');
      // Ensure the impulse is applied to the sphere's center of mass or a valid point if not the center.
      // For a simple sphere, its own position is fine for applying a directional impulse.
      spheres[0].body.applyImpulse(new CANNON.Vec3(-10, 0, 0), spheres[0].body.position);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Step the physics world
      world.step(1 / 60);

      // Update Three.js meshes
      spheres.forEach(s => {
        s.mesh.position.copy(s.body.position as unknown as THREE.Vector3);
        s.mesh.quaternion.copy(s.body.quaternion as unknown as THREE.Quaternion);
      });

      renderer.render(scene, camera);
    };

    console.log('[PhysicsSimulation] Starting animation loop - Diagnostic v4');
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('[PhysicsSimulation] useEffect cleanup - Diagnostic v4');
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      // TODO: Consider also cleaning up Cannon.js world, bodies, shapes, materials, constraints
    };
  }, []);

  // return <div ref={mountRef} className="fixed inset-0 z-[-2]" />; // Original
  return <div ref={mountRef} className="fixed inset-0 z-[999]" />; // DEBUG: Bring to front
};

export default PhysicsSimulation;
