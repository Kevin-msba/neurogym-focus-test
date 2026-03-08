interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  // Clamp progress to 0-100 range
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
