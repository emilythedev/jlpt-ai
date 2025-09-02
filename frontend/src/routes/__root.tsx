import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient,
}>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/grammar" className="[&.active]:font-bold">
          文法
        </Link>{' '}
        <Link to="/revision" className="[&.active]:font-bold">
          復習
        </Link>
      </div>
      <hr />
      <div className="w-full max-w-xl mx-auto py-8 flex flex-col items-center">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
