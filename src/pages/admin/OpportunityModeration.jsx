import React from 'react';
import { Card } from '../../components/ui';

export default function OpportunityModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Opportunity Moderation</h1>
        <p className="text-text-secondary mt-1">Review, hide, or delete posted opportunities.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Opportunities list will be implemented here.</p>
      </Card>
    </div>
  );
}
