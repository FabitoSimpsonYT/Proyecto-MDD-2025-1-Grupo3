import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Error404 from './pages/Error404';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Error404 />} />
    </Routes>
  </BrowserRouter>
);