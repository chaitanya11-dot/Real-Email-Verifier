// Fix: Refactor to use Google Gemini API for email validation and domain analysis.
import { GoogleGenAI } from "@google/genai";
import { ValidationStatus, type ValidationResult, type DomainInfo } from '../types';

// Per instructions, API key must be from process.env
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

interface GeminiResponse {
  is_deliverable: 'deliverable' | 'undeliverable' | 'risky';
  reason: string;
  full_name?: string;
  domain_info?: {
      domain: string;
      age_in_days: number;
      registrar: string;
      registered_date: string;
      expiry_date: string;
  }
}

function extractJson(text: string): GeminiResponse | null {
    const match = text.match(/```json\n([\s\S]+)\n```/);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]) as GeminiResponse;
        } catch (e) {
            console.error('Failed to parse JSON from Gemini response', e);
            return null;
        }
    }
    // Fallback for raw JSON without markdown
    try {
        return JSON.parse(text) as GeminiResponse;
    } catch (e) {
        return null;
    }
}

export const validateEmail = async (email: string): Promise<{validationResult: ValidationResult, domainInfo: DomainInfo | null}> => {
  const domain = email.split('@')[1];

  const prompt = `
    Please act as an expert email and domain analyst.
    Analyze the email address: "${email}".
    1.  Determine if the email address is likely "deliverable", "undeliverable", or "risky". An email is risky if it's a catch-all or has other potential issues.
    2.  Provide a brief reason for your determination.
    3.  If possible, find the likely full name of the email owner.
    4.  Using your search capabilities, find information about the domain "${domain}": its age in days, registrar, registration date, and expiration date.

    Your response MUST be a single JSON object enclosed in a markdown code block (\`\`\`json ... \`\`\`).
    The JSON object should have the following structure:
    {
      "is_deliverable": "...", // "deliverable", "undeliverable", or "risky"
      "reason": "...", // your brief explanation
      "full_name": "...", // full name or null
      "domain_info": {
        "domain": "${domain}",
        "age_in_days": ..., // number
        "registrar": "...", // string
        "registered_date": "...", // YYYY-MM-DD
        "expiry_date": "..." // YYYY-MM-DD
      } // or null if not found
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Using pro for better reasoning and instruction following
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      }
    });

    const resultJson = extractJson(response.text);
    
    if (!resultJson) {
        throw new Error("Failed to get a valid JSON response from the API.");
    }
    
    let status: ValidationStatus;
    let message: string;

    switch(resultJson.is_deliverable) {
        case 'deliverable':
            status = ValidationStatus.Valid;
            message = 'Email is Deliverable';
            break;
        case 'risky':
            status = ValidationStatus.Risky;
            message = 'Email is Risky';
            break;
        case 'undeliverable':
            status = ValidationStatus.Invalid;
            message = 'Email is Undeliverable';
            break;
        default:
            status = ValidationStatus.Risky;
            message = 'Email Status Unknown';
    }

    const validationResult: ValidationResult = {
        status: status,
        message: message,
        details: resultJson.reason || "No details provided.",
        senderName: resultJson.full_name || undefined
    };

    const domainInfo: DomainInfo | null = resultJson.domain_info ? {
        domain: resultJson.domain_info.domain,
        ageInDays: resultJson.domain_info.age_in_days,
        registrar: resultJson.domain_info.registrar,
        registeredDate: resultJson.domain_info.registered_date,
        expiryDate: resultJson.domain_info.expiry_date
    } : null;

    return { validationResult, domainInfo };

  } catch (error) {
    console.error('Gemini API validation error:', error);
    return {
      validationResult: {
        status: ValidationStatus.Error,
        message: 'API Communication Error',
        details: error instanceof Error ? error.message : 'An unknown error occurred while contacting the validation service.',
      },
      domainInfo: null
    };
  }
};
