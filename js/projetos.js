// Lista de projetos - agora será carregada via JSON
let projetos = []; // ← carregamento dinâmico

// Mapeamento cor das categorias para legenda e classes
const categoriaCores = {
  web: "#1e90ff",
  automation: "#ff8c00",
  datascience: "#32cd32",
  ml: "#ff1493",
  python: "#ffa500",
};

// Ícones básicos para as tecnologias
const techIcons = {
  HTML: "🟧",
  CSS: "🟦",
  Python: "🐍",
  Flask: "🍶",
  PyAutoGUI: "🖱️",
  Selenium: "🌐",
  Pandas: "🐼",
  Matplotlib: "📊",
  "scikit-learn": "🤖",
  TensorFlow: "🧠",
};

// --- ELEMENTOS DO DOM ---
const map = document.getElementById("map");
const projectInfo = document.getElementById("project-info");
const projName = document.getElementById("proj-name");
const projDesc = document.getElementById("proj-desc");
const projTech = document.getElementById("proj-tech");
const projIcons = document.getElementById("proj-icons");
const projLink = document.getElementById("proj-link");
const projDemo = document.getElementById("proj-demo");
const closeBtn = document.getElementById("close-info");
const legendList = document.getElementById("legend-list");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let currentActiveDot = null;

// --- FUNÇÕES ---

// Criar os pontos dos projetos no mapa
function criarDots(projetosList) {
  map.innerHTML = "";
  projetosList.forEach((proj) => {
    const dot = document.createElement("button");
    dot.classList.add("project-dot", proj.categoria);
    dot.setAttribute("role", "listitem");
    dot.setAttribute("aria-label", `Projeto: ${proj.nome}, Categoria: ${proj.categoria}`);
    dot.style.left = `${proj.posicao.x}%`;
    dot.style.top = `${proj.posicao.y}%`;
    dot.title = proj.nome;
    dot.setAttribute("tabindex", "0");

    dot.addEventListener("click", () => mostrarInfoProjeto(proj, dot));
    dot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mostrarInfoProjeto(proj, dot);
      }
    });

    map.appendChild(dot);
  });
}

// Mostrar painel de info do projeto
function mostrarInfoProjeto(proj, dot) {
  if (currentActiveDot) {
    currentActiveDot.classList.remove("active");
  }
  currentActiveDot = dot;
  dot.classList.add("active");

  projName.textContent = proj.nome;
  projDesc.textContent = proj.descricao;
  projTech.textContent = proj.tecnologias.join(", ");

  projIcons.innerHTML = "";
  proj.tecnologias.forEach((tech) => {
    const span = document.createElement("span");
    span.classList.add("tech-icon");
    span.setAttribute("aria-label", tech);
    span.title = tech;
    span.style.fontSize = "20px";
    span.style.userSelect = "none";
    span.textContent = techIcons[tech] || "🔧";
    projIcons.appendChild(span);
  });

  projLink.href = proj.github;
  projLink.textContent = "Ver no GitHub";

  if (proj.demo) {
    projDemo.hidden = false;
    projDemo.href = proj.demo;
    projDemo.textContent = "Ver Demo";
  } else {
    projDemo.hidden = true;
    projDemo.href = "#";
  }

  projectInfo.hidden = false;
  projectInfo.focus();
}

// Fechar painel
function fecharInfo() {
  if (currentActiveDot) {
    currentActiveDot.classList.remove("active");
    currentActiveDot = null;
  }
  projectInfo.hidden = true;
  searchInput.focus();
}

// Criar legenda dinâmica
function criarLegenda() {
  legendList.innerHTML = "";
  Object.entries(categoriaCores).forEach(([cat, cor]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="legend-color" style="background-color: ${cor};"></span> ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
    legendList.appendChild(li);
  });
}

// Filtrar projetos por categoria
function filtrarProjetos(categoria) {
  currentFilter = categoria;
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
    if (btn.dataset.filter === categoria) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    }
  });
  const filtrados = categoria === "all" ? projetos : projetos.filter((p) => p.categoria === categoria);
  criarDots(filtrados);
  fecharInfo();
}

// Buscar projetos pelo nome
function buscarProjetos(termo) {
  termo = termo.toLowerCase();
  let resultados = projetos.filter((p) => p.nome.toLowerCase().includes(termo));
  if (currentFilter !== "all") {
    resultados = resultados.filter((p) => p.categoria === currentFilter);
  }
  criarDots(resultados);
  fecharInfo();
}

// --- EVENTOS ---

closeBtn.addEventListener("click", fecharInfo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !projectInfo.hidden) {
    fecharInfo();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => filtrarProjetos(btn.dataset.filter));
});

searchInput.addEventListener("input", () => buscarProjetos(searchInput.value));

// --- INICIALIZAÇÃO ---

// ... seu código existente ...

// --- INICIALIZAÇÃO ---

criarLegenda();

fetch('projetos.json')
  .then((res) => res.json())
  .then((data) => {
    projetos = data.map(p => ({
      ...p,
      categoria: p.categoria.toLowerCase() // garante lower case
    }));
    criarDots(projetos);

    // Agora que os dados estão carregados, habilitar busca e filtros
    searchInput.disabled = false;
    filterButtons.forEach(btn => btn.disabled = false);
  })
  .catch((err) => {
    console.error('Erro ao carregar projetos:', err);
    map.innerHTML = '<p style="text-align:center; font-style: italic; color:#666">Erro ao carregar projetos.</p>';
  });

// Ajustar fecharInfo para focar somente se searchInput habilitado
function fecharInfo() {
  if (currentActiveDot) {
    currentActiveDot.classList.remove("active");
    currentActiveDot = null;
  }
  projectInfo.hidden = true;
  if (!searchInput.disabled) {
    searchInput.focus();
  }
}
