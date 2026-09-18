const express = require("express");
const {
  listMessages,
  createMessage
} = require("./messageStore");
const {
  pegar_mensagem,
  enviar_mensagem,
  coletar_contexto
} = require("./integrationService");

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

router.get("/context/latest/download", async (req, res) => {
  try {
    const arquivo = await coletar_contexto();

    if (!arquivo) {
      return res.status(404).json({ error: "Ainda não há mensagem do usuário." });
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${arquivo.nomeArquivo}"`
    );
    res.send(arquivo.conteudo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível coletar o contexto." });
  }
});

router.post("/assistant", async (req, res) => {
  try {
    const mensagem = await enviar_mensagem(req.body?.texto);
    res.status(201).json({ mensagem });
  } catch (error) {
    const mensagemErro = error.message || "Não foi possível enviar a resposta.";
    const status = mensagemErro.includes("5000") || mensagemErro.includes("vazia")
      ? 400
      : 500;

    res.status(status).json({ error: mensagemErro });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "ID de mensagem inválido." });
  }

  try {
    const mensagem = await pegar_mensagem(id);

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
