import { useState } from 'react'
import { getEspacios } from '@services/espacios.service.js'

const useGetEspacios = () => {
    const [EspaciosComunes, setEspacios] = useState([])
    
    const fetchEspacios = async () => {
        try {
            const data = await getEspacios();
            console.log('Respuesta espacios:', data);
            setEspacios(data.data);
        } catch (error) {
            console.error("Error al conseguir espacios: ", error);
        }
    }

    return { EspaciosComunes, setEspacios, fetchEspacios };
}

export default useGetEspacios;