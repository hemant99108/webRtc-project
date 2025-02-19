import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SemiProtectedRoute = ({ element }) => {
    const { user, isAuth } = useSelector((state) => state.auth);

    if (!isAuth) return <Navigate to="/" replace />;
    if (isAuth && !user.activated) return element;
    return <Navigate to="/rooms" replace />;
};

export default SemiProtectedRoute;
