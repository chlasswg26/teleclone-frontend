import toast, { Toaster } from 'react-hot-toast';
import { Fragment, useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import Dashboard from './pages/dashboard';
import Landing from './pages/landing';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import { PrivateRoute } from './routers/privateRoute';
import { PublicRoute } from './routers/publicRoute';
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { useEffect } from 'react';
import { useEventListener, useUpdateEffect } from 'ahooks';
import ChatPanel from './components/chat-panel';
import EmptyPanel from './components/empty-panel';

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
    withCredentials: true,
    secure: NODE_ENV === 'production'
  });
  const socketUpdateProfile = useSocketEvent(socket, "profile:update");
  const socketSendChat = useSocketEvent(socket, "chat:send");
  const socketAddContact = useSocketEvent(socket, "contact:add");
  const socketDeleteContact = useSocketEvent(socket, "contact:delete");
  const [notification, setNotification] = useState()
  const [activeTab, setActiveTab] = useState(true)

  useEffect(() => {
    Notification.requestPermission();

    socket.emit("profile:read");

    if (NODE_ENV === 'development') {
      console.log('ini error', error)
      
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

  useUpdateEffect(() => {
    if (socketUpdateProfile.lastMessage?.type === "info") {
      toast.success('Profile updated!')

      socket.emit("profile:read")
    }
  }, [socketUpdateProfile.lastMessage, socket]);

  useUpdateEffect(() => {
    if (socketSendChat.lastMessage?.type === "done") {
      const options = {
        body: socketSendChat.lastMessage?.data?.content
          ? socketSendChat.lastMessage?.data?.content?.substring(0, 10)
          : socketSendChat.lastMessage?.data?.attachment_type === "gif"
          ? "Send you sticker"
          : "Send you image",
        icon:
          socketSendChat.lastMessage?.data?.sender?.profile?.avatar ||
          `https://avatars.dicebear.com/api/pixel-art/${socketSendChat.lastMessage?.data?.sender?.profile?.username}-${socketSendChat.lastMessage?.data?.sender?.profile?.id}.svg`,
        dir: "ltr",
      };

      if (
        socket.id === socketSendChat.lastMessage?.data?.recipient?.session_id &&
        !activeTab
      ) {
        setNotification(
          new Notification(
            socketSendChat.lastMessage?.data?.sender?.profile?.name,
            options
          )
        );
      }

      socket.emit("profile:read");
    }
  }, [socketSendChat.lastMessage, socket]);

  useUpdateEffect(() => {
    if (socketAddContact.lastMessage?.type === "info") {
      socket.emit("profile:read");
    }
  }, [socketAddContact.lastMessage]);

  useUpdateEffect(() => {
    if (socketDeleteContact.lastMessage?.type === "info") {
      socket.emit("profile:read");
    }
  }, [socketDeleteContact.lastMessage]);

  useEventListener(
    "close",
    () => {
      notification.close()
    }
  );

  useEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      setActiveTab(true);
    } else {
      setActiveTab(false);
    }
  });

  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<EmptyPanel />} />
          <Route path="message/:contactUsername" element={<ChatPanel />} />
        </Route>
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
