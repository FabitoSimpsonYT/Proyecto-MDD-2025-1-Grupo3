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
import HistorialPagosUsuarioPage from './pages/HistorialPagosUsuarioPage';
import SolicitarPagoPage from './pages/SolicitarPagoPage';
import ProtectedRoute from '@components/ProtectedRoute'
import Forum from "./pages/Forum";
import ThreadCreatePage from "./pages/ThreadCreatePage";
import ThreadEditPage from "./pages/ThreadEditPage";
import Cuentas from "./pages/Cuentas.jsx";
import Pagos from "./pages/Pagos.jsx";

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
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cuentas",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Cuentas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pagos",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Pagos />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/historial-pagos",
        element: (
          <ProtectedRoute>
            <HistorialPagosUsuarioPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/solicitar-pago",
        element: (
          <ProtectedRoute>
            <SolicitarPagoPage />
          </ProtectedRoute>
        ),
      },
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
