import React from 'react';
import { Card } from '../../components/ui';

export default function UserVerification() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">User Verification</h1>
        <p className="text-text-secondary mt-1">Approve or reject new alumni registrations.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">Verification queue will be implemented here.</p>
      </Card>
    </div>
  );
}
