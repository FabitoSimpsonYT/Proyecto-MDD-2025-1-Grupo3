import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSoliResidente } from '@services/soliEspacios.service';
import useDeleteSoli from '../hooks/soliEspaciosUser/useDeleteSoli';
import useUpdateSoli from '../hooks/soliEspaciosUser/useUpdateSoli';
import '@styles/soliEspaciosFull.css';

const SoliDetalle = () => {
    const { idSolicitud } = useParams();
    const [solicitud, setSolicitud] = useState(null);
    const navigate = useNavigate();
    const { handleDeleteSoli } = useDeleteSoli(undefined, () => navigate('/soliEspacios'));
    const { handleUpdateSoli } = useUpdateSoli(() => navigate('/soliEspacios'));


    useEffect(() => {
        async function fetchSolicitud() {
            const data = await getSoliResidente();
            const found = Array.isArray(data)
                ? data.find(s => String(s.idSolicitud) === String(idSolicitud))
                : null;
            setSolicitud(found);
        }
        fetchSolicitud();
    }, [idSolicitud]);

    if (!solicitud) {
        return <div>Cargando detalles...</div>;
    }

    const espacio = solicitud.espacio || {};
    const usuario = solicitud.Solicitante || {};

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div style={{ flex: 1, maxWidth: '600px' }}>
                    <div className="soliEspacios-full-card">
                        <h2 className="soliEspacios-full-header">Solicitud #{solicitud.idSolicitud}</h2>
                        <div className="soliEspacios-full-content">
                            <div
                                className="soliEspacios-full-info"
                                style={{
                                    display: 'block', 
                                    width: '100%'
                                }}
                            >
                                <p><strong>Espacio:</strong> {espacio.nombreEspacio}</p>
                                <p><strong>Dirección:</strong> {espacio.direccionEspacio}</p>
                                <p>
                                    <strong>Fecha:</strong>{" "}
                                    {solicitud.fechaInicio ? new Date(solicitud.fechaInicio).toLocaleDateString() : ''}
                                    {" - "}
                                    {solicitud.fechaFin ? new Date(solicitud.fechaFin).toLocaleDateString() : ''}
                                </p>
                                <p>
                                    <strong>Hora:</strong> {solicitud.horaInicio} - {solicitud.horaFin}
                                </p>
                                <p>
                                    <strong>Descripción:</strong> {solicitud.descripcion}
                                </p>
                                <p><strong>Estado:</strong> {solicitud.estado}</p>
                                <p><strong>Observaciones:</strong> {solicitud.observaciones}</p>
                                <p><strong>Solicitante:</strong> {usuario.username}</p>
                                <p><strong>RUT:</strong> {usuario.rut}</p>
                                <p><strong>Email:</strong> {usuario.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '24px', gap: '12px' }}>
                    <button className="soliEspacios-full-btn update" onClick={() => handleUpdateSoli(solicitud)}>Actualizar</button>
                    <button className="soliEspacios-full-btn delete" onClick={() => handleDeleteSoli(solicitud.idSolicitud, solicitud.estado)}>Eliminar</button>
                </div>
            </div>
        </div>
);
};


export default SoliDetalle;
