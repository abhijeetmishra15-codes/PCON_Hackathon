import React from 'react';
import { Card } from '../../components/ui';

export default function EventModeration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Event Moderation</h1>
        <p className="text-text-secondary mt-1">Review, manage, or delete upcoming events.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Events list will be implemented here.</p>
      </Card>
    </div>
  );
}
