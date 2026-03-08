import { memo } from 'react';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';

export interface LandingPageProps {
  onStartTest: () => void;
}

export const LandingPage = memo(function LandingPage({ onStartTest }: LandingPageProps) {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* Copyright Notice */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          For HKUBS MSBA7036 Group C Project Use Only
        </p>
      </div>

      <div className="max-w-3xl">
        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Measure. Train. Improve<br />Your Cognitive Performance
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
          Take a 30-second Focus Test to discover how stable your attention really is.
        </p>
        
        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 mb-8">
          This quick interactive challenge reveals how digital distractions affect your cognitive stability.
        </p>
        
        {/* CTA Button */}
        <Button 
          onClick={onStartTest}
          className="text-lg px-8 py-4 mb-4"
        >
          Start the 30-Second Focus Test
        </Button>
        
        {/* Subtext */}
        <p className="text-sm text-gray-500">
          No signup required • Takes 30 seconds
        </p>
      </div>
    </Container>
  );
});
