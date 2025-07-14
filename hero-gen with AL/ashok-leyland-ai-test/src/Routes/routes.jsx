import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import Main from "../components/Main";

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route
        path="/main/image-query"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/main/video-query"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
     
    </Routes>
  );
};

export default MainRoutes;
