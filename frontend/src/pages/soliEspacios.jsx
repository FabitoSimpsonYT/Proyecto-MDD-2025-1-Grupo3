import '@styles/soliEspacios.css'
import useGetSoliResidente from '@hooks/soliEspaciosUser/useGetSoliResidente.jsx';
import { useEffect } from 'react';
import useDeleteSoli from '@hooks/soliEspaciosUser/useDeleteSoli.jsx';
import { useCreateSoli } from '@hooks/soliEspaciosUser/useCreateSoli.jsx';
import { useNavigate } from 'react-router-dom';

const SoliEspacios = () => {
    const { soliResidente, fetchSoliResidente } = useGetSoliResidente();
    const { handleDeleteSoli } = useDeleteSoli(fetchSoliResidente);
    const { handleCreateSoli } = useCreateSoli(fetchSoliResidente);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSoliResidente();
    }, []);

    useEffect(() => {
        console.log('Solicitudes en página:', soliResidente);
    }, [soliResidente]);

    return (
       <div className="soliEspacios-page">
        <div className="soliEspacios-header-flex">
          <h2>Lista de Solicitudes</h2>
          <button className="soliEspacios-add" onClick={() => handleCreateSoli()}>Crear Solicitud</button>
        </div>
        <div className="soliEspacios-container">
          <table className="soliEspacios-table">
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Espacio</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {Array.isArray(soliResidente) && soliResidente.length > 0 ? (
                      soliResidente.map((solicitud) => (
                          <tr key={solicitud.idSolicitud}>
                              <td>{solicitud.idSolicitud}</td>
                              <td>{solicitud.espacio?.nombreEspacio || ''}</td>
                              <td>{solicitud.fechaInicio ? new Date(solicitud.fechaInicio).toLocaleDateString() : ''}</td>
                              <td>{solicitud.horaInicio || ''}</td>
                              <td>{solicitud.estado || ''}</td>
                              <td>
                                  <button
                                      className="view"
                                      onClick={() => navigate(`/soliEspacios/${solicitud.idSolicitud}`)}
                                  >
                                      Ver Más
                                  </button>
                                  <button
                                      className="delete"
                                      onClick={() => handleDeleteSoli(solicitud.idSolicitud, solicitud.estado)}
                                  >
                                      Eliminar
                                  </button>
                              </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan="5">No hay solicitudes disponibles</td>
                      </tr>
                  )}
              </tbody>
          </table>
        </div>
       </div>
    )
};

export default SoliEspacios;