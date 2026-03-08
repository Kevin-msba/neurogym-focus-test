import { useState } from 'react';
import { Button } from '../shared/Button';

export interface CTASectionProps {
  onDownload?: () => void;
  onJoinWaitlist?: (email: string) => void;
}

export function CTASection({ onDownload, onJoinWaitlist }: CTASectionProps) {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  const handleJoinWaitlist = () => {
    setShowEmailInput(true);
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onJoinWaitlist) {
      onJoinWaitlist(email);
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="max-w-md mx-auto space-y-4">
        <Button 
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Download <span className="font-extrabold">NeuroGym</span>
        </Button>
        
        {!showEmailInput ? (
          <Button 
            onClick={handleJoinWaitlist}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Join Early Access
          </Button>
        ) : (
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmitEmail} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Join Waitlist
                </Button>
              </form>
            ) : (
              <div className="text-center py-3 text-green-600 font-medium">
                Thanks! We'll be in touch soon.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
