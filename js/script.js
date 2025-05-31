document.addEventListener("DOMContentLoaded", () => {
  const textos = {
    pt: [
      "Olá, eu sou o João Paulo Leôncio.",
      "Sou programador apaixonado por criar soluções eficientes.",
      "Confira meus projetos e contatos abaixo!",
    ],
    en: [
      "Hi, I'm João Paulo Leôncio.",
      "I'm a programmer passionate about creating efficient solutions.",
      "Check out my projects and contacts below!",
    ],
  };

  let idioma = "pt";
  let textoAtualIndex = 0;
  let charIndex = 0;
  const typingSpeed = 60;
  const pauseDelay = 1500;

  const typingElement = document.getElementById("typing-name");
  const btnLangToggle = document.getElementById("btnLangToggle");
  const btnCopy = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("email-text");

  let typingTimeout;

  // Função que faz o efeito de digitação
  const typeText = () => {
    const frases = textos[idioma];
    if (!frases?.length) return;

    const fraseAtual = frases[textoAtualIndex];

    if (charIndex < fraseAtual.length) {
      typingElement.textContent += fraseAtual.charAt(charIndex);
      charIndex++;
      typingTimeout = setTimeout(typeText, typingSpeed);
    } else {
      typingTimeout = setTimeout(eraseText, pauseDelay);
    }
  };

  // Função que apaga o texto
  const eraseText = () => {
    if (charIndex > 0) {
      typingElement.textContent = typingElement.textContent.slice(0, -1);
      charIndex--;
      typingTimeout = setTimeout(eraseText, typingSpeed / 2);
    } else {
      textoAtualIndex = (textoAtualIndex + 1) % textos[idioma].length;
      typingTimeout = setTimeout(typeText, typingSpeed);
    }
  };

  // Inicializa o efeito
  const iniciarTyping = () => {
    clearTimeout(typingTimeout);
    typingElement.textContent = "";
    charIndex = 0;
    typeText();
  };

  iniciarTyping();

  // Alternar idioma
  btnLangToggle.addEventListener("click", () => {
    clearTimeout(typingTimeout);
    textoAtualIndex = 0;
    charIndex = 0;
    typingElement.textContent = "";
    idioma = idioma === "pt" ? "en" : "pt";
    btnLangToggle.textContent = idioma.toUpperCase();
    iniciarTyping();
  });

  // Copiar e-mail
  if (btnCopy && emailText) {
    btnCopy.addEventListener("click", () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        btnCopy.innerHTML = "✔";
        setTimeout(() => {
          btnCopy.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1500);
      }).catch(() => {
        alert("Falha ao copiar o e-mail. Por favor, copie manualmente.");
      });
    });
  }
});
