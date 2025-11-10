export enum ValidationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  Risky = 'risky',
  Error = 'error',
}

export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  details: string;
  senderName?: string;
}

// Fix: Add DomainInfo interface to resolve the module export error.
export interface DomainInfo {
  domain: string;
  ageInDays: number;
  registrar: string;
  registeredDate: string;
  expiryDate: string;
}
