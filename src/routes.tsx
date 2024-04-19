import { RouteObject } from "react-router-dom";
import { Home } from "./pages";
import { Edit } from "./pages/edit";

export const PAGES = {
  HOME: {
    path: "/",
    element: <Home />,
  },
  EDIT: {
    path: "/edit",
    element: <Edit />,
  },
};

export const routes: RouteObject[] = [PAGES.HOME, PAGES.EDIT];
