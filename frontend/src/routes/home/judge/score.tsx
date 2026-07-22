import { createFileRoute } from "@tanstack/react-router";
import JudgeScoringPage from "../../../pages/home/JudgeScoringPage";

export const Route = createFileRoute("/home/judge/score")({
  component: JudgeScoringPage,
});
