export interface PeerComparisonProps {
  userScore: number;
  avgScore: number;
  percentile: number;
}

export function PeerComparison({ userScore, avgScore, percentile }: PeerComparisonProps) {
  const isAboveAverage = userScore >= avgScore;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        How You Compare
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Your Score</span>
          <span className="text-2xl font-bold text-blue-600">{userScore}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Average User</span>
          <span className="text-2xl font-bold text-gray-400">{avgScore}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Your Percentile</span>
            <span className={`text-2xl font-bold ${isAboveAverage ? 'text-green-600' : 'text-orange-600'}`}>
              {percentile}th
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isAboveAverage 
              ? `You scored better than ${percentile}% of users`
              : `${100 - percentile}% of users scored higher`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
