import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateArticle } from "./pages/CreateArticle";
import { EditArticle } from "./pages/EditArticle";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "articles/:id", Component: ArticleDetail },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "create", Component: CreateArticle },
      { path: "edit/:id", Component: EditArticle },
      { path: "*", Component: NotFound },
    ],
  },
]);
