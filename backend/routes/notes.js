const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const verifyToken = require("../middleware/verifyToken");
const { encrypt, decrypt } = require("../utils/crypto");

// GET - Buscar todas as notas do usuário logado
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });

    const decryptedNotes = notes.map((note) => {
      let decryptedTitle = "";
      try {
        decryptedTitle = note.title ? decrypt(note.title) : "";
      } catch (e) {
        console.warn(`Falha ao descriptografar nota ${note._id}:`, e.message);
      }
      return {
        ...note._doc,
        title: decryptedTitle,
      };
    });

    res.status(200).json(decryptedNotes);
  } catch (err) {
    console.error("Erro ao buscar notas:", err);
    res.status(500).json({ message: "Erro ao buscar notas", error: err.message });
  }
});

// POST - Criar nova nota
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!req.body.title || typeof req.body.title !== "string") {
      return res.status(400).json({ message: "Título é obrigatório e deve ser uma string" });
    }

    const encryptedNote = new Note({
      ...req.body,
      title: encrypt(req.body.title),
      userId: req.userId,
    });

    const saved = await encryptedNote.save();

    res.status(201).json({
      ...saved._doc,
      title: req.body.title,
    });
  } catch (err) {
    console.error("Erro ao criar nota:", err);
    res.status(400).json({ message: "Erro ao criar nota", error: err.message });
  }
});

// PUT - Atualizar uma nota do usuário
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (!req.body.title || typeof req.body.title !== "string") {
      return res.status(400).json({ message: "Título é obrigatório e deve ser uma string" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...req.body,
        title: encrypt(req.body.title),
      },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "Nota não encontrada" });

    res.status(200).json({
      ...updatedNote._doc,
      title: req.body.title,
    });
  } catch (err) {
    console.error("Erro ao atualizar nota:", err);
    res.status(400).json({ message: "Erro ao atualizar nota", error: err.message });
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
    console.error("Erro ao deletar nota:", err);
    res.status(400).json({ message: "Erro ao deletar nota", error: err.message });
  }
});

module.exports = router;
