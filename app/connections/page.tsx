'use client';

import { useState } from 'react';
import { connections } from '@/lib/types';
import ConnectionCard from '@/components/ui/connection-card';

type ConnectionStatus = {
  [key: string]: { connected: boolean };
};

export default function ConnectionsPage() {
  // Initialize state. We'll set 'google-ads' to true to demonstrate the disconnect flow.
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    'google-ads': { connected: false }, // Set one to true for demonstration
    'meta-ads': { connected: false },
    'shopify': { connected: false },
  });

  const handleConnect = (platformId: string) => {
    // In a real application, this function would be called after a successful 
    // OAuth callback from the platform (e.g., via an API route).
    // Here, we update the local state to simulate a successful connection.
    console.log(`Connection attempt initiated for ${platformId}.`);
    setConnectionStatus((prev) => ({
      ...prev,
      [platformId]: { connected: true },
    }));
  };

  const handleDisconnect = (platformId: string) => {
    // 1. Implement logic to disconnect the account here
    // This would likely involve a server action to revoke the token and clear it from the DB.
    console.log(`Disconnecting ${platformId}...`);

    // 2. Update the local UI state
    setConnectionStatus((prev) => ({
      ...prev,
      [platformId]: { connected: false },
    }));
  };

  return (
      <div className="flex flex-col h-screen">
        <div className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-3 text-2xl backdrop-blur-lg px-8">
          <span>Connections</span>
        </div>
        {/* Main Content Area */}
      <div className="p-8 space-y-6 max-w-4xl mx-auto w-full">
        {connections.map((platform) => (
          <ConnectionCard
            key={platform.id}
            id={platform.id}
            title={platform.title}
            logo={platform.logo}
            // Ensure status exists before accessing it, falling back to false
            isConnected={connectionStatus[platform.id]?.connected ?? false} 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ))}
        </div>
      </div>
  );
}