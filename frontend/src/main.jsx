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

import Visitantes from "@pages/Visitantes";

import ThreadDetail from "./pages/ThreadDetail";
import CrearPublicacion from "@pages/publicaciones";
import VerPublicaciones from "@pages/VerPublicaciones";
import MisPublicaciones from "@pages/MisPublicaciones";
import UserPublicaciones from "@pages/UserPublicaciones";
import EspaciosComunes from '@pages/EspaciosComunes';
import SoliEspacios from '@pages/SoliEspacios';
import SoliDetalle from '@pages/SoliDetalle';
import SoliEspaciosRes from '@pages/SoliEspaciosRes';
import SoliDetalleAdmin from '@pages/SoliDetalleAdmin';
import AsistenciaAsamblea from '@pages/AsistenciaAsamblea';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
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
        path: "/soliEspacios",
        element: <SoliEspacios />,
      },
      {
        path: "/soliEspacios/:idSolicitud",
        element: <SoliDetalle />,
      },
      {
        path: "/soliEspaciosRes",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <SoliEspaciosRes />
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
      {
        path: "/soliEspaciosRes/:idSolicitud",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <SoliDetalleAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/espaciosComunes",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <EspaciosComunes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/visitantes",
        element: <Visitantes/>, //////////// esta es mi ruta de visitantes
      },
      {
        path: "/asistencia-asamblea",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <AsistenciaAsamblea />
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
