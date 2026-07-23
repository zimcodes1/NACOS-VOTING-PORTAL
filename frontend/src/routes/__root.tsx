import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ToastContainer } from "../components/ui/Toast";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import NotFoundPage from "../pages/NotFoundPage";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ToastContainer />
      <ScrollToTop />
    </>
  ),
  notFoundComponent: NotFoundPage,
});