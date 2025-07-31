import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/home.css";

const UserPublicaciones = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosUsuario = JSON.parse(sessionStorage.getItem("usuario"));
    setUsuario(datosUsuario || null);
  }, []);

  return (
    <div className="home-banner">
      <h1 className="titulo">Gestión de Publicaciones</h1>

      <div className="formulario-container">
        <h2 className="subtitulo">¿Quieres hacer una nueva publicación?</h2>
        <button
          className="btn-principal"
          onClick={() => navigate("/crear-publicacion")}
        >
          Crear publicación
        </button>
      </div>

      <div className="seccion-publicaciones">
        <h2 className="subtitulo">Publicaciones realizadas</h2>
        <div className="botones-doble">
          {usuario?.role === "administrador" && (
            <button
              className="btn-principal"
              onClick={() => navigate("/publicaciones")}
            >
              Ver publicaciones
            </button>
          )}

          <button
            className="btn-principal"
            onClick={() => navigate("/mis-publicaciones")}
          >
            Ver mis publicaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPublicaciones;

  

