/* =========================================================
   CONFIGURAÇÕES: edite só esta parte
   ========================================================= */
const CONFIG = {
    nome: "Cursi Tattoo",
    whatsapp: "5567992175023",          // DDI + DDD + número, só números
    instagram: "cursi_gaby_tattoo",           // sem o @
    endereco: "Endereço: R. DA 2, 1660 - Deoclécio Artuzzi, Dourados - MS, 79839-408"
};

// Fotos ficam na pasta "imagens/". "estilo" é usado nos filtros.
const minhasTatuagens = [
    { arquivo: "tatoo1.jpg", descricao: "Lobo", estilo: "Realismo" },
    { arquivo: "tatoo2.jpg", descricao: "Floral", estilo: "Fine Line" },
    { arquivo: "tatoo3.jpg", descricao: "Geométrico", estilo: "Blackwork" }
];

/* =========================================================
   Não precisa mexer daqui para baixo
   ========================================================= */

// ---------- Dados básicos nos lugares certos ----------
document.getElementById("endereco").textContent = CONFIG.endereco;
document.getElementById("link-insta").href = `https://instagram.com/${CONFIG.instagram}`;
document.getElementById("link-whats").href =
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Vi seu portfólio e gostaria de um orçamento.")}`;


// ---------- Botão flutuante do WhatsApp ----------
const whatsappFlutuante = document.getElementById("whatsapp-flutuante");
if (whatsappFlutuante) {
    whatsappFlutuante.href =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Vi seu portfólio e gostaria de um orçamento.")}`;
}

// ---------- Galeria + filtros ----------
const galeriaDiv = document.getElementById("galeria");
const filtrosDiv = document.getElementById("filtros");
const estilos = ["Todos", ...new Set(minhasTatuagens.map(t => t.estilo))];

function desenharGaleria(estilo) {
    galeriaDiv.innerHTML = "";
    const lista = estilo === "Todos"
        ? minhasTatuagens
        : minhasTatuagens.filter(t => t.estilo === estilo);

    if (!lista.length) {
        galeriaDiv.innerHTML = '<p class="galeria__vazia">Nenhum trabalho neste estilo ainda.</p>';
        return;
    }

    lista.forEach(tatoo => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "foto-card";
        card.setAttribute("aria-label", `Ampliar: ${tatoo.descricao} (${tatoo.estilo})`);

        const img = document.createElement("img");
        img.src = `imagens/${tatoo.arquivo}`;
        img.alt = `${tatoo.descricao}, estilo ${tatoo.estilo}`;
        img.loading = "lazy";

        const legenda = document.createElement("span");
        legenda.className = "foto-card__legenda";
        legenda.textContent = tatoo.descricao;
        const estiloTxt = document.createElement("small");
        estiloTxt.textContent = tatoo.estilo;
        legenda.appendChild(estiloTxt);

        card.append(img, legenda);
        card.addEventListener("click", () => abrirLightbox(tatoo));
        galeriaDiv.appendChild(card);
    });
}

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
desenharGaleria("Todos");

// Estilos também no formulário
const campoEstilo = document.getElementById("campo-estilo");
["Ainda não sei", ...estilos.slice(1)].forEach(e => campoEstilo.add(new Option(e, e)));

// ---------- Lightbox ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbLegenda = document.getElementById("lightbox-legenda");

function abrirLightbox(tatoo) {
    lbImg.src = `imagens/${tatoo.arquivo}`;
    lbImg.alt = tatoo.descricao;
    lbLegenda.textContent = `${tatoo.descricao} | ${tatoo.estilo}`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lightbox-fechar").focus();
}
function fecharLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
}
document.getElementById("lightbox-fechar").addEventListener("click", fecharLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) fecharLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) fecharLightbox(); });

// ---------- Slides do topo ----------
const slides = document.querySelectorAll(".slide");
const pontosDiv = document.getElementById("hero-pontos");
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

// ---------- Menu mobile ----------
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

function alternarMenu(abrir) {
    menu.classList.toggle("aberto", abrir);
    menuBtn.setAttribute("aria-expanded", String(abrir));
}
menuBtn.addEventListener("click", () => alternarMenu(!menu.classList.contains("aberto")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => alternarMenu(false)));

// ---------- Formulário -> WhatsApp ----------
document.getElementById("form-contato").addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const texto =
        `Olá! Meu nome é ${d.get("nome")}.\n` +
        `Telefone: ${d.get("telefone")}\n` +
        `Estilo: ${d.get("estilo")}\n` +
        `Ideia: ${d.get("mensagem")}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});

// ---------- Topo transparente sobre a imagem; fica sólido ao rolar ----------
const topo = document.getElementById("topo");
function atualizarTopo() { topo.classList.toggle("rolou", window.scrollY > 40); }
window.addEventListener("scroll", atualizarTopo, { passive: true });
atualizarTopo();
