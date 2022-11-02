import { Toaster } from 'react-hot-toast';
import { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
// import { PrivateRoute } from './routers/privateRoute'
// import { PublicRoute } from './routers/publicRoute'
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import Dashboard from './pages/dashboard';
import Landing from './pages/landing';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';

const authPath = [
  {
    path: '/auth'
  },
  {
    path: '/auth/signin',
    component: <SignIn />
  },
  {
    path: '/auth/signup',
    component: <SignUp />
  },
  {
    path: '/auth/forgot-password',
    component: <ForgotPassword />
  },
  {
    path: '/auth/reset-password',
    component: <ResetPassword />
  }
]

const App = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={
          // <PrivateRoute>
            <Dashboard />
          // </PrivateRoute>
        } />
        <Route path="/landing" element={<Landing />} />
        {authPath.map((item, pageIndex) => (
          <Route key={pageIndex} path={item.path} element={
            pageIndex === 0 ? <Navigate to={authPath[1]} replace /> : 
              // <PublicRoute>
                item.component
              // </PublicRoute>
            
          } />
        ))}
      </Routes>
      <Toaster />
    </Fragment>
  )
}

export default App;
