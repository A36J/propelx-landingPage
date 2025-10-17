'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Drawer } from '@/components/ui/drawer';
import ConnectionDrawer from './connection-drawer';

interface ConnectionCardProps {
  id: string;
  title: string;
  logo: string;
  isConnected: boolean;
  onConnect: (platformId: string) => void;
  onDisconnect: (platformId: string) => void;
}

export default function ConnectionCard({
  id,
  title,
  logo,
  isConnected,
  onConnect,
  onDisconnect,
}: ConnectionCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setDrawerOpen(true);
    } else {
      onDisconnect(id);
    }
  };

  return (
    <Card className="flex items-center justify-between p-6 shadow-md transition-shadow hover:shadow-lg">
      {/* ⬅️ LEFT SIDE: Logo and Text ⬅️ */}
      <div className="flex items-center space-x-6">
        <Image
          src={logo}
          alt={`${title} logo`}
          width={48}
          height={48}
          className="rounded-lg"
          unoptimized
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
        </div>
      </div>

      {/* ➡️ RIGHT SIDE: Switch (removed DrawerTrigger wrapper) ➡️ */}
      <Switch
        checked={isConnected}
        onCheckedChange={handleToggle}
        aria-label={`Toggle connection for ${title}`}
      />

      {/* Drawer component (not wrapping the Switch) */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <ConnectionDrawer
          platformId={id}
          platformTitle={title}
          onConnect={onConnect}
          setDrawerOpen={setDrawerOpen}
        />
      </Drawer>
    </Card>
  );
}