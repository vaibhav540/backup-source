import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { CustomThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import MainRoutes from "./Routes/routes";
import LoginSide from "./components/auth/LoginSide";
import { CssBaseline } from "@mui/material";
import "./styles/main.css";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isMainPage = location.pathname === "/main";

  React.useEffect(() => {
    if (isMainPage) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => {
      document.body.style.overflowY = '';
    };
  }, [isMainPage]);

  return (
    <>
      <CssBaseline enableColorScheme />
      {isLoginPage ? (
        <LoginSide />
      ) : (
        <Layout>
          <MainRoutes />
        </Layout>
      )}
    </>
  );
};

const App = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;
