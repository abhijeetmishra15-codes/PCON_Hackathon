import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, Button, Badge } from '../components/ui';
import { ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function SupabaseTest() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true);
        // We fetch the current session to prove the API connects and validates the anon key successfully.
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
      } catch (err) {
        console.error("Supabase connection error:", err);
        setError(err.message || 'Failed to connect to Supabase');
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-white">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <Database size={32} />
        </div>
        
        <div>
          <h2 className="text-2xl font-extrabold text-text-main mb-2">Supabase Connection Test</h2>
          <p className="text-text-secondary text-sm">Verifying environment variables and API keys.</p>
        </div>

        <div className="bg-secondary/50 rounded-xl p-6 border border-border">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm font-medium text-text-secondary">Connecting to Supabase...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3">
              <ShieldAlert size={32} className="text-danger" />
              <p className="text-sm font-semibold text-danger">Connection Failed</p>
              <p className="text-xs text-danger/80 text-center">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={32} className="text-success" />
              <p className="text-sm font-semibold text-success">Successfully Connected!</p>
              <Badge variant="success" className="mt-2 bg-success/10 text-success border border-success/20">
                {session ? 'Active Session Found' : 'No Active Session (Expected)'}
              </Badge>
              <p className="text-xs text-text-secondary mt-2">
                Client initialized with VITE_SUPABASE_URL and Anon Key.
              </p>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-11"
          onClick={() => window.location.href = '/'}
        >
          Return to App
        </Button>
      </Card>
    </div>
  );
}
