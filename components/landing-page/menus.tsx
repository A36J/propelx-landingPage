"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";

// No longer need most of the imports since the menu is static
// import { CalendarRangeIcon, CircleHelp, HashIcon, Newspaper, UsersIcon } from 'lucide-react';
// import Link from 'next/link';
// import React from 'react';
// import Icons from "./global/icons";


const Menu = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* How it works - Now a static div */}
                <NavigationMenuItem>
                    <div className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground w-max cursor-pointer">
                        How it works
                    </div>
                </NavigationMenuItem>

                {/* Features - Now a static div, content removed */}
                <NavigationMenuItem>
                    <div className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground w-max cursor-pointer">
                        Features
                    </div>
                </NavigationMenuItem>

                {/* Pricing - Now a static div */}
                <NavigationMenuItem>
                    <div className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground w-max cursor-pointer">
                        Pricing
                    </div>
                </NavigationMenuItem>

                {/* Integrations - Now a static div */}
                <NavigationMenuItem>
                    <div className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground w-max cursor-pointer">
                        Integrations
                    </div>
                </NavigationMenuItem>

                {/* Resources - Now a static div, content removed */}
                <NavigationMenuItem>
                    <div className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground w-max cursor-pointer">
                        Resources
                    </div>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
};

export default Menu