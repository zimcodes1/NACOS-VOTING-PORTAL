import { createFileRoute } from "@tanstack/react-router";
import ResultsContainer from "../app/public/Results";

export const Route = createFileRoute("/results")({
  component: ResultsContainer,
});
