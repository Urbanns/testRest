import React, { useEffect, useState, useRef } from 'react';
import { ChefHat, ChevronDown } from 'lucide-react';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseTimer = useRef<NodeJS.Timeout>();
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>(
    Array(12).fill(null).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseMoving(true);
      
      if (mouseTimer.current) {
        clearTimeout(mouseTimer.current);
      }
      
      mouseTimer.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimer.current) clearTimeout(mouseTimer.current);
    };
  }, []);

  useEffect(() => {
    const updateParticles = () => {
      particles.current = particles.current.map((particle, i) => {
        if (isMouseMoving) {
          // Gentle attraction towards mouse
          const mouseX = (mousePosition.x / window.innerWidth) * 100;
          const mouseY = (mousePosition.y / window.innerHeight) * 100;
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            particle.vx += (dx / distance) * 0.01;
            particle.vy += (dy / distance) * 0.01;
          }
        } else {
          // Random slow movement when mouse is still
          if (Math.random() < 0.02) {
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;
          }
        }

        // Apply velocity with damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Update position with bounds checking
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Keep particles within bounds
        if (particle.x < 0) { particle.x = 0; particle.vx *= -0.5; }
        if (particle.x > 100) { particle.x = 100; particle.vx *= -0.5; }
        if (particle.y < 0) { particle.y = 0; particle.vy *= -0.5; }
        if (particle.y > 100) { particle.y = 100; particle.vy *= -0.5; }

        return particle;
      });

      requestAnimationFrame(updateParticles);
    };

    const animation = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animation);
  }, [isMouseMoving, mousePosition]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 animate-gradient bg-gradient-to-br from-[#f5e6d3] via-[#e8d5c0] to-[#8b9b7e]" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.current.map((particle, i) => {
          const isHerb = i % 2 === 0;
          const scale = 0.5 + (Math.abs(particle.vx) + Math.abs(particle.vy)) * 5;
          
          return (
            <div
              key={i}
              className={`particle absolute ${isHerb ? 'particle-herb' : 'particle-spice'}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${isHerb ? 50 : 40}px`,
                height: `${isHerb ? 50 : 40}px`,
                backgroundColor: i % 3 === 0 ? '#8b9b7e' : '#a67c52',
                transform: `scale(${scale})`,
                transition: 'transform 0.5s ease-out'
              }}
            />
          );
        })}
      </div>

      {/* Custom Cursor */}
      <div
        className="fixed w-8 h-8 rounded-full border-2 border-[#8b9b7e] pointer-events-none z-50 transition-transform duration-100 -translate-x-1/2 -translate-y-1/2"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      >
        <div className="absolute inset-1 rounded-full bg-[#8b9b7e]/20" />
      </div>

      {/* Hero Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <ChefHat className="h-16 w-16 text-[#8b9b7e] mb-8 transform hover:rotate-12 transition-transform duration-300" />
          <h1 className="hero-title opacity-0 font-serif text-5xl md:text-7xl lg:text-8xl text-gray-800 tracking-wide mb-6">
            Where Nature Meets<br />
            <span className="italic">Culinary Art</span>
          </h1>
          <p className="hero-subtitle opacity-0 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the harmony of seasonal ingredients transformed into 
            unforgettable dining moments in our intimate space.
          </p>
        </div>

        <button className="relative group bg-[#8b9b7e] text-white px-8 py-3 rounded-full text-lg transition-all duration-300 hover:bg-[#7a8a6d] hover:shadow-lg hover:scale-105 mt-8">
          Reserve Your Table
          <span className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/100 transition-all duration-300" />
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-indicator">
          <ChevronDown className="w-8 h-8 text-[#8b9b7e]" />
        </div>
      </div>
    </div>
  );
}

export default App;