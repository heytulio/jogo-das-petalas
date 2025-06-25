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

  document.getElementById("btnAjuda").addEventListener("click", () => {
    console.log("aqui");
    alert(
      "🌼 Como jogar:\n\n" +
        "• Clique nas letras para tentar adivinhar a palavra secreta!\n" +
        "• Você tem 6 chances. Cada erro faz uma pétala da flor cair! 🌸😱\n" +
        "• Quer arriscar? Clique em 'PALPITE COMPLETO' para tentar a palavra toda.\n" +
        "• Se errar o palpite completo, a flor murcha de vez!\n\n" +
        "Boa sorte, detetive das flores! 🕵️‍♂️🌷"
    );
  });

  const btnGuess = document.getElementById("btnGuess");
  const inputPalpite = document.getElementById("palpiteDaPalavra");
  inputPalpite.addEventListener("keypress", (event) => {
    if (event.key === "Enter") handlePalpiteCompleto(inputPalpite.value.trim());
  });

  let palpiteVisivel = false;
  btnGuess.addEventListener("click", (event) => {
    palpiteVisivel = !palpiteVisivel;
    handleBotaoPalpite(palpiteVisivel);
  });
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

  if (palavra.length < 3) {
    alert("Preencha com uma palavra válida!");
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
  document.getElementById("palpiteDaPalavra").disabled = false;
  document.getElementById("btnGuess").disabled = false;
  handleBotaoPalpite(false);
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

function handlePalpiteCompleto(palpite) {
  if (palpite.length < 3) {
    alert("Insira uma palavra valida!");
    return;
  }

  if (palpite == palavraSecreta) {
    venceu();
    document.getElementById("palavra").textContent = [...palavraSecreta]
      .map((letra) => letra.toUpperCase())
      .join(" ");
    desabilita();
  } else {
    perdeu();
    desabilita();
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
  document.getElementById("palpiteDaPalavra").disabled = true;
  document.getElementById("btnGuess").disabled = true;
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

function handleBotaoPalpite(palpiteVisivel) {
  const btnGuess = document.getElementById("btnGuess");
  const inputPalpite = document.getElementById("palpiteDaPalavra");

  if (palpiteVisivel) {
    inputPalpite.style.display = "block";
    btnGuess.innerText = "VOLTAR";
  } else {
    inputPalpite.style.display = "none";
    inputPalpite.value = "";
    btnGuess.innerText = "PALPITE COMPLETO";
  }
}

const bancoPalavras = [
  { palavra: "girassol", dica: "Flor amarela que segue o sol" },
  { palavra: "Alemanha", dica: "País com bandeira preta, vermelha e amarela" },
  { palavra: "Brasil", dica: "País com a capital Brasília" },
  { palavra: "França", dica: "País famoso pela Torre Eiffel" },
  {
    palavra: "Violão",
    dica: "Instrumento com 6 cordas muito usado em músicas",
  },
  { palavra: "Piano", dica: "Instrumento de teclas pretas e brancas" },
  { palavra: "Verde", dica: "Cor formada por amarelo + azul" },
  { palavra: "Sete", dica: "Resultado da conta 21 ÷ 3" },
  { palavra: "Treze", dica: "O sexto número primo" },
  { palavra: "Abelha", dica: "Inseto que faz mel" },
  { palavra: "Tigre", dica: "Grande felino listrado que vive na Ásia" },
  { palavra: "Fóssil", dica: "Restos de seres antigos preservados em rochas" },
  { palavra: "Oceano", dica: "Cobre grande parte do planeta Terra" },
  { palavra: "Planeta", dica: "A Terra é um exemplo disso" },
  { palavra: "Urano", dica: "Planeta com nome de deus grego do céu" },
  { palavra: "Cacto", dica: "Planta que vive no deserto e tem espinhos" },
  { palavra: "Girafa", dica: "Animal de pescoço longo que vive na savana" },
  { palavra: "Astronauta", dica: "Pessoa que viaja pelo espaço" },
  { palavra: "Dinossauro", dica: "Animal que viveu há milhões de anos" },
  { palavra: "Chocolate", dica: "Doce feito de cacau muito amado!" },
];

const botaoTema = document.getElementById("theme");

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("tema-escuro");

  const temaClaro = !document.body.classList.contains("tema-escuro");
  botaoTema.textContent = temaClaro ? "🌙" : "☀️";

  localStorage.setItem("tema", temaClaro ? "claro" : "escuro");
});
window.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "escuro") {
    document.body.classList.add("tema-escuro");
    botaoTema.textContent = "☀️";
  } else {
    botaoTema.textContent = "🌙";
  }
});
