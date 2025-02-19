import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
    const { user, isAuth } = useSelector((state) => state.auth);

    if (!isAuth) return <Navigate to="/" replace />;
    if (isAuth && !user.activated) return <Navigate to="/activate" replace />;
    return element;
};

export default ProtectedRoute;
