import FormularioPublicacion from "@components/FormularioPublicacion";
import { useNavigate } from "react-router-dom";

const CrearPublicacion = () => {
  const navigate = useNavigate();


  return (
    <div className="formulario-wrapper">
      <h2>Crear nueva publicación</h2>
      <FormularioPublicacion
        modo="crear"
        onSuccess={() => navigate("/home")}
      />
    </div>
  );
};

export default CrearPublicacion;
