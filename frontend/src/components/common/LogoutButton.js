// src/components/common/LogoutButton.js
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="logout-area">
    <button type="button" className="logout-btn" onClick={handleLogout} title="Sair">
      Sair <FiLogOut size={20} /> 
    </button>
    </div>
  );
}
