import React, { useRef, useEffect, useState, useCallback } from 'react';

// Black hole particle system configuration
const PARTICLE_COUNT = 300; // Increased for more fluid ring effect
const CENTER_PARTICLES = 20; // Central black hole particles
const RING_PARTICLES = 180; // Dedicated particles for Saturn-like rings
const PARTICLE_BASE_SIZE = 1.6;
const PARTICLE_VARIATION = 0.6;
const CONNECTION_DISTANCE = 40; // Reduced for more precise connections in rings
const CONNECTION_OPACITY_DIVIDER = 100; // Adjusted for better ring opacity
const TRAIL_LENGTH = 6; // Increased for smoother motion trails
const INTERACTION_RADIUS = 180;
const WAVE_SPEED = 0.0015;
const SWIRL_STRENGTH = 0.045; // Reduced to prevent excessive particle speed near center
const PULSE_FREQUENCY = 0.0005;
const GLOW_SIZE = 16;
const BLACK_HOLE_RADIUS = 50; // Size of the central black hole
const ACCRETION_DISK_INNER = 65; // Inner radius of accretion disk
const ACCRETION_DISK_OUTER = 220; // Outer radius of accretion disk
const RING_GAP_SIZE = 15; // Size of gaps between rings
const NUM_RINGS = 3; // Number of distinct Saturn-like rings
const FLOW_FIELD_RESOLUTION = 25; // Balance between detail and performance
const FLOW_FIELD_STRENGTH = 0.015;
const PARTICLE_SPEED_MIN = 0.5;
const PARTICLE_SPEED_MAX = 2.2;
const ENERGY_WAVE_SPEED = 0.0003;
const FRAME_SKIP = 2; // Only draw connections every few frames

// Location information
const LOCATION = "Brentwood, Tennessee";

// Enhanced black hole color theme
const COLORS = {
  primary: { r: 142, g: 95, b: 250, a: 0.7 },     // Enhanced purple
  secondary: { r: 165, g: 82, b: 255, a: 0.75 },  // Enhanced indigo
  accent: { r: 225, g: 75, b: 245, a: 0.8 },      // Vibrant fuchsia
  energy: { r: 210, g: 120, b: 255, a: 0.85 },    // Energy pulse color
  glow: { r: 142, g: 95, b: 250, a: 0.2 },        // Glow effect base
  core: { r: 20, g: 10, b: 30, a: 0.95 },         // Black hole core
  accretionDisk: { r: 180, g: 100, b: 255, a: 0.7 }, // Accretion disk
  ambient: { r: 35, g: 10, b: 60, a: 0.04 }       // Ambient background tint
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function distanceSq(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(distanceSq(x1, y1, x2, y2));
}

// Required enums and interfaces
enum ParticleDistribution {
  ACCRETION_DISK,
  CENTRAL_CORE,
  OUTER_FIELD,
  RING_INNER,
  RING_MIDDLE,
  RING_OUTER
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  angle: number;
  orbitSpeed: number;
  speed: number;
  size: number;
  color: { r: number; g: number; b: number; a: number };
  trail: { x: number; y: number; a: number }[];
  pulse: number;
  energyLevel: number;
  flowOffset: number;
  distribution: ParticleDistribution;
  distanceFromCenter: number;
}

interface FlowVector {
  angle: number;
  strength: number;
}

interface InteractiveParticleBackgroundProps {
  parentRef: React.RefObject<HTMLElement>;
}

const InteractiveParticleBackground: React.FC<InteractiveParticleBackgroundProps> = ({ parentRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 });
  const animationId = useRef<number>();
  const flowField = useRef<FlowVector[][]>([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const timeRef = useRef(0);
  const energyWaveRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFrameTime = useRef<number>(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Helper function to blend colors
  const blendColors = (color1: typeof COLORS.primary, color2: typeof COLORS.primary, ratio: number) => {
    return {
      r: Math.floor(color1.r * (1 - ratio) + color2.r * ratio),
      g: Math.floor(color1.g * (1 - ratio) + color2.g * ratio),
      b: Math.floor(color1.b * (1 - ratio) + color2.b * ratio),
      a: color1.a * (1 - ratio) + color2.a * ratio
    };  };
  
  // Generate flow field for particle movement
  const generateFlowField = useCallback((width: number, height: number, time: number) => {
    const cols = Math.ceil(width / FLOW_FIELD_RESOLUTION);
    const rows = Math.ceil(height / FLOW_FIELD_RESOLUTION);
    const field: FlowVector[][] = [];
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let x = 0; x < cols; x++) {
      field[x] = [];
      for (let y = 0; y < rows; y++) {
        // Physical coordinates
        const physX = x * FLOW_FIELD_RESOLUTION;
        const physY = y * FLOW_FIELD_RESOLUTION;
        
        // Distance from center
        const dx = physX - centerX;
        const dy = physY - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        // Base rotation angle (perpendicular to radial direction)
        const baseAngle = Math.atan2(dy, dx) + Math.PI / 2;
        
        // Increasing spin velocity toward center (like a black hole)
        const spinFactor = Math.min(1, 100 / (distFromCenter + 10));
        
        // Time-based variations
        const timeFactor = Math.sin(time * 0.0002 + distFromCenter * 0.01);
        
        // Combined angle with time-varying component
        const angle = baseAngle + timeFactor * 0.2;
        
        // Strength decreases with distance from center
        const strength = FLOW_FIELD_STRENGTH * (0.3 + spinFactor * 0.7);
        
        field[x][y] = { angle, strength };
      }
    }
    
    return field;
  }, []);
    // Basic placeholder effect to avoid syntax errors
  useEffect(() => {
    if (!parentRef?.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set dimensions based on parent
    const updateSize = () => {
      if (!parentRef.current || !canvasRef.current) return;
      const { width, height } = parentRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    };
    
    updateSize();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) updateSize();
    });
    
    resizeObserver.observe(parentRef.current);    // Track mouse movements for interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !parentRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const inBounds = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      
      setIsInteracting(inBounds);
      
      if (inBounds) {
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        
        mouse.current.vx = newX - mouse.current.x;
        mouse.current.vy = newY - mouse.current.y;
        mouse.current.lastX = mouse.current.x;
        mouse.current.lastY = mouse.current.y;
        mouse.current.x = newX;
        mouse.current.y = newY;
        
        // Debug mouse movement
        if (frameCountRef.current % 30 === 0) {
          console.log(`Mouse: ${newX.toFixed(1)}, ${newY.toFixed(1)}, Speed: ${Math.sqrt(mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy).toFixed(1)}`);
        }
      } else {
        mouse.current.x = -1000;
        mouse.current.y = -1000;
      }
    };

    const handleMouseEnter = () => {
      setIsInteracting(true);
      console.log('Mouse entered particle canvas');
    };

    const handleMouseLeave = () => {
      setIsInteracting(false);
      mouse.current.x = -1000;
      mouse.current.y = -1000;
      console.log('Mouse left particle canvas');
    };
    
    // Add event listeners to canvas for better interaction
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Initialize flow field
    const width = canvas.width;
    const height = canvas.height;
    flowField.current = generateFlowField(width, height, 0);
    
    // Initialize particles if they don't already exist
    if (!particles.current.length) {
      const createParticle = (distribution: ParticleDistribution): Particle => {
        const centerX = width / 2;
        const centerY = height / 2;
        
        let x = 0, y = 0, distanceFromCenter = 0;
        let size = PARTICLE_BASE_SIZE + Math.random() * PARTICLE_VARIATION;
        let color = { ...COLORS.primary };
        let angle = Math.random() * Math.PI * 2;
        let orbitSpeed = randomBetween(0.008, 0.02) * (Math.random() > 0.5 ? 1 : -1);
        
        // Position based on distribution
        switch (distribution) {
          case ParticleDistribution.CENTRAL_CORE:
            distanceFromCenter = randomBetween(5, BLACK_HOLE_RADIUS * 0.7);
            color = { ...COLORS.accent, a: 0.6 };
            size *= 0.8;
            break;
            
          case ParticleDistribution.RING_INNER:
            distanceFromCenter = randomBetween(ACCRETION_DISK_INNER, ACCRETION_DISK_INNER + 20);
            color = { ...COLORS.primary, a: 0.7 };
            break;
            
          case ParticleDistribution.RING_MIDDLE:
            distanceFromCenter = randomBetween(ACCRETION_DISK_INNER + RING_GAP_SIZE + 20, ACCRETION_DISK_INNER + RING_GAP_SIZE + 45);
            color = { ...COLORS.secondary, a: 0.75 };
            break;
            
          case ParticleDistribution.RING_OUTER:
            distanceFromCenter = randomBetween(ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 45, ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 75);
            color = { ...COLORS.energy, a: 0.65 };
            break;
            
          case ParticleDistribution.ACCRETION_DISK:
            distanceFromCenter = randomBetween(ACCRETION_DISK_INNER + 10, ACCRETION_DISK_OUTER - 10);
            // Avoid placing disk particles in the ring areas
            while (
              (distanceFromCenter > ACCRETION_DISK_INNER - 10 && distanceFromCenter < ACCRETION_DISK_INNER + 30) ||
              (distanceFromCenter > ACCRETION_DISK_INNER + RING_GAP_SIZE + 10 && distanceFromCenter < ACCRETION_DISK_INNER + RING_GAP_SIZE + 50) ||
              (distanceFromCenter > ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 40 && distanceFromCenter < ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 80)
            ) {
              distanceFromCenter = randomBetween(ACCRETION_DISK_INNER + 10, ACCRETION_DISK_OUTER - 10);
            }
            color = { ...COLORS.accretionDisk, a: 0.7 };
            orbitSpeed *= 1.2;
            break;
            
          case ParticleDistribution.OUTER_FIELD:
          default:
            distanceFromCenter = randomBetween(ACCRETION_DISK_OUTER * 1.1, Math.min(width, height) * 0.42);
            color = { ...COLORS.primary, a: 0.5 };
            break;
        }
        
        // Set position based on angle and distance
        x = centerX + Math.cos(angle) * distanceFromCenter;
        y = centerY + Math.sin(angle) * distanceFromCenter;
        
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
          angle,
          orbitSpeed,
          speed: randomBetween(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX),
          size,
          color,
          trail: Array(TRAIL_LENGTH).fill(null).map(() => ({ x, y, a: 1.0 })),
          pulse: Math.random() * Math.PI * 2,
          energyLevel: Math.random() * 0.5,
          flowOffset: Math.random() * Math.PI * 2,
          distribution,
          distanceFromCenter
        };
      };
      
      // Create particles in each distribution zone
      const allParticles: Particle[] = [];
      
      // Central core particles
      for (let i = 0; i < CENTER_PARTICLES; i++) {
        allParticles.push(createParticle(ParticleDistribution.CENTRAL_CORE));
      }
      
      // Create Saturn-like rings with distinct gaps between them
      const ringParticlesPerRing = Math.floor(RING_PARTICLES / NUM_RINGS);
      
      // Inner ring (densest)
      for (let i = 0; i < ringParticlesPerRing + 15; i++) {
        allParticles.push(createParticle(ParticleDistribution.RING_INNER));
      }
      
      // Middle ring
      for (let i = 0; i < ringParticlesPerRing; i++) {
        allParticles.push(createParticle(ParticleDistribution.RING_MIDDLE));
      }
      
      // Outer ring
      for (let i = 0; i < ringParticlesPerRing - 15; i++) {
        allParticles.push(createParticle(ParticleDistribution.RING_OUTER));
      }
      
      // Accretion disk particles
      const diskParticles = Math.floor((PARTICLE_COUNT - RING_PARTICLES - CENTER_PARTICLES) * 0.7);
      for (let i = 0; i < diskParticles; i++) {
        allParticles.push(createParticle(ParticleDistribution.ACCRETION_DISK));
      }
      
      // Outer field particles
      const outerParticles = PARTICLE_COUNT - CENTER_PARTICLES - RING_PARTICLES - diskParticles;
      for (let i = 0; i < outerParticles; i++) {
        allParticles.push(createParticle(ParticleDistribution.OUTER_FIELD));
      }
      
      particles.current = allParticles;
    }
      // Draw background and black hole
    const drawBackground = () => {
      if (!ctx) return;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set composite operation for proper blending
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw black hole core using radial gradient
      const blackHoleGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, BLACK_HOLE_RADIUS
      );
      blackHoleGradient.addColorStop(0, `rgba(${COLORS.core.r}, ${COLORS.core.g}, ${COLORS.core.b}, ${COLORS.core.a})`);
      blackHoleGradient.addColorStop(0.7, `rgba(${COLORS.core.r}, ${COLORS.core.g}, ${COLORS.core.b}, ${COLORS.core.a * 0.9})`);
      blackHoleGradient.addColorStop(1, `rgba(${COLORS.core.r}, ${COLORS.core.g}, ${COLORS.core.b}, 0)`);
      
      ctx.beginPath();
      ctx.fillStyle = blackHoleGradient;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw event horizon ring
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, 0.2)`;
      ctx.lineWidth = 1.5;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      
      // Ambient glow around black hole
      const ambientGlow = ctx.createRadialGradient(
        centerX, centerY, BLACK_HOLE_RADIUS,
        centerX, centerY, width * 0.7
      );
      ambientGlow.addColorStop(0, `rgba(${COLORS.ambient.r}, ${COLORS.ambient.g}, ${COLORS.ambient.b}, ${COLORS.ambient.a * 3})`);
      ambientGlow.addColorStop(0.2, `rgba(${COLORS.ambient.r}, ${COLORS.ambient.g}, ${COLORS.ambient.b}, ${COLORS.ambient.a * 1.5})`);
      ambientGlow.addColorStop(1, `rgba(${COLORS.ambient.r}, ${COLORS.ambient.g}, ${COLORS.ambient.b}, 0)`);
      
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);
      
      // Light distortion effect around black hole
      ctx.globalCompositeOperation = 'lighter';
      const distortionGlow = ctx.createRadialGradient(
        centerX, centerY, BLACK_HOLE_RADIUS * 0.8, 
        centerX, centerY, BLACK_HOLE_RADIUS * 1.5
      );
      distortionGlow.addColorStop(0, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, 0.02)`);
      distortionGlow.addColorStop(1, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, 0)`);
      
      ctx.beginPath();
      ctx.fillStyle = distortionGlow;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS * 1.5, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Draw energy waves and gravitational distortion effects
    const drawEnergyWave = () => {
      if (!ctx) return;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Always draw a subtle gravitational wave from the black hole center
      const blackHoleWave = ctx.createRadialGradient(
        centerX, 
        centerY, 
        BLACK_HOLE_RADIUS,
        centerX,
        centerY,
        BLACK_HOLE_RADIUS * (2 + Math.sin(energyWaveRef.current * 0.5) * 0.5)
      );
      
      const bhWaveOpacity = (Math.sin(energyWaveRef.current) + 1) * 0.03;
      blackHoleWave.addColorStop(0, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, ${bhWaveOpacity * 2})`);
      blackHoleWave.addColorStop(0.7, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, ${bhWaveOpacity})`);
      blackHoleWave.addColorStop(1, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, 0)`);
      
      ctx.beginPath();
      ctx.fillStyle = blackHoleWave;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Light distortion ring effect
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${COLORS.ambient.r}, ${COLORS.ambient.g}, ${COLORS.ambient.b}, ${0.05 + Math.sin(energyWaveRef.current * 2) * 0.05})`;
      ctx.lineWidth = 2 + Math.sin(energyWaveRef.current) * 1;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS * (1.5 + Math.sin(energyWaveRef.current * 0.7) * 0.3), 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw user interaction wave
      if (isInteracting && mouse.current.x !== -1000) {
        const energyWave = ctx.createRadialGradient(
          mouse.current.x, 
          mouse.current.y, 
          0,
          mouse.current.x,
          mouse.current.y,
          INTERACTION_RADIUS * (0.5 + Math.sin(energyWaveRef.current * 1.5) * 0.5)
        );
        
        const waveOpacity = (Math.sin(energyWaveRef.current * 2) + 1) * 0.06;
        energyWave.addColorStop(0, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, ${waveOpacity * 2.5})`);
        energyWave.addColorStop(0.5, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, ${waveOpacity})`);
        energyWave.addColorStop(1, `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = energyWave;
        ctx.arc(mouse.current.x, mouse.current.y, INTERACTION_RADIUS * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connection between mouse and black hole center - gravitational lens effect
        const distToCenter = distance(mouse.current.x, mouse.current.y, centerX, centerY);
        if (distToCenter < width / 2) {
          const connectionOpacity = 0.08 * Math.max(0, 1 - (distToCenter / (width / 2)));
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLORS.energy.r}, ${COLORS.energy.g}, ${COLORS.energy.b}, ${connectionOpacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }
      }
    };
    
    // Draw connections between particles
    const drawConnections = () => {
      if (!ctx) return;
      if (frameCountRef.current % FRAME_SKIP !== 0) return;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Group particles by distribution type
      const ringInnerParticles: Particle[] = [];
      const ringMiddleParticles: Particle[] = [];
      const ringOuterParticles: Particle[] = [];
      const diskParticles: Particle[] = [];
      const outerParticles: Particle[] = [];
      
      for (const p of particles.current) {
        switch (p.distribution) {
          case ParticleDistribution.RING_INNER:
            ringInnerParticles.push(p);
            break;
          case ParticleDistribution.RING_MIDDLE:
            ringMiddleParticles.push(p);
            break;
          case ParticleDistribution.RING_OUTER:
            ringOuterParticles.push(p);
            break;
          case ParticleDistribution.ACCRETION_DISK:
            diskParticles.push(p);
            break;
          case ParticleDistribution.OUTER_FIELD:
            outerParticles.push(p);
            break;
        }
      }
      
      // Sort disk particles by angle around center for better connections
      const sortByAngle = (a: Particle, b: Particle) => {
        const angleA = Math.atan2(a.y - centerY, a.x - centerX);
        const angleB = Math.atan2(b.y - centerY, b.x - centerX);
        return angleA - angleB;
      };
      
      ringInnerParticles.sort(sortByAngle);
      ringMiddleParticles.sort(sortByAngle);
      ringOuterParticles.sort(sortByAngle);
      diskParticles.sort(sortByAngle);
      
      // Draw specialized connections for each ring to create Saturn-like rings
      const drawRing = (particles: Particle[], thickness: number, opacityMult: number, maxDist: number) => {
        ctx.beginPath();
        let firstDraw = true;
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const next = particles[(i + 1) % particles.length];
          
          const dist = distance(p.x, p.y, next.x, next.y);
          if (dist > maxDist) continue;
          
          if (firstDraw) {
            ctx.moveTo(p.x, p.y);
            firstDraw = false;
          }
          
          ctx.lineTo(next.x, next.y);
        }
        
        if (!firstDraw) {
          // Determine ring intensity based on energy levels
          const energyFactor = particles.reduce((sum, p) => sum + p.energyLevel, 0) / particles.length;
          const baseOpacity = 0.1 * opacityMult;
          
          // Color intensity varies based on the current time
          const colorIntensity = Math.sin(energyWaveRef.current * 2) * 20;
          
          // Determine ring color based on which ring
          let ringColor;
          if (particles === ringInnerParticles) {
            ringColor = COLORS.secondary;
          } else if (particles === ringOuterParticles) {
            ringColor = COLORS.accent;
          } else {
            ringColor = {
              r: 165 + colorIntensity,
              g: 100 + colorIntensity * 0.5,
              b: 245 + colorIntensity,
              a: baseOpacity
            };
          }
          
          ctx.lineWidth = thickness;
          ctx.strokeStyle = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${baseOpacity * (0.8 + energyFactor * 0.2)})`;
          ctx.stroke();
        }
      };
      
      // Draw the rings
      drawRing(ringInnerParticles, 1.4, 0.7, 45); // Inner ring - brightest, thickest
      drawRing(ringMiddleParticles, 1.2, 0.65, 30); // Middle ring
      drawRing(ringOuterParticles, 1.0, 0.6, 15); // Outer ring - thinnest, less bright
      
      // Draw accretion disk connections
      for (let i = 0; i < diskParticles.length; i++) {
        const p1 = diskParticles[i];
        // Connect to next particle in the sorted array
        const p2 = diskParticles[(i + 1) % diskParticles.length];
        
        const distFromCenter1 = distance(p1.x, p1.y, centerX, centerY);
        const distFromCenter2 = distance(p2.x, p2.y, centerX, centerY);
        
        // Only connect particles in similar orbits
        if (Math.abs(distFromCenter1 - distFromCenter2) < ACCRETION_DISK_OUTER * 0.25) {
          const dist = distance(p1.x, p1.y, p2.x, p2.y);
          
          if (dist < CONNECTION_DISTANCE * 1.5) {
            const opacity = (CONNECTION_DISTANCE * 1.5 - dist) / CONNECTION_OPACITY_DIVIDER;
            
            // Energy factor based on distance from center
            const centerDistFactor = 1 - (Math.min(distFromCenter1, distFromCenter2) - ACCRETION_DISK_INNER) / 
                                  (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER);
            const energyFactor = Math.max(0.4, centerDistFactor) * 
                             Math.max(p1.energyLevel, p2.energyLevel);
            
            // Use accretion disk color with energy boost
            let basedColor = COLORS.accretionDisk;
            if (energyFactor > 0.7) {
              basedColor = COLORS.energy;
            } else if (energyFactor > 0.5) {
              basedColor = COLORS.accent;
            }
            
            ctx.beginPath();
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = `rgba(${basedColor.r}, ${basedColor.g}, ${basedColor.b}, ${opacity * basedColor.a * 1.2})`;
            
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw connections for outer particles (sparser)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < outerParticles.length; i += 2) {
        const p1 = outerParticles[i];
        
        for (let j = i + 2; j < outerParticles.length; j += 2) {
          const p2 = outerParticles[j];
          const distSq = distanceSq(p1.x, p1.y, p2.x, p2.y);
          
          // Distance check using square of distance (more efficient)
          const connectionDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (CONNECTION_DISTANCE - dist) / CONNECTION_OPACITY_DIVIDER;
            const energyFactor = (p1.energyLevel + p2.energyLevel) * 0.5;
            let basedColor;
            if (energyFactor > 0.5) {
              basedColor = COLORS.energy;
            } else {
              basedColor = blendColors(p1.color, p2.color, 0.5);
            }
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${basedColor.r}, ${basedColor.g}, ${basedColor.b}, ${opacity * basedColor.a * 0.7})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Update a particle's physics with black hole gravitational effects
    const updateParticle = (p: Particle, dt: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Update pulse phase and energy based on position in system
      p.pulse += PULSE_FREQUENCY * dt * p.speed;
      
      // Dynamic energy based on type and position
      const distFromCenter = distance(p.x, p.y, centerX, centerY);
      p.distanceFromCenter = distFromCenter; // Store for later use
      
      // Energy dissipation - different rates for different particles
      if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        p.energyLevel = Math.max(0.1, p.energyLevel * 0.998);
      } else if (p.distribution === ParticleDistribution.RING_INNER ||
                p.distribution === ParticleDistribution.RING_MIDDLE ||
                p.distribution === ParticleDistribution.RING_OUTER) {
        p.energyLevel = Math.max(0.1, p.energyLevel * 0.994);
      } else {
        p.energyLevel = Math.max(0.1, p.energyLevel * 0.996);
      }
        // Orbital motion - based on angle and distance from center
      // This creates the basic circular orbit of particles
      p.angle += p.orbitSpeed * dt;
      
      // Update base positions for orbital motion
      const targetRadius = distance(p.baseX, p.baseY, centerX, centerY);
      p.baseX = centerX + Math.cos(p.angle) * targetRadius;
      p.baseY = centerY + Math.sin(p.angle) * targetRadius;
      
      // Flow field influence - only apply to non-ring particles for more stability in rings
      if (p.distribution !== ParticleDistribution.RING_INNER && 
          p.distribution !== ParticleDistribution.RING_MIDDLE && 
          p.distribution !== ParticleDistribution.RING_OUTER) {
        
        const cellSize = width / FLOW_FIELD_RESOLUTION;
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);
        
        // Only apply flow field if within bounds
        if (col >= 0 && col < FLOW_FIELD_RESOLUTION && row >= 0 && row < FLOW_FIELD_RESOLUTION) {
          const flowVector = flowField.current[row][col];
          
          // Use flowOffset for more varied motion
          const flowAngle = flowVector.angle + p.flowOffset;
          const flowStrength = flowVector.strength * FLOW_FIELD_STRENGTH * dt;
          
          p.ax += Math.cos(flowAngle) * flowStrength;
          p.ay += Math.sin(flowAngle) * flowStrength;
        }
      }
      
      // Mouse interaction for particles
      if (isInteracting && mouse.current.x !== -1000) {
        const distToMouse = distance(p.x, p.y, mouse.current.x, mouse.current.y);
        
        if (distToMouse < INTERACTION_RADIUS) {
          // Calculate angle from mouse to particle
          const angle = Math.atan2(p.y - mouse.current.y, p.x - mouse.current.x);
          
          // Force decreases with distance
          const force = (INTERACTION_RADIUS - distToMouse) / INTERACTION_RADIUS;
          
          // Velocity factor - particles respond more to fast mouse movements
          const mouseSpeed = Math.sqrt(mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy);
          const velocityFactor = Math.min(2, mouseSpeed * 0.2);
          
          // Different behaviors based on particle type
          switch (p.distribution) {
            case ParticleDistribution.CENTRAL_CORE: {
              // Central core particles get energized but don't move much
              p.energyLevel = Math.min(0.95, p.energyLevel + force * 0.1);
              break;
            }
            
            case ParticleDistribution.RING_INNER:
            case ParticleDistribution.RING_MIDDLE:
            case ParticleDistribution.RING_OUTER: {
              // Ring particles react by creating wave-like patterns along the ring
              // Calculate distance along the ring from the mouse angle
              const mouseAngle = Math.atan2(mouse.current.y - centerY, mouse.current.x - centerX);
              const particleAngle = Math.atan2(p.y - centerY, p.x - centerX);
              
              // Normalize angle difference to [-PI, PI]
              let angleDiff = particleAngle - mouseAngle;
              while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
              while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
              
              // Create a ripple effect based on angle difference
              const dist = Math.abs(angleDiff) * p.distanceFromCenter; // Convert angle to distance along circumference
              const ripplePhase = (timeRef.current * WAVE_SPEED) - (dist * 0.02);
              const rippleAmp = 0.2 * force * Math.sin(ripplePhase * 8);
              const waveEffect = Math.max(0, Math.cos(ripplePhase * 4) * force * 0.5);
              
              // Apply wave effect perpendicular to radial direction (along the ring)
              const radialAngle = Math.atan2(p.y - centerY, p.x - centerX);
              const perpRadial = radialAngle + Math.PI/2;
              
              // Scale effect by distance from mouse for smoother falloff
              const distanceFactor = 1 - (dist / INTERACTION_RADIUS);
              
              // Create more fluid spiral waves in the rings - mostly tangential motion
              p.ax += Math.cos(perpRadial) * force * (0.1 + rippleAmp) * dt * distanceFactor;
              p.ay += Math.sin(perpRadial) * force * (0.1 + rippleAmp) * dt * distanceFactor;
              
              // Very small radial component for subtle 3D-like displacement
              p.ax += Math.cos(radialAngle) * force * 0.02 * Math.sin(ripplePhase * 2) * dt * distanceFactor;
              p.ay += Math.sin(radialAngle) * force * 0.02 * Math.sin(ripplePhase * 2) * dt * distanceFactor;
              
              // Energy boost creates illumination in the rings - propagates along the ring
              p.energyLevel = Math.min(0.9, p.energyLevel + waveEffect * force * 0.15);
              break;
            }
            
            case ParticleDistribution.ACCRETION_DISK: {
              // Accretion disk particles react strongly to mouse
              // Swirling motion predominates (like matter being pulled into orbit)
              const perpAngle = angle + Math.PI / 2;
              p.ax += Math.cos(perpAngle) * force * 0.5 * dt * (1 + velocityFactor);
              p.ay += Math.sin(perpAngle) * force * 0.5 * dt * (1 + velocityFactor);
              
              // Slight repulsion/attraction based on mouse velocity direction
              const mouseDirection = Math.atan2(mouse.current.vy, mouse.current.vx);
              const mouseForce = Math.cos(angle - mouseDirection) * force * 0.2 * dt;
              
              p.ax += Math.cos(angle) * mouseForce;
              p.ay += Math.sin(angle) * mouseForce;
              
              // Higher energy boost
              p.energyLevel = Math.min(0.95, p.energyLevel + force * 0.1 * (1 + velocityFactor));
              break;
            }
            
            default: {
              // Other particles have standard repulsion/attraction
              p.ax += Math.cos(angle) * force * 0.15 * dt;
              p.ay += Math.sin(angle) * force * 0.15 * dt;
              
              // Standard swirl
              const perpAngle = angle + Math.PI / 2;
              p.ax += Math.cos(perpAngle) * force * 0.25 * dt;
              p.ay += Math.sin(perpAngle) * force * 0.25 * dt;
              
              // Standard energy boost
              p.energyLevel = Math.min(0.8, p.energyLevel + force * 0.05);
              break;
            }
          }
        }
      }
      
      // Spring back to base position with variable strength
      let springForce;
      if (p.distribution === ParticleDistribution.CENTRAL_CORE) {
        springForce = 0.02;
      } else if (p.distribution === ParticleDistribution.RING_INNER || 
                p.distribution === ParticleDistribution.RING_MIDDLE || 
                p.distribution === ParticleDistribution.RING_OUTER) {
        // Stronger spring force for ring particles to maintain stable orbits
        springForce = 0.15;
      } else if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        springForce = 0.015;
      } else {
        springForce = 0.01;
      }
      
      // Apply spring force
      p.ax += (p.baseX - p.x) * springForce * dt;
      p.ay += (p.baseY - p.y) * springForce * dt;
        // Global swirl with black hole rotation effect
      const swirlAngle = Math.atan2(p.y - centerY, p.x - centerX) + Math.PI / 2;
      
      // Prevent particles moving too fast near the black hole
      const swirlDistanceRatio = (distFromCenter - BLACK_HOLE_RADIUS) / (ACCRETION_DISK_OUTER - BLACK_HOLE_RADIUS);
      const cappedDistanceRatio = Math.max(0.15, swirlDistanceRatio);
      const swirlFactor = Math.min(1.5, 1 / (cappedDistanceRatio * 2));
      
      p.ax += Math.cos(swirlAngle) * SWIRL_STRENGTH * swirlFactor * dt * 0.8;
      p.ay += Math.sin(swirlAngle) * SWIRL_STRENGTH * swirlFactor * dt * 0.8;
      
      // Update velocity
      p.vx += p.ax;
      p.vy += p.ay;
      
      // Reset acceleration
      p.ax = 0;
      p.ay = 0;
      
      // Variable damping based on distance from center and particle type
      let dampingFactor;
      
      if (p.distribution === ParticleDistribution.RING_INNER || 
          p.distribution === ParticleDistribution.RING_MIDDLE || 
          p.distribution === ParticleDistribution.RING_OUTER) {
        // Higher damping for ring particles
        dampingFactor = 0.85;
      } else if (p.distanceFromCenter < ACCRETION_DISK_INNER * 1.5) {
        // Increased damping near center
        dampingFactor = 0.9;
      } else {
        // Standard damping for outer particles
        dampingFactor = 0.92;
      }
      
      // Limit particle speed
      const speedSq = p.vx * p.vx + p.vy * p.vy;
      const maxSpeedNearCenter = 4;
      const maxSpeedFarAway = 2;
      
      const distanceRatio = Math.min(1, (p.distanceFromCenter - BLACK_HOLE_RADIUS) / (ACCRETION_DISK_OUTER - BLACK_HOLE_RADIUS));
      const maxSpeed = maxSpeedNearCenter + (maxSpeedFarAway - maxSpeedNearCenter) * distanceRatio;
      const maxSpeedSq = maxSpeed * maxSpeed;
      
      if (speedSq > maxSpeedSq) {
        const scaleFactor = Math.sqrt(maxSpeedSq / speedSq);
        p.vx *= scaleFactor;
        p.vy *= scaleFactor;
      }
      
      p.vx *= dampingFactor;
      p.vy *= dampingFactor;
      
      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Reset particles that go outside bounds
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        // Calculate the distance this particle should be from center based on its distribution
        let orbitRadius;
        
        switch (p.distribution) {
          case ParticleDistribution.RING_INNER:
            orbitRadius = randomBetween(ACCRETION_DISK_INNER, ACCRETION_DISK_INNER + 20);
            break;
          case ParticleDistribution.RING_MIDDLE:
            orbitRadius = randomBetween(ACCRETION_DISK_INNER + RING_GAP_SIZE + 20, ACCRETION_DISK_INNER + RING_GAP_SIZE + 45);
            break;
          case ParticleDistribution.RING_OUTER:
            orbitRadius = randomBetween(ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 45, ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 75);
            break;
          case ParticleDistribution.ACCRETION_DISK:
            orbitRadius = randomBetween(ACCRETION_DISK_INNER + 25, ACCRETION_DISK_OUTER - 10);
            break;
          case ParticleDistribution.CENTRAL_CORE:
            orbitRadius = randomBetween(5, BLACK_HOLE_RADIUS * 0.7);
            break;
          default:
            orbitRadius = randomBetween(ACCRETION_DISK_OUTER * 1.1, Math.min(width, height) * 0.42);
            break;
        }
        
        // Place at a random angle along the proper orbital radius
        const newAngle = randomBetween(0, Math.PI * 2);
        p.x = centerX + Math.cos(newAngle) * orbitRadius;
        p.y = centerY + Math.sin(newAngle) * orbitRadius;
        p.baseX = p.x;
        p.baseY = p.y;
        p.vx = 0;
        p.vy = 0;
        p.angle = newAngle;
        p.distanceFromCenter = orbitRadius;
        
        // Reset the trail
        p.trail = Array(TRAIL_LENGTH).fill(null).map(() => ({
          x: p.x,
          y: p.y,
          a: 1.0
        }));
      }
      
      // Update trail
      p.trail.pop();
      p.trail.unshift({
        x: p.x,
        y: p.y,
        a: 1.0
      });
    };
    
    // Draw a particle with enhanced visuals
    const drawParticle = (p: Particle) => {
      if (!ctx) return;
      const distFromCenter = p.distanceFromCenter;
      
      // Skip drawing particles that are "inside" the black hole
      if (p.distribution !== ParticleDistribution.CENTRAL_CORE && distFromCenter < BLACK_HOLE_RADIUS * 0.9) {
        return;
      }
      
      // Enhance colors based on particle type and energy
      let dynamicColor = { ...p.color };
      
      // Energy boost for colors
      if (p.energyLevel > 0.6) {
        dynamicColor = {
          r: Math.min(255, dynamicColor.r + 30),
          g: Math.min(255, dynamicColor.g + 10),
          b: Math.min(255, dynamicColor.b + 40),
          a: Math.min(1, dynamicColor.a + 0.1)
        };
      }
      
      // Special handling for accretion disk - create gradient color based on distance from center
      if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        const innerRatio = Math.max(0, Math.min(1, 
          (distFromCenter - ACCRETION_DISK_INNER) / (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER)
        ));
        
        // Inner parts are hotter (more energy-like colors)
        if (innerRatio < 0.3) {
          dynamicColor = blendColors(COLORS.accent, dynamicColor, 0.7);
        } else if (innerRatio < 0.6) {
          dynamicColor = blendColors(COLORS.secondary, dynamicColor, 0.5);
        }
      }
      
      // Size variations
      const pulseSize = 1 + Math.sin(p.pulse) * 0.2;
      let size = p.size * pulseSize;
      
      // Larger particles in the accretion disk
      if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        size *= 1.3;
      }
      
      // Draw trails based on particle energy and type
      const shouldDrawTrail = p.energyLevel > 0.2 || p.distribution === ParticleDistribution.ACCRETION_DISK;
      
      let trailLength;
      if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        let maxTrail = p.energyLevel > 0.6 ? 4 : 3;
        trailLength = Math.min(p.trail.length, maxTrail);
      } else {
        trailLength = Math.min(p.trail.length, 2);
      }
      
      if (shouldDrawTrail) {
        ctx.globalCompositeOperation = 'screen';
        
        for (let t = 0; t < trailLength; t++) {
          const trailPos = p.trail[t];
          const trailRatio = (TRAIL_LENGTH - t) / TRAIL_LENGTH;
          
          // Stronger trails for accretion disk particles
          const trailAlpha = p.distribution === ParticleDistribution.ACCRETION_DISK ? 
                           trailRatio * 0.4 : trailRatio * 0.25;
          
          const trailColor = `rgba(${dynamicColor.r}, ${dynamicColor.g}, ${dynamicColor.b}, ${trailAlpha})`;
          ctx.beginPath();
          ctx.fillStyle = trailColor;
          ctx.arc(trailPos.x, trailPos.y, size * trailRatio * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Enhanced glow effects based on energy and type
      const glowThreshold = p.distribution === ParticleDistribution.ACCRETION_DISK ? 0.3 : 0.4;
      
      if (p.energyLevel > glowThreshold) {
        // Determine glow size based on particle type
        const particleGlowSize = p.distribution === ParticleDistribution.ACCRETION_DISK ? 
                              GLOW_SIZE * 1.5 : GLOW_SIZE;
        
        const glowOpacity = p.energyLevel * 0.6;
        
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, particleGlowSize);
        glow.addColorStop(0, `rgba(${dynamicColor.r}, ${dynamicColor.g}, ${dynamicColor.b}, ${glowOpacity})`);
        glow.addColorStop(0.6, `rgba(${dynamicColor.r}, ${dynamicColor.g}, ${dynamicColor.b}, ${glowOpacity * 0.4})`);
        glow.addColorStop(1, `rgba(${dynamicColor.r}, ${dynamicColor.g}, ${dynamicColor.b}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(p.x, p.y, particleGlowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Main particle with brightest center
      ctx.beginPath();
      ctx.fillStyle = `rgba(${dynamicColor.r}, ${dynamicColor.g}, ${dynamicColor.b}, ${dynamicColor.a})`;
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Bright core for high energy particles (creates a star-like effect)
      if (p.energyLevel > 0.5) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.energyLevel * 0.5})`;
        ctx.arc(p.x, p.y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
      // Animation frame
    const animate = () => {
      if (!ctx) return;
      
      const now = performance.now();
      const dt = Math.min((now - (lastFrameTime.current || now)) / 16.67, 2); // Cap dt at 2 (33ms)
      lastFrameTime.current = now;
      timeRef.current += dt;
      frameCountRef.current++;
      
      // Debug output occasionally
      if (frameCountRef.current % 300 === 0) {
        console.log(`Particles: ${particles.current.length}, Mouse: ${mouse.current.x}, ${mouse.current.y}, Interacting: ${isInteracting}`);
      }
      
      // Update flow field less frequently
      if (frameCountRef.current % 60 === 0) {
        flowField.current = generateFlowField(width, height, timeRef.current);
        energyWaveRef.current += ENERGY_WAVE_SPEED * 60;
      } else {
        energyWaveRef.current += ENERGY_WAVE_SPEED * dt;
      }
      
      // Draw background and black hole core
      drawBackground();
      
      // Sort particles by distance from center for proper rendering order
      particles.current.sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      
      // Update all particles
      for (const particle of particles.current) {
        updateParticle(particle, dt);
      }
      
      // Draw connections
      ctx.globalCompositeOperation = 'screen';
      drawConnections();
      
      // Draw energy waves
      drawEnergyWave();
      
      // Draw all particles
      ctx.globalCompositeOperation = 'screen';
      for (const particle of particles.current) {
        drawParticle(particle);
      }
      
      animationId.current = requestAnimationFrame(animate);
    };
    
    animationId.current = requestAnimationFrame(animate);    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      resizeObserver.disconnect();
      // Clean up canvas event listeners
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [parentRef]);
  return (    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Increased z-index to ensure it's above other elements
        pointerEvents: 'auto', // Changed to 'auto' to enable mouse interaction
        background: 'transparent',
        display: 'block',
        mixBlendMode: 'screen',
        willChange: 'transform',
        cursor: 'crosshair', // Add cursor style to indicate interactivity
      }}
      aria-hidden="true"
      data-testid="interactive-particle-background"
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(InteractiveParticleBackground);