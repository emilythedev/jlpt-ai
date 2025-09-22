import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/grammar" className="[&.active]:font-bold">
          文法
        </Link>
      </div>
      <hr />
      <div className="container mx-auto py-8 flex flex-col items-center">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
