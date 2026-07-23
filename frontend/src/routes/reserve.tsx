import { createFileRoute } from '@tanstack/react-router'
import ReserveSeatPage from '../pages/ReserveSeatPage'

export const Route = createFileRoute('/reserve')({
  component: RouteComponent,
  beforeLoad: () => {
    document.title = "Reserve Seat | NACOS Software Exhibition 2026"
  }
})

function RouteComponent() {
  return <ReserveSeatPage />
}
