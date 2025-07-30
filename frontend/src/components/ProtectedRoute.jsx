import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.some(role => [user?.rol].includes(role) || [user?.rol].includes("admin") || [user?.rol].includes("administrador"))) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
