import { AnimatedCounter } from '../shared/AnimatedCounter';

export interface ScoreCardProps {
  label: string;
  value: number;
  suffix: string;
  description?: string;
}

export function ScoreCard({ label, value, suffix, description }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{label}</h3>
      <div className="text-4xl font-bold text-blue-600 mb-2">
        <AnimatedCounter targetValue={value} suffix={suffix} duration={2000} />
      </div>
      {description && (
        <p className="text-xs text-gray-500 text-center">{description}</p>
      )}
    </div>
  );
}
