import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";


const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Metodología de Desarrollo</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon"/> Inicio
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon"/> Usuarios
              </NavLink>
            </li>
          )}
          <li>
              <NavLink to="/UserPublicaciones" className="nav-item">
                <img src="/publicacion-file.png" alt="Publicaciones" className="icon-publicaciones" /> 
                <span className="nav-text">Publicaciones</span>
              </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon"/> Perfil
            </NavLink>
          </li>
        <li>
          <NavLink to="/forum">
            <span className="icon">💬</span> Foro
          </NavLink>
        </li>
          <li style={{ height: "70%" }}/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon"/> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
