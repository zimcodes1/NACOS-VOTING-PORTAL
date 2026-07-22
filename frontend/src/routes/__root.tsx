import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ToastContainer } from "../components/ui/Toast";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ToastContainer />
    </>
  ),
});