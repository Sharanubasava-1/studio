
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { History, LayoutDashboard, ListChecks } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/user-profile';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function AppContent({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, loading } = useUser();

  useEffect(() => {
    if (auth && !user && !loading) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed", error);
      });
    }
  }, [auth, user, loading]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="ghost" className="h-10 w-full justify-start px-2 text-lg font-bold">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            <span className="font-headline">TaskMaster Pro</span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/tasks">
                  <ListChecks />
                  Tasks
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/audit-log">
                  <History />
                  Audit Log
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold font-headline">TaskMaster Pro</h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen w-full bg-background text-foreground')}>
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
