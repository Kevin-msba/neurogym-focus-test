import { GameResults } from '../../types';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { ScoreCard } from '../report/ScoreCard';
import { PeerComparison } from '../report/PeerComparison';
import { ResultInterpretation } from '../report/ResultInterpretation';
import { ProductSection } from '../report/ProductSection';
import { CTASection } from '../report/CTASection';

export interface ReportScreenProps {
  results: GameResults;
  onTryAgain: () => void;
}

export function ReportScreen({ results, onTryAgain }: ReportScreenProps) {
  // Handle missing or invalid results
  if (!results) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto space-y-8 text-center py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            No Results Available
          </h1>
          <p className="text-gray-600">
            It looks like you haven't completed a test yet.
          </p>
          <Button onClick={onTryAgain}>
            Start Test
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Your Cognitive Snapshot
        </h1>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard
            label="Focus Stability Score"
            value={results.focusStabilityScore}
            suffix=" / 100"
            description="Overall cognitive performance"
          />
          <ScoreCard
            label="Switching Cost"
            value={results.switchingCost}
            suffix=" ms"
            description="Time penalty when rules change"
          />
          <ScoreCard
            label="Daily Focus Loss"
            value={results.dailyFocusLoss}
            suffix=" hours"
            description="Estimated productivity impact"
          />
        </div>

        {/* Peer Comparison */}
        <PeerComparison
          userScore={results.focusStabilityScore}
          avgScore={results.simulatedAvgScore}
          percentile={results.percentile}
        />

        {/* Result Interpretation */}
        <ResultInterpretation score={results.focusStabilityScore} />

        {/* Product Section */}
        <ProductSection />

        {/* CTA Section */}
        <CTASection />

        {/* Try Again Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onTryAgain}
            variant="secondary"
            className="px-8"
          >
            Try Again
          </Button>
        </div>
      </div>
    </Container>
  );
}
