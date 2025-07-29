import '@styles/EspaciosComunes.css'
import useGetEspacios from '../hooks/EspaciosComunes/useGetEspacios.jsx';
import useDeleteEspacio from '../hooks/EspaciosComunes/useDeleteEspacios.jsx';
import useUpdateEspacios from '../hooks/EspaciosComunes/useUpdateEspacios.jsx';
import { useCreateEspacio } from '../hooks/EspaciosComunes/useCreateEspacios.jsx';
import { useEffect } from 'react';

const EspaciosComunes = () => {
    const { EspaciosComunes, fetchEspacios } = useGetEspacios();
    const { HandleDeleteEspacio } = useDeleteEspacio(fetchEspacios);
    const { HandleUpdateEspacio } = useUpdateEspacios(fetchEspacios);
    const { HandleCreateEspacio } = useCreateEspacio(fetchEspacios);

    useEffect(() =>{
        fetchEspacios();
        console.log(EspaciosComunes);
    }, [])

    return(
        <div className="espacios-page">
            <div className='espacios-header'>  
                <h2>Lista de espacios</h2>
                <button className="espacios-add" onClick={() => HandleCreateEspacio()}>Añadir</button>
            </div>
            <table className="espacios-table">
                <thead>
                    <tr>
                        <th>Lugar</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(EspaciosComunes) && EspaciosComunes.length > 0 ? (
                        EspaciosComunes.map((EspacioComun) => (
                            <tr key={EspacioComun.id}>
                                <td>{EspacioComun.nombreEspacio}</td>
                                <td>{EspacioComun.direccionEspacio}</td>
                                <td>
                                    <button className="edit" onClick={() => HandleUpdateEspacio(EspacioComun.id, EspacioComun)}>Editar</button>
                                    <button className="delete" onClick={() => HandleDeleteEspacio(EspacioComun.id)}>Eliminar</button>   
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay espacios comunes disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default EspaciosComunes;