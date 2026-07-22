import { createFileRoute } from '@tanstack/react-router'
import JudgeLogin from '../../app/judges/JudgeLogin'

export const Route = createFileRoute('/home/judge-login')({
  component: JudgeLogin,
})
