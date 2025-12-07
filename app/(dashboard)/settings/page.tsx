'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Users, Palette, Globe } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';

const settingsSections = [
  {
    title: 'General',
    description: 'Manage your general academy settings',
    icon: SettingsIcon,
    href: routes.settings.general,
  },
  {
    title: 'Appearance',
    description: 'Customize the look and feel',
    icon: Palette,
    href: routes.settings.appearance,
  },
  {
    title: 'Localization',
    description: 'Language, timezone, and regional settings',
    icon: Globe,
    href: routes.settings.localization,
  },
  {
    title: 'Roles & Permissions',
    description: 'Manage user roles and access control',
    icon: Users,
    href: routes.settings.roles,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your academy configuration and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
