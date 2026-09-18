const express = require("express");
const {
  listMessages,
  getMessageById,
  createMessage
} = require("./messageStore");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mensagens = await listMessages();
    res.json({ mensagens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível carregar as mensagens." });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID de mensagem inválido." });
  }

  try {
    const mensagem = await getMessageById(id);

    if (!mensagem) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }

    res.json({ mensagem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível buscar a mensagem." });
  }
});

router.post("/", async (req, res) => {
  const texto =
    typeof req.body?.texto === "string" ? req.body.texto.trim() : "";

  if (!texto) {
    return res.status(400).json({ error: "A mensagem não pode ficar vazia." });
  }

  if (texto.length > 5000) {
    return res
      .status(400)
      .json({ error: "A mensagem pode ter no máximo 5000 caracteres." });
  }

  try {
    const mensagem = await createMessage(texto, "usuario");
    res.status(201).json({ mensagem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível salvar a mensagem." });
  }
});

module.exports = router;
