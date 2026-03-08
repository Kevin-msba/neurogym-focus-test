import { useEffect, useRef, useState } from 'react';

export interface ReactionTimeDataPoint {
  time: number;
  reactionTime: number;
  isPostSwitch: boolean;
}

export interface ReactionTimeGraphProps {
  reactionTimeHistory: ReactionTimeDataPoint[];
}

export function ReactionTimeGraph({ reactionTimeHistory }: ReactionTimeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 second animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [reactionTimeHistory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reactionTimeHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max for scaling
    const reactionTimes = reactionTimeHistory.map(d => d.reactionTime);
    const minRT = Math.min(...reactionTimes);
    const maxRT = Math.max(...reactionTimes);
    const rtRange = maxRT - minRT || 1;

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.fillText('Time (s)', width / 2 - 20, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reaction Time (ms)', 0, 0);
    ctx.restore();

    // Calculate visible data points based on animation progress
    const visibleCount = Math.floor(reactionTimeHistory.length * animationProgress);
    const visibleData = reactionTimeHistory.slice(0, visibleCount);

    if (visibleData.length === 0) return;

    // Draw rule switch markers
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    visibleData.forEach((point) => {
      if (point.isPostSwitch) {
        const x = padding + ((point.time / 60000) * (width - 2 * padding));
        ctx.fillRect(x - 2, padding, 4, height - 2 * padding);
      }
    });

    // Draw line graph
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    visibleData.forEach((point, index) => {
      const x = padding + ((point.time / 60000) * (width - 2 * padding));
      const y = height - padding - ((point.reactionTime - minRT) / rtRange) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    visibleData.forEach((point) => {
      const x = padding + ((point.time / 60000) * (width - 2 * padding));
      const y = height - padding - ((point.reactionTime - minRT) / rtRange) * (height - 2 * padding);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [reactionTimeHistory, animationProgress]);

  if (reactionTimeHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Reaction Time Over Time
        </h3>
        <p className="text-gray-500 text-center py-8">No reaction time data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Reaction Time Over Time
      </h3>
      <div className="flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300}
          className="max-w-full"
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Reaction Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Rule Switch</span>
        </div>
      </div>
    </div>
  );
}
