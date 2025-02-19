import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = ({ element }) => {
    const { isAuth } = useSelector((state) => state.auth);
    return isAuth ? <Navigate to="/rooms" replace /> : element;
};

export default GuestRoute;
