import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RoleRoute({ allowedRoles }) {

    const { userInfo } = useSelector(state => state.auth);
    if (!userInfo) {
        return <Navigate to='/login' replace />
    }
    return (
        allowedRoles.includes(userInfo.role) ? (<Outlet />) : (<Navigate to='/' replace />)
    );
}

export default RoleRoute;