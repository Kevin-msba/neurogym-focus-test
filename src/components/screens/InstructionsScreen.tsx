import { memo } from 'react';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';

export interface InstructionsScreenProps {
  onStartGame: () => void;
}

export const InstructionsScreen = memo(function InstructionsScreen({ onStartGame }: InstructionsScreenProps) {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
          How the Focus Test Works
        </h1>
        
        {/* Instructions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <ol className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                1
              </span>
              <span className="pt-1">A symbol (number or letter) will appear every second</span>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                2
              </span>
              <span className="pt-1">Press LEFT if it is a number</span>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                3
              </span>
              <span className="pt-1">Press RIGHT if it is a letter</span>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                4
              </span>
              <span className="pt-1">But occasionally the rule will change</span>
            </li>
          </ol>
        </div>
        
        {/* Rule Change Example */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 mb-6">
          <p className="text-amber-900 font-medium text-center">
            Rule Change: Numbers → RIGHT, Letters → LEFT
          </p>
        </div>
        
        {/* Final Instruction */}
        <p className="text-center text-gray-700 text-lg mb-8">
          Respond as fast and accurately as possible
        </p>
        
        {/* Start Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onStartGame}
            className="text-lg px-8 py-4"
          >
            Start Test
          </Button>
        </div>
      </div>
    </Container>
  );
});
