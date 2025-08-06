import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect } from "react";
import { protectedUser } from "./apiHandler/auth";
import ProtectedRoute from "./components/protectedRoute";
import { useAuthStore } from "./store/user.store";
import { useSocketStore } from "./store/socket.store";

const App = () => {
  const { login } = useAuthStore();
  const { connect: connectSocket, socket } = useSocketStore();
  useEffect(() => {
    const host = async () => {
      try {
        const res = await protectedUser();
      //  console.log(res);
        if(res?.success) {
          login(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    host();
  }, []);
const userId = useAuthStore(state => state.getCurrentUserId)();
useEffect(() => {
   if(!userId) return
    connectSocket(userId);

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [connectSocket, socket, userId]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
