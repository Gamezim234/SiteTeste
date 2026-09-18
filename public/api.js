const API_BASE = "/api/messages";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Erro ao comunicar com o servidor.");
  }

  return data;
}

export async function listarMensagens() {
  const response = await fetch(API_BASE);
  return parseResponse(response);
}

export async function enviarMensagem(texto) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ texto })
  });

  return parseResponse(response);
}
