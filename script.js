/* =========================================================
   CONFIGURAÇÕES: edite só esta parte
   ========================================================= */
const CONFIG = {
    nome: "Cursi Tattoo",
    whatsapp: "5567992175023",          // DDI + DDD + número, só números
    instagram: "cursi_gaby_tattoo",     // sem o @
    endereco: "Endereço: R. DA 2, 1660 - Deoclécio Artuzzi, Dourados - MS, 79839-408",
    pastaPortifolio: "portifolio",      // Nome da pasta onde você vai jogar as fotos numeradas
    totalFotosAutomaticas: 60           // Procura automaticamente de 1.jpg até 60.jpg
};

// Fotos em destaque da pasta "imagens/" (opcional, caso queira filtrar por estilo)
const minhasTatuagens = [
    { arquivo: "estilo1.jpg", descricao: "Lobo", estilo: "Realismo", pasta: "imagens" },
    { arquivo: "estilo2.jpg", descricao: "Floral", estilo: "Fine Line", pasta: "imagens" },
    { arquivo: "estilo3.jpg", descricao: "Geométrico", estilo: "Blackwork", pasta: "imagens" }
];

/* =========================================================
   Não precisa mexer daqui para baixo
   ========================================================= */

// ---------- Dados básicos nos lugares certos ----------
const elEndereco = document.getElementById("endereco");
if (elEndereco) elEndereco.textContent = CONFIG.endereco;

const elInsta = document.getElementById("link-insta");
if (elInsta) elInsta.href = `https://www.instagram.com/${CONFIG.instagram}`;

const elWhats = document.getElementById("link-whats");
if (elWhats) {
    elWhats.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Vi seu portfólio e gostaria de um orçamento.")}`;
}

// ---------- Botão flutuante do WhatsApp ----------
const whatsappFlutuante = document.getElementById("whatsapp-flutuante");
if (whatsappFlutuante) {
    whatsappFlutuante.href =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Vi seu portfólio e gostaria de um orçamento.")}`;
}

// ---------- Galeria Automática + Filtros ----------
const galeriaDiv = document.getElementById("galeria");
const filtrosDiv = document.getElementById("filtros");
const estilos = ["Todos", "Fine Line", "Caligrafia", "Delicada", "Realismo", "Blackwork", "Cover Up"];

function criarCardFoto(tatoo) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "foto-card";
    card.setAttribute("aria-label", `Ampliar: ${tatoo.descricao} (${tatoo.estilo})`);

    const caminho = `${tatoo.pasta || "imagens"}/${tatoo.arquivo}`;

    const img = document.createElement("img");
    img.src = caminho;
    img.alt = `${tatoo.descricao}, estilo ${tatoo.estilo}`;
    img.loading = "lazy";

    // Se a foto numerada ainda não existir na pasta "portifolio", remove o quadro automaticamente
    img.onerror = function () {
        card.remove();
    };

    const legenda = document.createElement("span");
    legenda.className = "foto-card__legenda";
    legenda.textContent = tatoo.descricao;
    const estiloTxt = document.createElement("small");
    estiloTxt.textContent = tatoo.estilo;
    legenda.appendChild(estiloTxt);

    card.append(img, legenda);
    card.addEventListener("click", () => abrirLightbox(tatoo));
    galeriaDiv.appendChild(card);
}

function desenharGaleria(estilo) {
    if (!galeriaDiv) return;
    galeriaDiv.innerHTML = "";

    // 1. Mostra as fotos cadastradas manualmente
    const listaManual = estilo === "Todos"
        ? minhasTatuagens
        : minhasTatuagens.filter(t => t.estilo === estilo);

    listaManual.forEach(tatoo => criarCardFoto(tatoo));

    // 2. Quando estiver na aba "Todos", carrega automaticamente 1.jpg, 2.jpg, 3.jpg... da pasta "portifolio/"
    if (estilo === "Todos") {
        for (let i = 1; i <= CONFIG.totalFotosAutomaticas; i++) {
            criarCardFoto({
                arquivo: `${i}.jpeg`,
                descricao: `Trabalho #${i}`,
                estilo: "Cursi Tattoo",
                pasta: CONFIG.pastaPortifolio
            });
        }
    }
}

if (filtrosDiv) {
    estilos.forEach((estilo, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "filtro" + (i === 0 ? " ativo" : "");
        b.textContent = estilo;
        b.addEventListener("click", () => {
            filtrosDiv.querySelectorAll(".filtro").forEach(x => x.classList.remove("ativo"));
            b.classList.add("ativo");
            desenharGaleria(estilo);
        });
        filtrosDiv.appendChild(b);
    });
}
desenharGaleria("Todos");

// Estilos também no formulário
const campoEstilo = document.getElementById("campo-estilo");
if (campoEstilo) {
    ["Ainda não sei", ...estilos.slice(1)].forEach(e => campoEstilo.add(new Option(e, e)));
}

// ---------- Lightbox ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbLegenda = document.getElementById("lightbox-legenda");

function abrirLightbox(tatoo) {
    if (!lightbox || !lbImg) return;
    lbImg.src = `${tatoo.pasta || "imagens"}/${tatoo.arquivo}`;
    lbImg.alt = tatoo.descricao;
    if (lbLegenda) lbLegenda.textContent = `${tatoo.descricao} | ${tatoo.estilo}`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const btnFechar = document.getElementById("lightbox-fechar");
    if (btnFechar) btnFechar.focus();
}

function fecharLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
}

const btnFecharLb = document.getElementById("lightbox-fechar");
if (btnFecharLb) btnFecharLb.addEventListener("click", fecharLightbox);
if (lightbox) lightbox.addEventListener("click", e => { if (e.target === lightbox) fecharLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && lightbox && !lightbox.hidden) fecharLightbox(); });

// ---------- Slides do topo ----------
const slides = document.querySelectorAll(".slide");
const pontosDiv = document.getElementById("hero-pontos");

if (slides.length > 0 && pontosDiv) {
    let slideAtual = 0;
    let timer;

    slides.forEach((_, i) => {
        const p = document.createElement("button");
        p.type = "button";
        p.className = "ponto" + (i === 0 ? " ativo" : "");
        p.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
        p.addEventListener("click", () => { irParaSlide(i); reiniciarTimer(); });
        pontosDiv.appendChild(p);
    });

    function irParaSlide(n) {
        slides[slideAtual].classList.remove("ativo");
        pontosDiv.children[slideAtual].classList.remove("ativo");
        slideAtual = n % slides.length;
        slides[slideAtual].classList.add("ativo");
        pontosDiv.children[slideAtual].classList.add("ativo");
    }

    function reiniciarTimer() {
        clearInterval(timer);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            timer = setInterval(() => irParaSlide(slideAtual + 1), 6000);
        }
    }
    reiniciarTimer();
}

// ---------- Menu mobile ----------
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {
    function alternarMenu(abrir) {
        menu.classList.toggle("aberto", abrir);
        menuBtn.setAttribute("aria-expanded", String(abrir));
    }
    menuBtn.addEventListener("click", () => alternarMenu(!menu.classList.contains("aberto")));
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => alternarMenu(false)));
}

// ---------- Formulário -> WhatsApp ----------
const formContato = document.getElementById("form-contato");
if (formContato) {
    formContato.addEventListener("submit", e => {
        e.preventDefault();
        const d = new FormData(e.target);
        const texto =
            `Olá! Meu nome é ${d.get("nome")}.\n` +
            `Telefone: ${d.get("telefone")}\n` +
            `Estilo: ${d.get("estilo")}\n` +
            `Ideia: ${d.get("mensagem")}`;
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    });
}

// ---------- Topo transparente sobre a imagem; fica sólido ao rolar ----------
const topo = document.getElementById("topo");
if (topo) {
    function atualizarTopo() { topo.classList.toggle("rolou", window.scrollY > 40); }
    window.addEventListener("scroll", atualizarTopo, { passive: true });
    atualizarTopo();
}

// ---------- Botão Voltar ao Topo ----------
const btnTopo = document.getElementById("btn-topo");

if (btnTopo) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnTopo.style.display = "block";
        } else {
            btnTopo.style.display = "none";
        }
    });

    btnTopo.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
