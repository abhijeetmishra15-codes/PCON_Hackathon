import React from 'react';
import { Card } from '../../components/ui';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Admin Analytics</h1>
        <p className="text-text-secondary mt-1">View platform usage and statistics.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Analytics charts will be implemented here.</p>
      </Card>
    </div>
  );
}
