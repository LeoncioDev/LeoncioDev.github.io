const typingElement = document.getElementById('typing-name');
const typingSpeed = 50; // em ms

const texts = {
  'pt-BR': {
    introText: 'Olá, eu sou João Paulo Leôncio! Bem-vindo ao meu portfólio.\n\n',
    presentationText: [
      'Aqui você encontra meus projetos e trabalhos.',
      'Fique à vontade para explorar e entrar em contato!'
    ]
  },
  'en-US': {
    introText: 'Hi, I’m João Paulo Leôncio! Welcome to my portfolio.\n\n',
    presentationText: [
      'Here you’ll find my projects and work.',
      'Feel free to explore and get in touch!'
    ]
  }
};

let currentLang = 'pt-BR';
let fullText = '';
let index = 0;
const btnLangToggle = document.getElementById('btnLangToggle');

let timeoutId = null; // guardar o timeout para cancelar

const escapeHTML = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function updateFullText() {
  const { introText, presentationText } = texts[currentLang];
  const rawText = introText + presentationText.join('\n');
  fullText = escapeHTML(rawText);
}

function typeEffect() {
  if (!typingElement) return;

  let output = '';
  let tempIndex = index;

  function typeNextChar() {
    if (tempIndex >= fullText.length) return;

    const currentChar = fullText.charAt(tempIndex);

    if (currentChar === '\n') {
      output += '<br>';
    } else {
      output += currentChar;
    }

    tempIndex++;
    typingElement.innerHTML = output;

    if (tempIndex < fullText.length) {
      index = tempIndex;
      timeoutId = setTimeout(() => requestAnimationFrame(typeNextChar), typingSpeed);
    }
  }

  typeNextChar();
}

function toggleLanguage() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  currentLang = currentLang === 'pt-BR' ? 'en-US' : 'pt-BR';
  btnLangToggle.textContent = currentLang === 'pt-BR' ? 'EN' : 'PT';

  if (typingElement) typingElement.innerHTML = '';
  index = 0;

  updateFullText();
  typeEffect();
}

// ======== Controle dos botões Contato e Redes Sociais ========

// Seleção dos elementos para contato e redes sociais
const openContactFormBtn = document.getElementById('openContactFormBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const socialToggle = document.getElementById('socialToggle');
const socialMenu = document.getElementById('socialMenu');

// Função para abrir o modal de contato
function openModal() {
  contactModal.classList.remove('hidden');
  contactModal.setAttribute('aria-hidden', 'false');
  openContactFormBtn.setAttribute('aria-expanded', 'true');
  contactModal.focus();
}

// Função para fechar o modal de contato
function closeModal() {
  contactModal.classList.add('hidden');
  contactModal.setAttribute('aria-hidden', 'true');
  openContactFormBtn.setAttribute('aria-expanded', 'false');
  openContactFormBtn.focus();
}

// Função para abrir/fechar o menu de redes sociais
function toggleSocialMenu() {
  const isHidden = socialMenu.classList.contains('hidden');
  if (isHidden) {
    socialMenu.classList.remove('hidden');
    socialToggle.setAttribute('aria-expanded', 'true');
    socialMenu.focus();
  } else {
    socialMenu.classList.add('hidden');
    socialToggle.setAttribute('aria-expanded', 'false');
    socialToggle.focus();
  }
}

// Eventos para controle dos botões
openContactFormBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora do conteúdo (background)
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) {
    closeModal();
  }
});

// Toggle menu redes sociais
socialToggle.addEventListener('click', toggleSocialMenu);

// Fecha o menu de redes sociais se clicar fora dele
document.addEventListener('click', (e) => {
  if (!socialToggle.contains(e.target) && !socialMenu.contains(e.target)) {
    socialMenu.classList.add('hidden');
    socialToggle.setAttribute('aria-expanded', 'false');
  }
});

// ================================================================

window.addEventListener('DOMContentLoaded', () => {
  if (btnLangToggle) {
    btnLangToggle.textContent = currentLang === 'pt-BR' ? 'EN' : 'PT';
    btnLangToggle.addEventListener('click', toggleLanguage);
  }

  updateFullText();

  if (typingElement) typingElement.innerHTML = '';
  index = 0;
  typeEffect();
});
