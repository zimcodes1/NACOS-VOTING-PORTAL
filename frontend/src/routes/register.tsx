import { createFileRoute } from '@tanstack/react-router'
import Register from '../app/public/Register'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
  beforeLoad: () => {
    document.title = "Register | NACOS Software Exhibition"
  }
})

function RouteComponent() {
  return <Register />
}
