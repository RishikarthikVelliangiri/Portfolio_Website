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

// Distribution types for particle positioning
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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const frameCountRef = useRef(0);  // Track mouse movements with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current || !parentRef.current) return;

    const rect = parentRef.current.getBoundingClientRect();
    const inBounds = 
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    const newX = inBounds ? e.clientX - rect.left : -1000;
    const newY = inBounds ? e.clientY - rect.top : -1000;
    
    const lastX = mouse.current.x;
    const lastY = mouse.current.y;
    
    mouse.current = {
      x: newX,
      y: newY,
      vx: newX !== -1000 && lastX !== -1000 ? (newX - lastX) * 0.1 : 0,
      vy: newY !== -1000 && lastY !== -1000 ? (newY - lastY) * 0.1 : 0,
      lastX: lastX,
      lastY: lastY
    };
    
    setIsInteracting(inBounds);
  }, [parentRef]);

  // Track resize events
  useEffect(() => {
    if (!parentRef.current) return;
    
    const updateDimensions = (target: Element) => {
      const { width, height } = target.getBoundingClientRect();
      setDimensions({ width, height });
    };
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === parentRef.current) {
          updateDimensions(entry.target);
        }
      }
    });
    
    resizeObserver.observe(parentRef.current);
    resizeObserverRef.current = resizeObserver;
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [parentRef]);
  
  // Add mouse event listener with throttling
  useEffect(() => {
    const throttledMouseMove = (e: MouseEvent) => {
      // Throttle mouse move events for performance
      if (frameCountRef.current % 2 !== 0) return;
      handleMouseMove(e);
    };
    
    document.addEventListener('mousemove', throttledMouseMove);
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [handleMouseMove]);
  // Color handling functions - used to create dynamic color effects based on time and energy level
  function getGradientColor(time: number, baseColor: typeof COLORS.primary, energyLevel = 0): typeof COLORS.primary {
    const shift = Math.sin(time * 0.001) * 20;
    const energyBoost = energyLevel * 30;
    
    return {
      r: Math.min(255, Math.max(0, baseColor.r + shift * 0.5 + energyBoost)),
      g: Math.min(255, Math.max(0, baseColor.g + shift * 0.3 + energyBoost * 0.7)),
      b: Math.min(255, Math.max(0, baseColor.b + shift + energyBoost * 0.5)),
      a: baseColor.a
    };
  }

  const blendColors = (color1: typeof COLORS.primary, color2: typeof COLORS.primary, ratio: number): typeof COLORS.primary => {
    return {
      r: color1.r * (1 - ratio) + color2.r * ratio,
      g: color1.g * (1 - ratio) + color2.g * ratio,
      b: color1.b * (1 - ratio) + color2.b * ratio,
      a: color1.a * (1 - ratio) + color2.a * ratio
    };
  };
  // Generate black hole-like spiral flow field
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

  // Main particle system effect
  useEffect(() => {
    if (!parentRef?.current) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Update canvas size
    if (dimensions.width > 0 && dimensions.height > 0) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    } else if (parentRef.current) {
      const { width, height } = parentRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    }

    const width = canvas.width;
    const height = canvas.height;

    // Set up blending and initialize particles if needed    ctx.globalCompositeOperation = 'screen';
    
    // Initialize particles only if they don't already exist
    if (!particles.current.length) {
      // Generate initial flow field
      flowField.current = generateFlowField(width, height, 0);
      
      const createParticle = (distribution: ParticleDistribution): Particle => {
        const centerX = width / 2;
        const centerY = height / 2;
        let angle = randomBetween(0, Math.PI * 2);
        let radius: number;
        let speed: number;
        let orbitSpeed: number;
        let color: typeof COLORS.primary;
        let size: number;
        let energyLevel: number;
          // Create different particle distributions for black hole effect
        switch (distribution) {
          // Central black hole particles
          case ParticleDistribution.CENTRAL_CORE:
            radius = randomBetween(5, BLACK_HOLE_RADIUS * 0.7);
            speed = randomBetween(PARTICLE_SPEED_MIN * 0.5, PARTICLE_SPEED_MAX * 0.3);
            orbitSpeed = randomBetween(0.003, 0.008);
            color = COLORS.core;
            size = PARTICLE_BASE_SIZE * randomBetween(0.8, 1.2);
            energyLevel = randomBetween(0.2, 0.4);
            break;
            // Inner ring (closest to black hole)
          case ParticleDistribution.RING_INNER: {
            const ringWidth = 20;
            radius = randomBetween(ACCRETION_DISK_INNER, ACCRETION_DISK_INNER + ringWidth);
            // Kepler's law - orbital speed decreases with distance
            orbitSpeed = randomBetween(0.0025, 0.0035) * Math.sqrt(ACCRETION_DISK_OUTER / radius);
            speed = randomBetween(PARTICLE_SPEED_MIN * 1.2, PARTICLE_SPEED_MAX * 0.8);
            color = {
              r: 210, 
              g: 120, 
              b: 255, 
              a: randomBetween(0.7, 0.9)
            };
            size = PARTICLE_BASE_SIZE * 1.1;
            energyLevel = randomBetween(0.7, 0.9);
            break;
          }
          
          // Middle ring
          case ParticleDistribution.RING_MIDDLE: {
            const ringWidth = 25;
            const ringStart = ACCRETION_DISK_INNER + RING_GAP_SIZE + 20;
            radius = randomBetween(ringStart, ringStart + ringWidth);
            orbitSpeed = randomBetween(0.002, 0.003) * Math.sqrt(ACCRETION_DISK_OUTER / radius);
            speed = randomBetween(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX * 0.7);
            color = {
              r: 180, 
              g: 100, 
              b: 250, 
              a: randomBetween(0.65, 0.85)
            };
            size = PARTICLE_BASE_SIZE * 0.95;
            energyLevel = randomBetween(0.5, 0.7);
            break;
          }
          
          // Outer ring
          case ParticleDistribution.RING_OUTER: {
            const ringWidth = 30;
            const ringStart = ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 45;
            radius = randomBetween(ringStart, ringStart + ringWidth);
            orbitSpeed = randomBetween(0.0015, 0.0025) * Math.sqrt(ACCRETION_DISK_OUTER / radius);
            speed = randomBetween(PARTICLE_SPEED_MIN * 0.8, PARTICLE_SPEED_MAX * 0.6);
            color = {
              r: 150, 
              g: 80, 
              b: 240, 
              a: randomBetween(0.6, 0.8)
            };
            size = PARTICLE_BASE_SIZE * 0.9;
            energyLevel = randomBetween(0.4, 0.6);
            break;
          }
          
          // Dense accretion disk particles (more chaotic)
          case ParticleDistribution.ACCRETION_DISK: {
            // Avoid the specific ring areas
            let validRadius = false;
            do {
              radius = randomBetween(ACCRETION_DISK_INNER, ACCRETION_DISK_OUTER);
              
              // Check if radius is in the gaps between rings
              const inRing1 = radius >= ACCRETION_DISK_INNER && radius <= ACCRETION_DISK_INNER + 20;
              const inRing2 = radius >= ACCRETION_DISK_INNER + RING_GAP_SIZE + 20 && radius <= ACCRETION_DISK_INNER + RING_GAP_SIZE + 45;
              const inRing3 = radius >= ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 45 && radius <= ACCRETION_DISK_INNER + (RING_GAP_SIZE * 2) + 75;
              
              validRadius = !(inRing1 || inRing2 || inRing3);
            } while (!validRadius);
            
            speed = randomBetween(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);
            orbitSpeed = randomBetween(0.001, 0.004) * (ACCRETION_DISK_OUTER / radius); // Faster orbit closer to center
            
            // Gradient color based on distance from center (hotter inner disk)
            const diskRatio = (radius - ACCRETION_DISK_INNER) / (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER);
            if (diskRatio < 0.3) {
              color = COLORS.accent;  // Hottest inner region
            } else if (diskRatio < 0.6) {
              color = COLORS.secondary;  // Middle region
            } else {
              color = COLORS.primary;  // Outer region
            }
            
            size = PARTICLE_BASE_SIZE + randomBetween(-PARTICLE_VARIATION, PARTICLE_VARIATION);
            energyLevel = randomBetween(0.4, 0.8) * (1.2 - diskRatio); // Higher energy for inner particles
            break;
          }
            
          // Outer field particles
          default:
            radius = randomBetween(ACCRETION_DISK_OUTER * 1.1, Math.min(width, height) * 0.48);
            speed = randomBetween(PARTICLE_SPEED_MIN * 0.7, PARTICLE_SPEED_MAX * 0.6);
            orbitSpeed = randomBetween(0.0005, 0.002);
            
            const colorRatio = Math.random();
            if (colorRatio < 0.4) {
              color = COLORS.primary;
            } else if (colorRatio < 0.7) {
              color = COLORS.secondary;
            } else {
              color = COLORS.accent;
            }
            
            size = PARTICLE_BASE_SIZE * 0.85 + randomBetween(-PARTICLE_VARIATION, PARTICLE_VARIATION);
            energyLevel = randomBetween(0.1, 0.4);
            break;
        }
        
        const baseX = centerX + Math.cos(angle) * radius;
        const baseY = centerY + Math.sin(angle) * radius;
        
        // Initialize trail
        const trail = Array(TRAIL_LENGTH).fill(null).map(() => ({
          x: baseX, 
          y: baseY,
          a: 1.0
        }));
        
        return {
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
          angle,
          orbitSpeed,
          speed,
          size,
          color,
          trail,
          pulse: Math.random() * Math.PI * 2,
          energyLevel,
          flowOffset: randomBetween(0, Math.PI * 2),
          distribution,
          distanceFromCenter: radius
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
    }    // Draw background and black hole effect
    const drawBackground = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; // Slightly more opaque for faster fading trails
      ctx.fillRect(0, 0, width, height);
      
      // Black hole core effect
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Draw black hole event horizon
      ctx.globalCompositeOperation = 'source-over';
      const blackHoleGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, BLACK_HOLE_RADIUS
      );
      blackHoleGradient.addColorStop(0, 'rgba(5, 0, 10, 1)');
      blackHoleGradient.addColorStop(0.7, 'rgba(10, 0, 20, 0.95)');
      blackHoleGradient.addColorStop(1, 'rgba(20, 5, 30, 0.9)');
      
      ctx.beginPath();
      ctx.fillStyle = blackHoleGradient;
      ctx.arc(centerX, centerY, BLACK_HOLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw event horizon highlight ring
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${COLORS.accent.r}, ${COLORS.accent.g}, ${COLORS.accent.b}, 0.3)`;
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
      // Draw connections between particles with improved aesthetics for black hole effect
    const drawConnections = () => {
      if (frameCountRef.current % FRAME_SKIP !== 0) return;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // First handle the accretion disk connections - this creates a continuous ring effect
      ctx.lineWidth = 0.8;
      
      // Separate particles by type for optimized connection logic
      const diskParticles = particles.current.filter(p => 
        p.distribution === ParticleDistribution.ACCRETION_DISK);
      
      const outerParticles = particles.current.filter(p => 
        p.distribution === ParticleDistribution.OUTER_FIELD);
        // Get all ring particles
      const ringInnerParticles = particles.current.filter(p => p.distribution === ParticleDistribution.RING_INNER);
      const ringMiddleParticles = particles.current.filter(p => p.distribution === ParticleDistribution.RING_MIDDLE);
      const ringOuterParticles = particles.current.filter(p => p.distribution === ParticleDistribution.RING_OUTER);
      
      // Sort all particles by angle for coherent connections
      ringInnerParticles.sort((a, b) => a.angle - b.angle);
      ringMiddleParticles.sort((a, b) => a.angle - b.angle);
      ringOuterParticles.sort((a, b) => a.angle - b.angle);
      diskParticles.sort((a, b) => a.angle - b.angle);
        // Function to draw a coherent ring
      const drawRing = (ringParticles: Particle[], thickness: number, baseOpacity: number, colorIntensity: number) => {
        // First draw a continuous background ring to ensure visual continuity
        const avgRadius = ringParticles.reduce((sum, p) => sum + p.distanceFromCenter, 0) / ringParticles.length;
        
        // Draw solid ring background with slight transparency
        ctx.beginPath();
        ctx.globalAlpha = 0.15; // Subtle base ring
        ctx.lineWidth = thickness * 1.8;
        const baseRingColor = {
          r: 120 + colorIntensity * 0.7,
          g: 80 + colorIntensity * 0.3,
          b: 200 + colorIntensity * 0.7,
        };
        ctx.strokeStyle = `rgba(${baseRingColor.r}, ${baseRingColor.g}, ${baseRingColor.b}, ${baseOpacity * 0.5})`;
        ctx.arc(centerX, centerY, avgRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        // Now draw connecting lines between consecutive particles for detailed structure
        ctx.beginPath();
        let started = false;
        
        // Draw connecting lines between consecutive particles
        for (let i = 0; i < ringParticles.length; i++) {
          const p1 = ringParticles[i];
          // Connect to next particle in the sorted array (creates a ring)
          const p2 = ringParticles[(i + 1) % ringParticles.length];
          
          const dist = distance(p1.x, p1.y, p2.x, p2.y);
          
          // Increased connection distance to ensure better continuity
          if (dist < CONNECTION_DISTANCE * 2.5) {
            if (!started) {
              ctx.moveTo(p1.x, p1.y);
              started = true;
            }
            
            ctx.lineTo(p2.x, p2.y);
          } else if (started) {
            // End the current path and start a new one
            const distFromCenter = distance(p1.x, p1.y, centerX, centerY);
            const energyFactor = Math.min(1, Math.max(0.4, p1.energyLevel * 1.5));
            
            let ringColor;
            if (energyFactor > 0.8) {
              ringColor = COLORS.energy;
            } else if (energyFactor > 0.6) {
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
            
            // Reset for the next segment
            ctx.beginPath();
            started = false;
          }
        }
        
        // Draw the final path if needed
        if (started) {
          const energyFactor = Math.min(1, Math.max(0.4, ringParticles[0].energyLevel * 1.5));
          
          let ringColor;
          if (energyFactor > 0.8) {
            ringColor = COLORS.energy;
          } else if (energyFactor > 0.6) {
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
      
      // Draw three distinct Saturn-like rings with different properties
      drawRing(ringInnerParticles, 1.4, 0.7, 45); // Inner ring - brightest, thickest
      drawRing(ringMiddleParticles, 1.2, 0.65, 30); // Middle ring
      drawRing(ringOuterParticles, 1.0, 0.6, 15); // Outer ring - thinnest, less bright
      
      // Draw accretion disk connections for particles not in the main rings
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
      
      // 2. Draw connections for outer particles (sparser)
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
    };      // Update a particle's physics with black hole gravitational effects
    const updateParticle = (p: Particle, dt: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Update pulse phase and energy based on position in system
      p.pulse += PULSE_FREQUENCY * dt * p.speed;
      
      // Dynamic energy based on type and position
      const distFromCenter = distance(p.x, p.y, centerX, centerY);
      p.distanceFromCenter = distFromCenter; // Update for use in rendering
      
      // Energy increases closer to the black hole
      const distanceFactor = Math.max(0, 1 - (distFromCenter / Math.max(width, height) * 0.8));
      const timeFactor = Math.sin(timeRef.current * 0.0005 + p.angle);
      const interactionEnergy = isInteracting ? 0.15 : 0;
      
      // Different energy behavior based on particle type
      switch (p.distribution) {        case ParticleDistribution.CENTRAL_CORE: {
          // Core particles maintain high energy
          p.energyLevel = Math.max(0.3, Math.min(0.7, 
            p.energyLevel * 0.98 + 
            timeFactor * 0.02 + 
            interactionEnergy
          ));
          break;
        }
          
        case ParticleDistribution.ACCRETION_DISK: {
          // Accretion disk has highest energy, especially inner parts
          const innerDiskFactor = Math.max(0, 1 - (distFromCenter - ACCRETION_DISK_INNER) / 
                                        (ACCRETION_DISK_OUTER - ACCRETION_DISK_INNER));
          p.energyLevel = Math.max(0.2, Math.min(0.9, 
            p.energyLevel * 0.97 + 
            timeFactor * 0.03 + 
            innerDiskFactor * 0.1 +
            interactionEnergy
          ));
          break;
        }
          
        default:
          // Outer field particles have less energy
          p.energyLevel = Math.max(0, Math.min(0.6, 
            p.energyLevel * 0.98 + 
            timeFactor * 0.02 + 
            distanceFactor * 0.05 +
            interactionEnergy
          ));
          break;      }
      
      // Update orbital position based on distribution type
      // Different orbital velocities based on particle type
      if (p.distribution === ParticleDistribution.RING_INNER || 
          p.distribution === ParticleDistribution.RING_MIDDLE || 
          p.distribution === ParticleDistribution.RING_OUTER) {
        // Apply Keplerian motion - orbital velocity inversely proportional to square root of radius
        // This creates the natural orbital motion seen in planetary rings
        const kepler = Math.sqrt(BLACK_HOLE_RADIUS / Math.max(BLACK_HOLE_RADIUS * 0.5, p.distanceFromCenter));
        
        // Apply a more controlled orbital velocity for ring particles
        // Using a smoother scaling factor to prevent excessive speeds
        const smoothedKepler = Math.min(1.8, kepler); // Cap the maximum Keplerian factor
        p.angle += p.orbitSpeed * dt * smoothedKepler * 0.9; // Reduced amplification from 1.2 to 0.9
      } else if (p.distribution === ParticleDistribution.CENTRAL_CORE) {
        // Special handling for core particles - more consistent and slower rotation
        const coreSpeed = 0.5 + (BLACK_HOLE_RADIUS - p.distanceFromCenter) / BLACK_HOLE_RADIUS * 0.5;
        p.angle += p.orbitSpeed * dt * coreSpeed;
      } else {
        // Normal orbital update for non-ring particles with more controlled scaling
        p.angle += p.orbitSpeed * dt * Math.min(1.3, 1 + p.energyLevel * 0.3); // Cap maximum speed boost      }
      
      // Different orbital behavior based on particle type
      switch (p.distribution) {
        case ParticleDistribution.CENTRAL_CORE: {
          // Core particles move in smaller, faster orbits          const coreRadius = BLACK_HOLE_RADIUS * 0.7 * (0.4 + Math.sin(p.angle * 3) * 0.1);
          p.baseX = centerX + Math.cos(p.angle) * coreRadius;
          p.baseY = centerY + Math.sin(p.angle) * coreRadius;
          break;
        }
        
        // Saturn-like ring behaviors - very stable, nearly circular orbits
        case ParticleDistribution.RING_INNER: {
          // Inner ring maintains extremely stable orbit with minimal variation
          // Almost zero eccentricity for cohesive ring appearance
          const eccentricity = 0.0025; // Reduced eccentricity for more perfect circles
          const ringRadius = p.distanceFromCenter;
          
          // Extremely subtle vertical oscillation - reduced from previous value
          const verticalTilt = Math.sin(p.angle * 2 + timeRef.current * 0.0001) * 0.005;
          
          // Apply Keplerian orbital velocity - faster closer to center
          const orbitalSpeedFactor = Math.sqrt(BLACK_HOLE_RADIUS / ringRadius) * 0.8;
          p.orbitSpeed = Math.max(p.orbitSpeed, 0.0025 * orbitalSpeedFactor);
          p.baseX = centerX + Math.cos(p.angle) * ringRadius * (1 + eccentricity * Math.cos(p.angle));
          p.baseY = centerY + Math.sin(p.angle) * ringRadius * (1 + eccentricity * Math.cos(p.angle) + verticalTilt);
          break;
        }
        
        case ParticleDistribution.RING_MIDDLE: {
          // Middle ring with slightly different oscillation pattern
          const eccentricity = 0.01;
          const ringRadius = p.distanceFromCenter;
          
          // Minimal phase for vertical oscillation
          const verticalTilt = Math.sin(p.angle * 3 + timeRef.current * 0.00015) * 0.04;
          
          p.baseX = centerX + Math.cos(p.angle) * ringRadius * (1 + eccentricity * Math.sin(p.angle * 2));
          p.baseY = centerY + Math.sin(p.angle) * ringRadius * (1 + eccentricity * Math.sin(p.angle * 2) + verticalTilt);
          break;
        }
        
        case ParticleDistribution.RING_OUTER: {
          // Outer ring with its own dynamics
          const eccentricity = 0.01;
          const ringRadius = p.distanceFromCenter * (1 + Math.sin(p.angle * 5) * 0.01);
          
          // Different phase for vertical oscillation
          const verticalTilt = Math.sin(p.angle * 4 + timeRef.current * 0.0002) * 0.1;
          
          p.baseX = centerX + Math.cos(p.angle) * ringRadius * (1 + eccentricity * Math.sin(p.angle * 3));
          p.baseY = centerY + Math.sin(p.angle) * ringRadius * (1 + eccentricity * Math.sin(p.angle * 3)) * (1 + verticalTilt);
          break;
        }
        
        case ParticleDistribution.ACCRETION_DISK: {
          // Accretion disk particles maintain their orbital radius with slightly more chaotic variations
          // More elliptical orbits give a realistic accretion disk look
          const ellipseA = p.distanceFromCenter * (1 + Math.sin(p.angle * 2) * 0.08);
          const ellipseB = p.distanceFromCenter * (1 + Math.cos(p.angle * 2) * 0.08);
          
          // Add a subtle precession effect to the accretion disk
          const precessionAngle = timeRef.current * 0.00005;
          const finalAngle = p.angle + precessionAngle;
            p.baseX = centerX + Math.cos(finalAngle) * ellipseA;
          p.baseY = centerY + Math.sin(finalAngle) * ellipseB;
          break;
        }
        
        default:
          // Outer field particles have larger, slower orbits
          p.baseX = centerX + Math.cos(p.angle) * p.distanceFromCenter * (0.98 + Math.sin(p.angle * 0.5) * 0.02);
          p.baseY = centerY + Math.sin(p.angle) * p.distanceFromCenter * (0.98 + Math.cos(p.angle * 0.5) * 0.02);
          break;
      }
      
      // Apply flow field influence
      const col = Math.floor(p.x / FLOW_FIELD_RESOLUTION);
      const row = Math.floor(p.y / FLOW_FIELD_RESOLUTION);
      
      if (flowField.current && 
          col >= 0 && col < flowField.current.length && 
          row >= 0 && flowField.current[col] && row < flowField.current[col].length) {
        
        const flow = flowField.current[col][row];
        const flowAngle = flow.angle + p.flowOffset;
        p.ax += Math.cos(flowAngle) * flow.strength * dt;
        p.ay += Math.sin(flowAngle) * flow.strength * dt;
      }      // Black hole gravitational pull - stronger near center
      if (p.distanceFromCenter > BLACK_HOLE_RADIUS) {
        // Modified gravity formula with a more gradual scaling to prevent excessive acceleration near the center
        // Add smoothing factor to prevent extreme values when very close to black hole
        const smoothingFactor = 150; // Higher number gives more gradual transition
        const distanceSq = Math.max(smoothingFactor, p.distanceFromCenter * p.distanceFromCenter);
        const gravityStrength = 100 / distanceSq * dt; // Reduced base strength from 120 to 100
        
        // Cap maximum gravity force to ensure stable orbits
        const cappedGravity = Math.min(gravityStrength, 0.04 * dt);
        
        const gravityAngle = Math.atan2(centerY - p.y, centerX - p.x);
        p.ax += Math.cos(gravityAngle) * cappedGravity;
        p.ay += Math.sin(gravityAngle) * cappedGravity;
      }
      
      // Mouse interaction with enhanced effects
      if (isInteracting && mouse.current.x !== -1000) {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < INTERACTION_RADIUS * INTERACTION_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
          const angle = Math.atan2(dy, dx);
          
          // Get mouse velocity for more dynamic interactions
          const mouseVelocity = Math.sqrt(mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy);
          const velocityFactor = Math.min(1, mouseVelocity / 5); // Scale based on mouse speed
            // Variable interaction based on particle type
          switch (p.distribution) {
            case ParticleDistribution.RING_INNER:
            case ParticleDistribution.RING_MIDDLE:
            case ParticleDistribution.RING_OUTER: {
              // Ring particles should create waves when disturbed
              // Calculate the angular distance around the ring
              const particleAngle = Math.atan2(p.y - centerY, p.x - centerX);
              const mouseAngle = Math.atan2(mouse.current.y - centerY, mouse.current.x - centerX);
              const angleDiff = Math.abs(((particleAngle - mouseAngle + Math.PI) % (Math.PI * 2)) - Math.PI);
              
              // Wave propagation through the ring - affects nearby particles in the ring
              // This creates a more coherent wave effect as a group rather than individual particles
              const angularWaveRange = 0.6; // How far the wave spreads angularly
              const waveEffect = angleDiff < angularWaveRange ? 
                                Math.cos(angleDiff / angularWaveRange * Math.PI/2) * velocityFactor : 0;
              
              // Create a ripple effect through the ring that travels along the ring
              const ripplePhase = timeRef.current * 0.01 + angleDiff * 5;
              const rippleAmp = Math.sin(ripplePhase) * force * 0.4 * waveEffect;
              
              // Apply wave effect perpendicular to radial direction (along the ring)
              const radialAngle = Math.atan2(p.y - centerY, p.x - centerX);
              const perpRadial = radialAngle + Math.PI/2;
              
              // Scale effect by distance from mouse for smoother falloff
              const distanceFactor = 1 - (dist / INTERACTION_RADIUS);
              
              // Create more fluid spiral waves in the rings - mostly tangential motion
              p.ax += Math.cos(perpRadial) * force * (0.1 + rippleAmp) * dt * distanceFactor;
              p.ay += Math.sin(perpRadial) * force * (0.1 + rippleAmp) * dt * distanceFactor;
              
              // Very small radial component for subtle 3D-like displacement
              // Reduced from previous value to maintain ring cohesion
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
      }      // Spring back to base position with variable strength - stronger for ring particles
      let springForce;
      if (p.distribution === ParticleDistribution.CENTRAL_CORE) {
        springForce = 0.02;
      } else if (p.distribution === ParticleDistribution.RING_INNER || 
                p.distribution === ParticleDistribution.RING_MIDDLE || 
                p.distribution === ParticleDistribution.RING_OUTER) {
        // Much stronger spring force for ring particles to maintain very stable, cohesive orbits
        // This is critical for Saturn-like ring formation - increased from 0.08 to 0.15 for tighter orbital adherence
        springForce = 0.15;
      } else if (p.distribution === ParticleDistribution.ACCRETION_DISK) {
        springForce = 0.015;
      } else {
        springForce = 0.01;
      }
      
      // Apply stronger force for ring particles to maintain their exact orbital position
      p.ax += (p.baseX - p.x) * springForce * dt;
      p.ay += (p.baseY - p.y) * springForce * dt;
        // Global swirl with black hole rotation effect
      const swirlAngle = Math.atan2(p.y - centerY, p.x - centerX) + Math.PI / 2;
      
      // Fix for particles moving too fast near the black hole - apply a more gradual scaling
      // Cap the maximum swirl factor to prevent excessive velocities near the center
      const distanceRatio = (distFromCenter - BLACK_HOLE_RADIUS) / (ACCRETION_DISK_OUTER - BLACK_HOLE_RADIUS);
      const cappedDistanceRatio = Math.max(0.15, distanceRatio); // Prevent division by very small numbers
      const swirlFactor = Math.min(1.5, 1 / (cappedDistanceRatio * 2)); // More gradual scaling with lower maximum
      
      p.ax += Math.cos(swirlAngle) * SWIRL_STRENGTH * swirlFactor * dt * 0.8; // Reduced overall strength by 20%
      p.ay += Math.sin(swirlAngle) * SWIRL_STRENGTH * swirlFactor * dt * 0.8;
      
      // Update velocity
      p.vx += p.ax;
      p.vy += p.ay;
      
      // Reset acceleration
      p.ax = 0;
      p.ay = 0;      // Variable damping based on distance from center and particle type
      let dampingFactor;
      
      if (p.distribution === ParticleDistribution.RING_INNER || 
          p.distribution === ParticleDistribution.RING_MIDDLE || 
          p.distribution === ParticleDistribution.RING_OUTER) {
        // Higher damping for ring particles - makes them settle into their orbits faster
        // This creates more stable, coherent rings
        dampingFactor = 0.85; // Increased damping for even more stability in rings
      } else if (p.distanceFromCenter < ACCRETION_DISK_INNER * 1.5) {
        // Increased damping near center to slow down particles close to the black hole
        dampingFactor = 0.9; // Changed from 0.96 to 0.9 to reduce speed near center
      } else {
        // Standard damping for outer particles
        dampingFactor = 0.92;
      }
      
      // Apply velocity limiting for particles that are moving too fast
      // This prevents particles from achieving unrealistic speeds
      const speedSq = p.vx * p.vx + p.vy * p.vy;
      const maxSpeedNearCenter = 4; // Lower max speed for particles near center
      const maxSpeedFarAway = 2; // Lower max speed for particles far from center
      
      // Calculate max speed based on distance from center - slower near black hole
      const distanceRatio = Math.min(1, (p.distanceFromCenter - BLACK_HOLE_RADIUS) / (ACCRETION_DISK_OUTER - BLACK_HOLE_RADIUS));
      const maxSpeed = maxSpeedNearCenter + (maxSpeedFarAway - maxSpeedNearCenter) * distanceRatio;
      const maxSpeedSq = maxSpeed * maxSpeed;
      
      // If speed exceeds max, scale it down
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
        // Fix for particles circling the border instead of forming rings
      // If particle goes outside bounds, reset it to a proper orbit around the black hole
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
            // Keep in accretion disk but avoid the ring areas
            orbitRadius = randomBetween(ACCRETION_DISK_INNER + 25, ACCRETION_DISK_OUTER - 10);
            break;
          case ParticleDistribution.CENTRAL_CORE:
            orbitRadius = randomBetween(5, BLACK_HOLE_RADIUS * 0.7);
            break;
          default:
            // Outer field particles - keep them in the outer field but not at the edges
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
        
        // Reset the trail to the new position
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
    };    // Draw a particle with enhanced visuals for black hole effect
    const drawParticle = (p: Particle) => {
      // Use width and height directly since they're available in scope      // Using width/height directly from the parent scope
      // Use the pre-calculated distance from center stored in the particle
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
      const shouldDrawTrail = p.energyLevel > 0.2 || p.distribution === ParticleDistribution.ACCRETION_DISK;      let trailLength;
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
    
    // Animation loop
    let lastTime = performance.now();
    
    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      timeRef.current += dt;
      frameCountRef.current++;
      
      // Update flow field less frequently
      if (frameCountRef.current % 60 === 0) {
        flowField.current = generateFlowField(width, height, timeRef.current);        energyWaveRef.current += ENERGY_WAVE_SPEED * 60;
      } else {
        energyWaveRef.current += ENERGY_WAVE_SPEED * dt;
      }
      // Draw background and black hole core
      drawBackground();
      
      // Sort particles by distance from center for proper rendering order
      // This ensures particles further from the center are rendered behind closer ones
      particles.current.sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      
      // First update all particles
      for (const particle of particles.current) {
        updateParticle(particle, dt);
      }
      
      // Draw connections for accretion disk particles first (behind everything)
      ctx.globalCompositeOperation = 'screen';
      drawConnections();
        // Draw energy waves
      drawEnergyWave();
      
      // Then draw all particles in sorted order
      ctx.globalCompositeOperation = 'screen';
      for (const particle of particles.current) {
        drawParticle(particle);
      }
      
      animationId.current = requestAnimationFrame(animate);
    }
    
    animationId.current = requestAnimationFrame(animate);
      return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [parentRef, dimensions, isInteracting, generateFlowField]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // Let mouse events pass through to content        background: 'transparent',
        display: 'block',
        mixBlendMode: 'screen', // Apply screen blend mode for better integration with background
        willChange: 'transform', // Performance optimization hint
      }}
      aria-hidden="true"
      data-testid="interactive-particle-background"
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(InteractiveParticleBackground);
