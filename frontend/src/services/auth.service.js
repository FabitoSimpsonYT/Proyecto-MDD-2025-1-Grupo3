import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function registerService(datauser) {
    try {
        const response = await axios.post("/auth/register", {
            username: datauser.username,
            email: datauser.email,
            rut: datauser.rut,
            password: datauser.password,
        })

        return response
    } catch (error) {
        console.error("Error en auth.service");
        return error.response;
    }
}

export async function loginService(datauser) {
    try {
        const response = await axios.post('/auth/login', {
            email: datauser.email,
            password: datauser.password
        });

        const { status, data } = response;
        if (status === 200) {
            const decoded = jwtDecode(data.accessToken);

            const { id, username, email, rut, role } = decoded;
            const userData = { id, username, email, rut, role };

            sessionStorage.setItem('usuario', JSON.stringify(userData));
            sessionStorage.setItem('id', id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            cookies.set('jwt-auth', data.accessToken, { path: '/' });
            return response;
        }
    } catch (error) {
        console.error("Error en auth.service");
        return error.response;
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión', error)
    }
}
