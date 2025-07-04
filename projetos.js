const username = "LeoncioDev"; // seu GitHub username

const categoriaCores = {
  web: "#1e90ff",
  automation: "#ff8c00",
  datascience: "#32cd32",
  ml: "#ff1493",
  python: "#ffa500",
};

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
  JavaScript: "✨",
  React: "⚛️",
  Django: "🕸️",
  Jupyter: "📓",
};

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

let projetos = [];
let currentFilter = "all";
let currentActiveDot = null;

async function fetchRepos() {
  const url = `https://api.github.com/users/${username}/repos?per_page=100`;
  const res = await fetch(url);
  if (res.status === 403) {
    throw new Error(
      "Limite de requisições atingido. Tente novamente mais tarde."
    );
  }
  if (!res.ok) throw new Error(`Erro ao buscar repositórios: ${res.status}`);
  return await res.json();
}

async function fetchLanguages(repoName) {
  const url = `https://api.github.com/repos/${username}/${repoName}/languages`;
  const res = await fetch(url);
  if (!res.ok) return {};
  return await res.json();
}

function inferCategoria(langs) {
  const langKeys = Object.keys(langs).map((l) => l.toLowerCase());
  if (langKeys.includes("python")) {
    if (langKeys.some((l) => ["jupyter notebook", "ipynb"].includes(l)))
      return "datascience";
    if (
      langKeys.some((l) =>
        ["tensorflow", "scikit-learn", "pytorch"].includes(l)
      )
    )
      return "ml";
    return "python";
  }
  if (langKeys.includes("javascript") || langKeys.includes("html") || langKeys.includes("css"))
    return "web";
  if (langKeys.includes("shell") || langKeys.includes("batchfile")) return "automation";
  return "python";
}

function inferTecnologias(langs) {
  const techMap = {
    python: "Python",
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    flask: "Flask",
    django: "Django",
    "jupyter notebook": "Jupyter",
    tensorflow: "TensorFlow",
    "scikit-learn": "scikit-learn",
    pandas: "Pandas",
    matplotlib: "Matplotlib",
    selenium: "Selenium",
    pyautogui: "PyAutoGUI",
    react: "React",
  };

  return Object.keys(langs).map((lang) => {
    const key = lang.toLowerCase();
    return techMap[key] || lang;
  });
}

function criarDots(projetosList) {
  map.innerHTML = "";

  const cols = 5;
  const gapX = 100 / (cols + 1);
  const gapY = 100 / (Math.ceil(projetosList.length / cols) + 1);

  projetosList.forEach((proj, i) => {
    const dot = document.createElement("button");
    dot.classList.add("project-dot", proj.categoria);
    dot.setAttribute("role", "listitem");
    dot.setAttribute(
      "aria-label",
      `Projeto: ${proj.nome}, Categoria: ${proj.categoria}`
    );
    const col = (i % cols) + 1;
    const row = Math.floor(i / cols) + 1;
    dot.style.left = `${col * gapX}%`;
    dot.style.top = `${row * gapY}%`;
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

function mostrarInfoProjeto(proj, dot) {
  if (currentActiveDot) {
    currentActiveDot.classList.remove("active");
  }
  currentActiveDot = dot;
  dot.classList.add("active");

  projName.textContent = proj.nome;
  projDesc.textContent = proj.descricao || "Sem descrição.";
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

function criarLegenda() {
  legendList.innerHTML = "";
  Object.entries(categoriaCores).forEach(([cat, cor]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="legend-color" style="background-color: ${cor};"></span> ${
      cat.charAt(0).toUpperCase() + cat.slice(1)
    }`;
    legendList.appendChild(li);
  });
}

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
  const filtrados =
    categoria === "all"
      ? projetos
      : projetos.filter((p) => p.categoria === categoria);
  criarDots(filtrados);
  fecharInfo();
}

function buscarProjetos(termo) {
  termo = termo.toLowerCase();
  let resultados = projetos.filter((p) =>
    p.nome.toLowerCase().includes(termo)
  );
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

async function inicializar() {
  criarLegenda();

  try {
    const repos = await fetchRepos();
    const projetosTemp = [];

    for (const repo of repos) {
      // Ignora o repo do perfil
      if (repo.name.toLowerCase() === "leonciodev") continue;

      const langs = await fetchLanguages(repo.name);

      // Puxa só projetos que tenham Python
      if (!Object.keys(langs).some((lang) => lang.toLowerCase() === "python"))
        continue;

      const categoria = inferCategoria(langs);
      const tecnologias = inferTecnologias(langs);

      projetosTemp.push({
        nome: repo.name,
        descricao: repo.description,
        github: repo.html_url,
        categoria,
        tecnologias,
      });
    }

    projetos = projetosTemp;
    criarDots(projetos);

    searchInput.disabled = false;
    filterButtons.forEach((btn) => (btn.disabled = false));
  } catch (err) {
    console.error("Erro ao carregar projetos do GitHub:", err);
    map.innerHTML =
      '<p style="text-align:center; font-style: italic; color:#666">' +
      err.message +
      "</p>";
  }
}

inicializar();
