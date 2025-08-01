import '@styles/visitantes.css'
import  useGetVisitantes from '@hooks/visitantes/useGetVisitantes.jsx';
import useDeleteVisitante from '@hooks/visitantes/useDeleteVisitante.jsx';
import { useEffect } from 'react';
import useEditVisitantes from '@hooks/visitantes/useEditVisitantes';
import useCreateVisitante from '@hooks/visitantes/useCreateVisitante.jsx'; 

const Visitantes = () =>{
  
const {visitantes, fetchVisitantes} = useGetVisitantes();
  const {handleDeleteVisitante} = useDeleteVisitante(fetchVisitantes);
   const {handleEditVisitante} = useEditVisitantes(fetchVisitantes);
    const {handleCreateVisitante} = useCreateVisitante(fetchVisitantes);
    const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
    const role = (user.role || user.rol || '').toLowerCase();
    const isAdmin = role === "admin" || role === "administrador";


  /* eslint-disable react-hooks/exhaustive-deps */
 useEffect(() =>{
    fetchVisitantes();
 }, []);
    

    return (
        <div className="visitantes-page">
            <div className='visitantes-header'>
             <h2>Lista De Visitantes</h2>
             <button className='visitantes-addbtn' onClick={handleCreateVisitante}>Añadir</button>
            </div>
            <div className="visitantes-table-scroll">
                <table className="visitantes-table">
                  {isAdmin && (
                    <thead>
                         <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Numero de casa</th>
                            <th>Email</th>
                            <th>Descripcion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                  )}
                  <tbody>
                      {!isAdmin ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No tienes permisos para ver esta información
                          </td>
                        </tr>
                      ) : Array.isArray(visitantes) && visitantes.length > 0 ? (
                        visitantes.map((visitante) => (
                          <tr key={visitante.id}>
                            <td>{visitante.nombre}</td>
                            <td>{visitante.edad}</td>
                            <td>{visitante.numerocasa}</td>
                            <td>{visitante.email}</td>
                            <td>{visitante.descripcion}</td>
                            <td>
                              <button className="edit" onClick={() => handleEditVisitante(visitante.id, visitante)}>actualizar</button>
                              <button className="delete" onClick={() => handleDeleteVisitante(visitante.id)}>Denegar acceso</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No hay visitantes disponibles
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
            </div>
        </div>
    )
}
export default Visitantes;