import React, { useState, useEffect } from 'react';
import { getAttendanceByThread } from '../services/attendance.service';
import { getUsers } from '../services/user.service';

const AttendanceList = ({ threadId, tipo }) => {
    //
    const [attendance, setAttendance] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const esAdmin = JSON.parse(sessionStorage.getItem('usuario'))?.role === 'administrador';
    useEffect(() => {
        let intervalId;
        if (esAdmin && tipo === 'asamblea') {
            loadAttendance();
            loadUsers();
            intervalId = setInterval(() => {
                loadAttendance();
            }, 3000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [threadId, tipo]);

    const loadUsers = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadAttendance = async () => {
        try {
            const data = await getAttendanceByThread(threadId);
            setAttendance(data);
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    };

    if (!esAdmin || tipo !== 'asamblea' || !attendance) return null;

    return (
        <div className="attendance-list mt-4">
            <h4>Lista de Asistencia</h4>
            <div className="mb-2">
                <small>
                    <strong>Resumen:</strong> Asistirán: {attendance.filter(a => a.asistencia).length} |
                    No asistirán: {attendance.filter(a => !a.asistencia).length}
                </small>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-2">
                            <h6 className="card-title" style={{ color: '#198754' }}>
                                <span className="me-1">✓</span>
                                Asistirán:
                            </h6>
                            <ul className="list-unstyled mb-0" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {attendance
                                    .filter(a => a.asistencia)
                                    .map(a => {
                                        const user = users.find(u => u.id === a.usuarioId);
                                        return (
                                            <li key={a.usuarioId}>
                                                <small>{user ? user.nombre || user.username : 'Usuario ' + a.usuarioId}</small>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-2">
                            <h6 className="card-title" style={{ color: '#dc3545' }}>
                                <span className="me-1">✕</span>
                                No asistirán:
                            </h6>
                            <ul className="list-unstyled mb-0" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {attendance
                                    .filter(a => !a.asistencia)
                                    .map(a => {
                                        const user = users.find(u => u.id === a.usuarioId);
                                        return (
                                            <li key={a.usuarioId}>
                                                <small>{user ? user.nombre || user.username : 'Usuario ' + a.usuarioId}</small>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceList;
