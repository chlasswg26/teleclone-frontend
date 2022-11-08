import { Toaster } from 'react-hot-toast';
import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import Dashboard from './pages/dashboard';
import Landing from './pages/landing';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import { PrivateRoute } from './routers/privateRoute';
import { PublicRoute } from './routers/publicRoute';
import { useSocket } from "socket.io-react-hook";
import { useEffect } from 'react';

const authPath = [
  {
    path: "/auth",
    component: (socket) => <SignIn {...socket} />,
  },
  {
    path: "/auth/signin",
    component: (socket) => <SignIn {...socket} />,
  },
  {
    path: "/auth/signup",
    component: (socket) => <SignUp {...socket} />,
  },
  {
    path: "/auth/forgot-password",
    component: (socket) => <ForgotPassword {...socket} />,
  },
  {
    path: "/auth/reset-password",
    component: (socket) => <ResetPassword {...socket} />,
  },
];

const { REACT_APP_SOCKET, NODE_ENV } = process.env;

const App = () => {
  const { socket, error } = useSocket(REACT_APP_SOCKET, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
    },
    withCredentials: true
  });

  useEffect(() => {
    socket.emit("profile:read");

    if (NODE_ENV === 'development') {
      console.log(error)

      socket.on("connect", () => {
        const catchAllListener = (event, ...args) => {
          console.log(`got events ${event}`);
        };
  
        socket.onAny(catchAllListener);
        socket.offAny(catchAllListener);
      });
    }

    return () => {
      socket.off("connect");
    };
  });

  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard {...socket} />
            </PrivateRoute>
          }
        />
        <Route path="/landing" element={<Landing />} />
        {authPath.map((item, pageIndex) => (
          <Route
            key={pageIndex}
            path={item.path}
            element={<PublicRoute>{item.component(socket)}</PublicRoute>}
          />
        ))}
      </Routes>
      <Toaster />
    </Fragment>
  );
}

export default App;
