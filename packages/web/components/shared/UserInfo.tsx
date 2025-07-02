'use client';

import { useUser } from '../../lib/hooks/use-user';

export function UserInfo() {
  const { user, isAuthenticated, logout } = useUser();

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user?.image && (
          <img
            src={user.image}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div>
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
      </div>
      <button
        onClick={logout}
        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
