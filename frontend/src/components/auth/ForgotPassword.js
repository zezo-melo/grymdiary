import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/forgot-password`, {
        email,
      });
      setMensagem(response.data.message || "E-mail enviado com sucesso!");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao enviar e-mail");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Grym Diary</h1>
      <h2 className="auth-subtitle">Recuperar Senha</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar link de recuperação</button>
      </form>
      {mensagem && <p className="success">{mensagem}</p>}
      {erro && <p className="error">{erro}</p>}

      <button
        type="button"
        className="link-btn"
        onClick={() => navigate("/login")}
      >
        Voltar para o login
      </button>
    </div>
  );
}
