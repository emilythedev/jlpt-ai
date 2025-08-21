import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/revision/result')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/revision/result"!</div>
}
