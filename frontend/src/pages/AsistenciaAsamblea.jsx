import React, { useEffect, useState } from 'react';
import { getThreads } from '../services/forum.service';
import AttendanceList from '../components/AttendanceList';

const AsistenciaAsamblea = () => {
    const [asambleas, setAsambleas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsambleas = async () => {
            setLoading(true);
            try {
                const threads = await getThreads();
                setAsambleas(threads.filter(t => t.tipo === 'asamblea'));
            } catch (error) {
                setAsambleas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAsambleas();
    }, []);

    if (loading) return <div>Cargando asambleas...</div>;
    if (!asambleas.length) return <div>No hay asambleas registradas.</div>;

    return (
        <div style={{ maxWidth: 800, margin: '15rem auto 2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: '2rem' }}>
            <h2>Asistencia a Asambleas</h2>
            {asambleas.map(asamblea => (
                <div key={asamblea.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                    <h4>{asamblea.titulo}</h4>
                    <div style={{ color: '#888', marginBottom: 8 }}>
                        Creado por: {asamblea.creadoPor} | {new Date(asamblea.createdAt).toLocaleString()}
                    </div>
                    <AttendanceList threadId={asamblea.id} tipo={asamblea.tipo} />
                </div>
            ))}
        </div>
    );
};

export default AsistenciaAsamblea;
