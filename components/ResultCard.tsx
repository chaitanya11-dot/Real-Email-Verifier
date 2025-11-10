import React from 'react';
import { ValidationStatus, type ValidationResult } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, UserIcon } from './icons';

interface ResultCardProps {
  result: ValidationResult;
}

const statusConfig = {
  [ValidationStatus.Valid]: {
    icon: <CheckCircleIcon />,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-300',
  },
  [ValidationStatus.Invalid]: {
    icon: <XCircleIcon />,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-300',
  },
  [ValidationStatus.Risky]: {
    icon: <ExclamationTriangleIcon />,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-300',
  },
  [ValidationStatus.Error]: {
    icon: <XCircleIcon />,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-300',
  },
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const config = statusConfig[result.status];

  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} animate-pulse-fast`}
      style={{ animationIterationCount: 1, animationDuration: '0.5s' }}
    >
      <div className={`flex-shrink-0 ${config.textColor}`}>
        {config.icon}
      </div>
      <div>
        <p className={`font-bold text-lg ${config.textColor}`}>{result.message}</p>
        <p className="text-gray-400 text-sm">{result.details}</p>
        {result.senderName && (
            <div className="mt-3 pt-3 border-t border-gray-700/60 flex items-center gap-2">
                <div className="text-gray-400">
                    <UserIcon />
                </div>
                <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-gray-400">Likely Sender:</span> {result.senderName}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};