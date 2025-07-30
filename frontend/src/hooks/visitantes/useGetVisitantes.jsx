import { useState } from "react"
import  { GetVisitantes } from "@services/visitantes.service.js"

export const useGetVisitantes =() =>{
    const [visitantes, setVisitantes] = useState([])

    const fetchVisitantes = async () =>{
        try {
            const data = await GetVisitantes();
            console.log("Respuesta GetVisitantes:", data);
            setVisitantes(data);
        } catch (error) {
            console.error("error en conseguir a los visitantes",error);
            
        }
    }
    return {visitantes, setVisitantes, fetchVisitantes};
}
export default useGetVisitantes;