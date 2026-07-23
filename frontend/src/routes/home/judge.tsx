import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/home/judge")({
  component: () => <Outlet />,
  beforeLoad: () => {
    document.title = "Judge Dashboard | NACOS Software Exhibition"
  }
});
