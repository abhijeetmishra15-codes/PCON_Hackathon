import React from 'react';
import { Card } from '../../components/ui';

export default function BroadcastNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Broadcast Notifications</h1>
        <p className="text-text-secondary mt-1">Send system-wide notifications to specific audiences.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Broadcast form will be implemented here.</p>
      </Card>
    </div>
  );
}
