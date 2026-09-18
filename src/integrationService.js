const {
  getMessageById,
  getLatestMessage,
  createMessage
} = require("./messageStore");

async function pegar_mensagem(id) {
  return getMessageById(id);
}

async function enviar_mensagem(texto) {
  const conteudo = typeof texto === "string" ? texto.trim() : "";

  if (!conteudo) {
    throw new Error("A resposta não pode ficar vazia.");
  }

  if (conteudo.length > 5000) {
    throw new Error("A resposta pode ter no máximo 5000 caracteres.");
  }

  return createMessage(conteudo, "assistente");
}

async function coletar_contexto() {
  const ultimaMensagem = await getLatestMessage("usuario");

  if (!ultimaMensagem) {
    return null;
  }

  const contexto = {
    mensagem: ultimaMensagem,
    coletadoEm: new Date().toISOString()
  };

  return {
    nomeArquivo: "contexto-ultima-mensagem.json",
    conteudo: JSON.stringify(contexto, null, 2) + "\n"
  };
}

module.exports = {
  pegar_mensagem,
  enviar_mensagem,
  coletar_contexto
};
