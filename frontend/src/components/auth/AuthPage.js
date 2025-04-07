import React, { useState } from "react";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Preencha todos os campos");

    if (!isLogin && password !== confirm) {
      return alert("As senhas não coincidem");
    }

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await axiosInstance.post(`/api${endpoint}`, {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        onAuthSuccess();
      } else {
        alert(data.message || "Erro na autenticação");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="title">Grym Diary</h2>
      <h2 className="title-login">{isLogin ? "Login" : "Cadastro"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}
        <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
      </form>
      <p>
        {isLogin ? "Não tem conta?" : "Já tem conta?"}
        <button type="button" className="link-button" onClick={toggleMode}>
          {isLogin ? "Cadastre-se" : "Fazer login"}
        </button>
      </p>
      <p>
        <button
          type="button"
          className="link-button"
          onClick={() => navigate("/forgot-password")}
        >
          Esqueci minha senha
        </button>
      </p>
    </div>
  );
}
