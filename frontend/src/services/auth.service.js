import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function login(user) {
    try {
        const response = await axios.post('/auth/login', {
            email: user.email,
            password: user.password
        });
        const { status, data } = response;
        if(status === 200) {
            const { username, email, rut, rol } = jwtDecode(data.accessToken);
            sessionStorage.setItem('usuario', JSON.stringify({
                username, 
                email, 
                rut, 
                rol
            }));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            cookies.set('jwt-auth', data.accessToken, {path:'/'});
            return response.data;
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function register(data) {
    try {
        const response = await axios.post('/auth/register', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
