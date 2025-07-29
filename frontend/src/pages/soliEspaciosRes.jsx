import '@styles/soliEspaciosRes.css';
import useGetAllSoli from '../hooks/soliEspaciosAdmin/useGetAllSoli.jsx';
import useDeleteSoli from '../hooks/soliEspaciosUser/useDeleteSoli.jsx';
import useUpdateSoliRes from '../hooks/soliEspaciosAdmin/useUpdateSoliRes.jsx'; // <--- usa el hook correcto
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SoliEspaciosRes = () => {
    const { soli, fetchSoli } = useGetAllSoli();
    const { handleDeleteSoli } = useDeleteSoli(fetchSoli);
    const { handleUpdateSoliRes } = useUpdateSoliRes(fetchSoli);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSoli();
        console.log(soli)
    }, []);



    return (
        <div className="soliEspaciosRes-page">
            <div className="soliEspaciosRes-header-flex">
                <h2 className="soliEspaciosRes-title">Solicitudes de Espacios Comunes</h2>
            </div>
            <div className="soliEspaciosRes-container">
                <table className="soliEspaciosRes-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rut</th>
                            <th>Nombre</th>
                            <th>Espacio</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(soli) && soli.length > 0 ? (
                            soli.map((solicitud) => (
                                <tr key={solicitud.idSolicitud}>
                                    <td>{solicitud.idSolicitud}</td>
                                    <td>{solicitud.Solicitante?.rut || ''}</td>
                                    <td>{solicitud.Solicitante?.username || ''}</td>
                                    <td>{solicitud.espacio?.nombreEspacio || ''}</td>
                                    <td>{solicitud.fechaInicio ? new Date(solicitud.fechaInicio).toLocaleDateString() : ''}</td>
                                    <td>{solicitud.horaInicio || ''}</td>
                                    <td>{solicitud.estado || ''}</td>
                                    <td>
                                        <button
                                            className="view"
                                            onClick={() => navigate(`/soliEspaciosRes/${solicitud.idSolicitud}`)}
                                        >
                                            Ver Más
                                        </button>
                                        <button className="response" onClick={() => handleUpdateSoliRes(solicitud)}>Responder</button>
                                        <button className="delete" onClick={() => handleDeleteSoli(solicitud.idSolicitud, solicitud.estado)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : ( 
                            <tr>
                                <td colSpan="8">No hay solicitudes disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SoliEspaciosRes;