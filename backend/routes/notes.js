const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// Criar uma nova nota
router.post("/", async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: "Erro ao criar nota", error: err });
  }
});

// Obter todas as notas
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ message: "Erro ao buscar notas", error: err });
  }
});

// Atualizar uma nota existente
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar nota", error: err });
  }
});

// Deletar uma nota
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Nota deletada com sucesso" });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar nota", error: err });
  }
});

module.exports = router;
