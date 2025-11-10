import { ValidationStatus, type ValidationResult, type HunterApiResponse } from '../types';

const API_KEY = '23043b900602d307845b36d794b1fec3c8e7e0da';

export const validateEmail = async (email: string): Promise<ValidationResult> => {
  const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    
    const data: HunterApiResponse = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors?.[0]?.details || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    
    if (data.errors) {
      throw new Error(data.errors[0].details || 'Unknown API error');
    }

    const { result, score, first_name, last_name } = data.data;
    
    let senderName: string | undefined = undefined;
    const fullName = [first_name, last_name].filter(Boolean).join(' ').trim();
    if (fullName) {
      senderName = fullName;
    }

    switch (result) {
      case 'deliverable':
        return {
          status: ValidationStatus.Valid,
          message: 'Email is Deliverable',
          details: `This email is valid. Hunter score: ${score}/100.`,
          senderName: senderName,
        };
      case 'risky':
        return {
          status: ValidationStatus.Risky,
          message: 'Email is Risky',
          details: `This email may be a catch-all or have other issues. Hunter score: ${score}/100.`,
          senderName: senderName,
        };
      case 'undeliverable':
        return {
          status: ValidationStatus.Invalid,
          message: 'Email is Undeliverable',
          details: `This email address likely does not exist. Hunter score: ${score}/100.`,
        };
      default:
        // This case handles any unexpected 'result' values from the API
        return {
          status: ValidationStatus.Risky,
          message: 'Email Status Unknown',
          details: `The API returned an unrecognized result: '${result}'.`,
        };
    }

  } catch (error) {
    console.error('Hunter API validation error:', error);
    return {
      status: ValidationStatus.Error,
      message: 'API Communication Error',
      details: error instanceof Error ? error.message : 'An unknown error occurred while contacting the validation service.',
    };
  }
};