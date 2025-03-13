const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/notes");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect("mongodb://localhost:27017/grymdiary", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.error("Erro ao conectar ao MongoDB", err));

// Definir as rotas
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
