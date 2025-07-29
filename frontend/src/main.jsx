"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Users from '@pages/Users'
import Profile from '@pages/Profile'
import ProtectedRoute from '@components/ProtectedRoute'
import Forum from "./pages/Forum";
import ThreadCreatePage from "./pages/ThreadCreatePage";
import ThreadEditPage from "./pages/ThreadEditPage";
import ThreadDetail from "./pages/ThreadDetail";
import CrearPublicacion from "@pages/publicaciones";
import VerPublicaciones from "@pages/VerPublicaciones";
import MisPublicaciones from "@pages/MisPublicaciones";
import UserPublicaciones from "@pages/UserPublicaciones";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      { path: "/crear-publicacion", element: <CrearPublicacion /> },
      { path: "/publicaciones", element: <VerPublicaciones /> },
      { path: "/mis-publicaciones", element: <MisPublicaciones /> },
      { path: "/UserPublicaciones", element: <UserPublicaciones /> },
      {
        path: "/Forum",
        element: <Forum />,
      },
      {
        path: "/threads/create",
        element: <ThreadCreatePage />,
      },
      {
        path: "/threads/:id/edit",
        element: <ThreadEditPage />,
      },
            {
        path: "/threads/:id",
        element: <ThreadDetail />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
