import { useState } from 'react';
import { GetAllSoli } from '@services/soliEspaciosAdmin.service.js';


export const useGetAllSoli = () => {
    const [soli, setSoli] = useState([]);
    
    const fetchSoli = async () => {
        try {
            const data = await GetAllSoli();
            setSoli(data);
        } catch (error) {
            console.error('Error al conseguir solicitudes:', error);
        }
    };

    
    return { soli, setSoli, fetchSoli };
}

export default useGetAllSoli;