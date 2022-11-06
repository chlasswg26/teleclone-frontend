import { Navigate, useLocation } from 'react-router-dom'

export const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('@acc_token')
    const location = useLocation()

    if (!token) {
        return <Navigate to='/auth/signin' state={{ from: location }} replace />
    }

    return children
}
