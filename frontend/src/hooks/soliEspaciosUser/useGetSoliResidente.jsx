import { useState } from 'react';
import { getSoliResidente } from '@services/soliEspacios.service.js';

export const useGetSoliResidente = () => {
  const [soliResidente, setSoliResidente] = useState([]);

  const fetchSoliResidente = async () => {
    try {
      const data = await getSoliResidente();
      setSoliResidente(data);
    } catch (error) {
      console.error("Error consiguiendo las solicitudes:", error);
    }
  }
  return { soliResidente, fetchSoliResidente };
}

export default useGetSoliResidente;