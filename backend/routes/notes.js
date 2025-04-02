const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const verifyToken = require("../middleware/verifyToken");

// GET - Buscar todas as notas do usuário logado
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar notas", error: err });
  }
});

// POST - Criar nova nota
router.post("/", verifyToken, async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.userId });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Erro ao criar nota", error: err });
  }
});

// PUT - Atualizar uma nota do usuário
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Nota não encontrada" });
    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar nota", error: err });
  }
});

// DELETE - Deletar uma nota do usuário
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Nota não encontrada" });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar nota", error: err });
  }
});

module.exports = router;
