import axios from './root.service.js';

const API_URL = 'http://localhost:3000/api';

export const createAttendance = async (threadId, asistencia) => {
    try {
        const response = await axios.post(`${API_URL}/attendance/create`, {
            threadId,
            asistencia
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAttendanceByThread = async (threadId) => {
    try {
        const response = await axios.get(`${API_URL}/attendance/${threadId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
