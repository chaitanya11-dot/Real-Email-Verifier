import React, { useState, useCallback } from 'react';
import { ValidationStatus, type ValidationResult } from './types';
import { validateEmail } from "./services/emailValidator.ts";
import { ResultCard } from './components/ResultCard';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleValidation = useCallback(async () => {
    if (!email) {
      setResult({
        status: ValidationStatus.Error,
        message: 'Please enter an email address.',
        details: 'The input field is empty.'
      });
      return;
    }
    
    // A more comprehensive regex for email format validation, based on common standards.
    // This helps catch obvious errors before making an API call.
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        setResult({
            status: ValidationStatus.Error,
            message: 'Invalid email format.',
            details: 'Please enter a valid email address structure (e.g., user@example.com).'
        });
        return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const validationResponse = await validateEmail(email);
      setResult(validationResponse);
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        status: ValidationStatus.Error,
        message: 'API Error',
        details: error instanceof Error ? error.message : 'An unknown error occurred while verifying the email.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [email]);
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleValidation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Real Email Verifier
            </h1>
            <p className="text-gray-400 mt-2">
              Instantly check if an email address actually exists.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email address..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleValidation}
              disabled={isLoading || !email}
              className="w-full p-3 bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[100px]">
          {result && <ResultCard result={result} />}
        </div>
      </div>
       <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Powered by the Hunter.io Email Verifier API.</p>
       </footer>
    </div>
  );
};

export default App;