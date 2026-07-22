import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/home/judge")({
  component: () => <Outlet />,
});
