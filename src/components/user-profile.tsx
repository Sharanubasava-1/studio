
'use client';

import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';

export function UserProfile() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-2">
        <Button disabled className="w-full justify-start">
          Signing in...
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
        <div className="flex items-center w-full">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user.photoURL || ''} alt={'Anonymous User'} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">Anonymous User</p>
            <p className="text-xs text-muted-foreground truncate">{user.uid}</p>
          </div>
        </div>
      </Button>
    </div>
  );
}
