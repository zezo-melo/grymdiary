import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMensagem(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // redireciona após 2s
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao redefinir senha");
    }
  };

  return (
    <div className="reset-container">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <label>Nova senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Salvar nova senha</button>
      </form>

      {mensagem && <p className="success">{mensagem}</p>}
      {erro && <p className="error">{erro}</p>}
    </div>
  );
}
