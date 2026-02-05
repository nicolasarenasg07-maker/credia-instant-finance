import { useEffect, useRef } from 'react';

export function AINetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulsePhase: number;
    }

    const nodes: Node[] = [];
    const nodeCount = 50;
    const connectionDistance = 150;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(47, 128, 237, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw node with pulse effect
        const pulse = Math.sin(time * 0.002 + node.pulsePhase) * 0.5 + 0.5;
        const radius = node.radius + pulse * 2;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 3
        );
        gradient.addColorStop(0, 'rgba(45, 212, 191, 0.8)');
        gradient.addColorStop(0.5, 'rgba(47, 128, 237, 0.3)');
        gradient.addColorStop(1, 'rgba(47, 128, 237, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${0.6 + pulse * 0.4})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
