import { createFileRoute } from '@tanstack/react-router'
import RegisterProjectPage from '../pages/RegisterProjectPage'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterProjectPage />
}
