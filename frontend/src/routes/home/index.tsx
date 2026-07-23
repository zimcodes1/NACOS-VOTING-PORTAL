import { createFileRoute } from "@tanstack/react-router";
import DashboardContainer from "../../app/public/Dashboard";

export const Route = createFileRoute("/home/")({
  component: DashboardContainer,
  beforeLoad: () => {
    document.title = "Dashboard | NACOS Software Exhibition"
  }
});
