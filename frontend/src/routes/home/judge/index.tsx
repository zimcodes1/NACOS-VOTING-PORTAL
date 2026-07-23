import { createFileRoute } from "@tanstack/react-router";
import JudgeDashboard from "../../../app/judges/JudgeDashboard";

export const Route = createFileRoute("/home/judge/")({
	component: JudgeDashboard,
});
