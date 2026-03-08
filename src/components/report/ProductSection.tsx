export function ProductSection() {
  const benefits = [
    'Detects attention instability in real time',
    'Predicts cognitive fatigue before productivity drops',
    'Provides personalized focus training and interventions'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        How <span className="text-blue-600 font-extrabold">NeuroGym</span> Helps
      </h2>
      
      <p className="text-gray-700 mb-6">
        <span className="text-blue-600 font-bold">NeuroGym</span> continuously measures cognitive fatigue and helps restore focus using AI-powered cognitive training.
      </p>
      
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <svg 
              className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span className="text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
