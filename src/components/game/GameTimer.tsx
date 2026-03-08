interface GameTimerProps {
  timeRemaining: number;
}

export function GameTimer({ timeRemaining }: GameTimerProps) {
  // Convert milliseconds to seconds with one decimal place for smooth countdown
  const seconds = (timeRemaining / 1000).toFixed(1);

  return (
    <div className="text-2xl md:text-3xl font-bold text-gray-700">
      {seconds}s
    </div>
  );
}
