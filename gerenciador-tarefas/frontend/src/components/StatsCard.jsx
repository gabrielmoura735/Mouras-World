import React from 'react';

export default function StatsCard({ title, stat, icon: Icon, colorClass }) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow border border-gray-100">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${colorClass}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-semibold text-gray-900">{stat}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
