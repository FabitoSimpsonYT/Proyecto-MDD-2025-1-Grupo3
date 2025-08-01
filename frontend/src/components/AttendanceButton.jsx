import React, { useState, useEffect } from 'react';
import { createAttendance, getAttendanceByThread } from '../services/attendance.service';
import { getUsers } from '../services/user.service';

const AttendanceButton = ({ threadId }) => {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const esAdmin = JSON.parse(sessionStorage.getItem('usuario'))?.role === 'administrador';

    useEffect(() => {
        if (esAdmin) {
            loadAttendance();
            loadUsers();
        }
    }, [threadId]);

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

    const handleAttendance = async (asistencia) => {
        try {
            setLoading(true);
            await createAttendance(threadId, asistencia);
            await loadAttendance();
        } catch (error) {
            console.error('Error updating attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!threadId) return null;

    return (
        <div className="attendance-buttons" style={{ marginTop: '10px' }}>
            <button
                onClick={() => handleAttendance(true)}
                disabled={loading}
                className="btn btn-outline-success me-2"
                style={{ fontSize: '1.2rem', padding: '0.3rem 1rem', color: '#198754'  }}
            >
                <span>✓</span>
            </button>
            <button
                onClick={() => handleAttendance(false)}
                disabled={loading}
                className="btn btn-outline-danger"
                style={{ fontSize: '1.2rem', padding: '0.3rem 1rem', color: '#dc3545'  }}
            >
                <span>✕</span>
            </button>

        </div>
    );
};

export default AttendanceButton;
