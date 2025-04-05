require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("node:crypto");

const JWT_SECRET = process.env.JWT_SECRET;

// Configuração do Mailtrap (substitua por suas credenciais reais)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "SEU_USER_DO_MAILTRAP",
    pass: "SEU_PASS_DO_MAILTRAP",
  },
});

// Cadastro
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Usuário já existe" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erro ao autenticar" });
  }
});

// Esqueci minha senha
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "E-mail não encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    user.resetToken = token;
    user.resetTokenExpires = expiration;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: '"Grym Diary" <no-reply@grymdiary.com>',
      to: email,
      subject: "Redefinição de senha",
      html: `
        <h3>Redefinição de senha</h3>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>O link expira em 1 hora.</p>
      `,
    });

    res.json({ message: "E-mail de recuperação enviado com sucesso" });
  } catch (err) {
    console.error("Erro ao enviar e-mail", err);
    res.status(500).json({ message: "Erro ao enviar e-mail" });
  }
});

// Redefinir senha com token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // verifica se o token ainda está válido
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error("Erro ao redefinir senha", err);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
});


module.exports = router;
