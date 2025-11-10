import React from 'react';
import { type DomainInfo } from '../types';

interface DomainInfoCardProps {
  domainInfo: DomainInfo;
}

export const DomainInfoCard: React.FC<DomainInfoCardProps> = ({ domainInfo }) => {
  return (
    <div className="mt-4 p-4 bg-gray-800/30 border border-gray-700 rounded-lg animate-pulse-fast"
         style={{ animationIterationCount: 1, animationDuration: '0.5s' }}>
      <h3 className="text-lg font-bold text-teal-300 mb-3">Domain Insights</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-400">Domain:</dt>
          <dd className="font-mono text-gray-200">{domainInfo.domain}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-400">Domain Age (Days):</dt>
          <dd className="font-mono text-gray-200">{domainInfo.ageInDays.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-400">Registrar:</dt>
          <dd className="font-mono text-gray-200">{domainInfo.registrar}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-400">Registered On:</dt>
          <dd className="font-mono text-gray-200">{domainInfo.registeredDate}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-400">Expires On:</dt>
          <dd className="font-mono text-gray-200">{domainInfo.expiryDate}</dd>
        </div>
      </dl>
    </div>
  );
};
