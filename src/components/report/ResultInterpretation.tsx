export interface ResultInterpretationProps {
  score: number;
}

export function ResultInterpretation({ score }: ResultInterpretationProps) {
  const isLowScore = score < 70;
  
  return (
    <div className={`rounded-lg p-6 ${isLowScore ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
      <h3 className={`text-lg font-semibold mb-3 ${isLowScore ? 'text-orange-800' : 'text-green-800'}`}>
        What This Means
      </h3>
      
      {isLowScore ? (
        <div className="space-y-3 text-gray-700">
          <p>
            Your results suggest elevated cognitive switching costs and unstable attention patterns during digital tasks.
          </p>
          <p>
            Users with similar scores report losing 1–2 hours of productive focus daily due to task fragmentation.
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          <p>
            Your results indicate strong focus stability and effective cognitive switching abilities.
          </p>
          <p>
            You demonstrate good attention control and minimal cognitive switching costs during digital tasks.
          </p>
        </div>
      )}
    </div>
  );
}
