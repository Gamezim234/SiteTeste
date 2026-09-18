import { enviarMensagem, listarMensagens } from "./api.js";

const form = document.querySelector("#message-form");
const input = document.querySelector("#message-input");
const status = document.querySelector("#status");
const list = document.querySelector("#message-list");
const refreshButton = document.querySelector("#refresh-button");
const submitButton = form.querySelector('button[type="submit"]');

function setStatus(texto) {
  status.textContent = texto;
}

function formatarData(valor) {
  if (!valor) return "";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;

  return data.toLocaleString("pt-BR");
}

function renderizarMensagens(mensagens) {
  list.replaceChildren();

  if (!Array.isArray(mensagens) || mensagens.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Nenhuma mensagem salva.";
    list.appendChild(vazio);
    return;
  }

  for (const mensagem of mensagens) {
    const card = document.createElement("article");
    card.className = "message-card";

    const texto = document.createElement("p");
    texto.textContent = mensagem.texto ?? "";

    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = `ID: ${mensagem.id ?? "?"} · ${formatarData(mensagem.criadoEm)}`;

    card.append(texto, meta);
    list.appendChild(card);
  }
}

async function carregarMensagens() {
  refreshButton.disabled = true;

  try {
    const data = await listarMensagens();
    renderizarMensagens(data.mensagens ?? data);
    setStatus("");
  } catch (error) {
    setStatus(error.message);
  } finally {
    refreshButton.disabled = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  submitButton.disabled = true;
  setStatus("Enviando...");

  try {
    await enviarMensagem(texto);
    input.value = "";
    setStatus("Mensagem salva.");
    await carregarMensagens();
  } catch (error) {
    setStatus(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

refreshButton.addEventListener("click", carregarMensagens);

carregarMensagens();
