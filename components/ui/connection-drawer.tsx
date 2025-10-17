'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have a standard Input component
import { Label } from '@/components/ui/label'; // Assuming you have a standard Label component
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

interface ConnectionDrawerProps {
  platformId: string;
  platformTitle: string;
  onConnect: (platformId: string) => void;
  setDrawerOpen: (open: boolean) => void;
}

export default function ConnectionDrawer({
  platformId,
  platformTitle,
  onConnect,
  setDrawerOpen,
}: ConnectionDrawerProps) {
  const router = useRouter();
  const [shopDomain, setShopDomain] = useState('');
  const [error, setError] = useState('');

  // Handle the logic when the "Connect" button is clicked
  const handleConnect = () => {
    // Check if the platform is Shopify and validate the domain
    if (platformId === 'shopify') {
      const cleanDomain = shopDomain.trim().toLowerCase();
      
      if (!cleanDomain || !cleanDomain.endsWith('.myshopify.com')) {
        setError('Please enter a valid Shopify domain (e.g., mystore.myshopify.com).');
        return;
      }

      // 1. Close the drawer
      setDrawerOpen(false);

      // 2. KEY STEP: Redirect to your API route handler, passing the validated shop domain
      // We pass the shop domain as a query parameter.
      router.push(`/api/auth/${platformId}?shop=${cleanDomain}`);
      
      // We skip the temporary onConnect(platformId) call here. 
      // The state update should ONLY happen after the successful API callback.
    } else {
      // For Meta Ads, Google Ads, etc., which typically use a direct OAuth link
      setDrawerOpen(false);
      router.push(`/api/auth/${platformId}`);
      // Again, skip temporary onConnect call
    }
  };

  const isShopify = platformId === 'shopify';

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-2xl font-bold">
          Connect your {platformTitle} account
        </DrawerTitle>
        <DrawerDescription className="text-lg">
          We'll securely connect to your account to manage ads and pull data.
          This will redirect you to the official {platformTitle} login page.
        </DrawerDescription>
      </DrawerHeader>
      
      {/* Dynamic Input Area for Shopify */}
      <div className="p-4 space-y-4">
        {isShopify && (
          <div className="space-y-2">
            <Label htmlFor="shopify-domain">Your Shopify Store Domain</Label>
            <Input
              id="shopify-domain"
              placeholder="e.g., mystore.myshopify.com"
              value={shopDomain}
              onChange={(e) => {
                setShopDomain(e.target.value);
                setError(''); // Clear error on change
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>

      <DrawerFooter className="pt-4">
        <Button onClick={handleConnect} className="w-full text-lg">
          Connect to {platformTitle}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}