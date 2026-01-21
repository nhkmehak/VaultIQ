'use client';

export default function PasswordStrength({ analysis }) {
  if (!analysis) return null;

  const getColor = (strength) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">Password Strength:</span>
        <span className={`text-sm font-bold capitalize ${
          analysis.strength === 'weak' ? 'text-red-600' :
          analysis.strength === 'moderate' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {analysis.strength}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all ${getColor(analysis.strength)}`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}