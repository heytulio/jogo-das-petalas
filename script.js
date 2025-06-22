const MAX_ERROS = 6;
let palavraSecreta = "",
  dicaAtual = "",
  letrasCertas = [],
  erros = 0,
  modoAtual = 1;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-modo]").forEach((btn) =>
    btn.addEventListener("click", ({ currentTarget }) => {
      modoAtual = +currentTarget.dataset.modo;
      modoAtual === 1 ? comecarSolo() : trocarTela("tela-config");
    })
  );

  document
    .querySelectorAll(".voltar")
    .forEach((b) => b.addEventListener("click", () => trocarTela("tela-menu")));

  document.getElementById("btnIniciar2p").addEventListener("click", comecar2p);

  document
    .getElementById("btnReiniciar")
    .addEventListener("click", () => trocarTela("tela-menu"));
});

function comecarSolo() {
  const palavraSorteada =
    bancoPalavras[Math.floor(Math.random() * bancoPalavras.length)];
  palavraSecreta = limpa(palavraSorteada.palavra);
  dicaAtual = palavraSorteada.dica;
  iniciar();
}

function comecar2p() {
  const palavra = document.getElementById("palavraCustom").value.trim(),
    dica = document.getElementById("dicaCustom").value.trim();
  if (!palavra || !dica) {
    alert("Preencha palavra e dica");
    return;
  }
  palavraSecreta = limpa(palavra);
  dicaAtual = dica;
  document.getElementById("palavraCustom").value = "";
  document.getElementById("dicaCustom").value = "";
  iniciar();
}

function iniciar() {
  letrasCertas = [];
  erros = 0;
  document.getElementById("dica").textContent = `Dica: ${dicaAtual}`;
  mostraMsg("");
  for (let i = 1; i <= MAX_ERROS; i++)
    document.getElementById("pet" + i).style.visibility = "visible";
  geraTeclado();
  atualizaPalavra();
  trocarTela("tela-jogo");
}

function geraTeclado() {
  const div = document.getElementById("letras");
  div.innerHTML = "";
  for (let i = 97; i <= 122; i++) {
    const l = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = l.toUpperCase();
    btn.className = "letra-btn";
    btn.onclick = () => tenta(l, btn);
    div.appendChild(btn);
  }
}

function tenta(letra, button) {
  button.disabled = true;
  if (palavraSecreta.includes(letra)) {
    letrasCertas.push(letra);
    atualizaPalavra();
    if (!document.getElementById("palavra").textContent.includes("_")) venceu();
  } else {
    erra();
  }
}

function atualizaPalavra() {
  document.getElementById("palavra").textContent = [...palavraSecreta]
    .map((l) => (letrasCertas.includes(l) ? l.toUpperCase() : "_"))
    .join(" ");
}

function erra() {
  if (erros < MAX_ERROS)
    document.getElementById("pet" + (erros + 1)).style.visibility = "hidden";
  if (++erros >= MAX_ERROS) perdeu();
}

function venceu() {
  mostraMsg("🎉 Você venceu!", "win");
  desabilita();
}

function perdeu() {
  mostraMsg(
    `🥀 Você perdeu! A palavra era: ${palavraSecreta.toUpperCase()}`,
    "lose"
  );
  desabilita();
}

function mostraMsg(txt, cls = "") {
  const m = document.getElementById("mensagem");
  m.textContent = txt;
  m.className = cls;
}

function desabilita() {
  document.querySelectorAll(".letra-btn").forEach((b) => (b.disabled = true));
}

function limpa(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function trocarTela(id) {
  document
    .querySelectorAll(".tela")
    .forEach((t) => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

const bancoPalavras = [
  { palavra: "girassol", dica: "Flor amarela que segue o sol" },
  {
    palavra: "Alemanha",
    dica: "País com bandeira composta pelas cores amarelo, preto e vermelho",
  },
  { palavra: "Brasil", dica: "País com a capital Brasilia" },
  { palavra: "París", dica: "País com uma grande torre como local turístico" },
  {
    palavra: "Violão",
    dica: "Instrumento com 6 cordas amplamente usado em musicas",
  },
  {
    palavra: "Piano",
    dica: "Instrumento com teclas pretas e brancas presente em músicas classicas",
  },
  { palavra: "Verde", dica: "Cor resultante da mistura de amarelo com azul" },
  { palavra: "Sete", dica: "Resultado da conta 21 / 3" },
  { palavra: "Treze", dica: "O sexto número primo" },
];
