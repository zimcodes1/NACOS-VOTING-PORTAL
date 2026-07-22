import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ToastContainer } from "../components/ui/Toast";
import NotFoundPage from "../pages/NotFoundPage";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ToastContainer />
    </>
  ),
  notFoundComponent: NotFoundPage,
});