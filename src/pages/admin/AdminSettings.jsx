import React from 'react';
import { Card } from '../../components/ui';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Admin Settings</h1>
        <p className="text-text-secondary mt-1">Configure platform-wide preferences.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Settings form will be implemented here.</p>
      </Card>
    </div>
  );
}
