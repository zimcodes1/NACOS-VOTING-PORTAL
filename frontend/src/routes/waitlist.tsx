import { createFileRoute } from '@tanstack/react-router'
import ReserveSeatPage from '../pages/ReserveSeatPage'

export const Route = createFileRoute('/waitlist')({
  component: RouteComponent,
  beforeLoad: () => {
    document.title = "Waitlist & Seat Reservation | NACOS Exhibition 2026"
  }
})

function RouteComponent() {
  return <ReserveSeatPage />
}
