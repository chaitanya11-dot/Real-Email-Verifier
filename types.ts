export enum ValidationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  Risky = 'risky',
  Error = 'error',
}

// Interface for the data object within the Hunter.io API response
export interface HunterApiData {
  status: string; // "valid", "invalid"
  result: 'deliverable' | 'undeliverable' | 'risky';
  score: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

// Interface for the top-level Hunter.io API response
export interface HunterApiResponse {
  data: HunterApiData;
  errors?: { id: string; code: number; details: string }[];
}


export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  details: string;
  senderName?: string;
}
