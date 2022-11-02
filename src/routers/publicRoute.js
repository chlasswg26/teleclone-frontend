import { Navigate, useLocation } from 'react-router-dom'

export const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('@acc_token')
    const location = useLocation()

    if (token) {
        return <Navigate to={location.state?.from?.pathname || '../../'} state={{ from: location }} replace />
    }

    return children
}
