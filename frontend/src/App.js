import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import MonthGrid from "./components/months/MonthGrid";
import MyCalendar from "./components/calendar/Calendar";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";

function AppRoutes() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // token verificado sempre que renderiza

  const handleAuthSuccess = () => {
    navigate("/"); // redireciona após login/cadastro
  };

  const handleSelectMonth = (monthIndex) => {
    navigate(`/calendar/${monthIndex}`);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MonthGrid onSelectMonth={handleSelectMonth} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/calendar/:month"
        element={
          isAuthenticated ? (
            <MyCalendar />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>    
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
