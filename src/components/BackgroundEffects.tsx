import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
        });
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x > canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.y > canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = canvas.height;
    };

    const drawParticle = (particle: Particle) => {
      ctx.fillStyle = 'rgba(0, 255, 204, 0.4)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        updateParticle(particle);
        drawParticle(particle);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(0, 255, 204, ${0.12 - distance / 800})`;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: 'radial-gradient(circle at center, #0a0a12 0%, #030305 100%)'
        }}
      />
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 204, 0.05), transparent)',
          height: '20%',
          animation: 'scanline 8s linear infinite'
        }}
      />
    </>
  );
}
