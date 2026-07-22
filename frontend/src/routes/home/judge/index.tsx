import { createFileRoute } from "@tanstack/react-router";
import JudgeDashboard from "../../../pages/home/JudgeDashboard";

export const Route = createFileRoute("/home/judge/")({
  component: JudgeDashboard,
});
