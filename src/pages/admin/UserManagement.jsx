import React from 'react';
import { Card } from '../../components/ui';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">User Management</h1>
        <p className="text-text-secondary mt-1">Manage existing student and alumni accounts.</p>
      </div>
      <Card className="p-6">
        <p className="text-text-secondary">User table will be implemented here.</p>
      </Card>
    </div>
  );
}
