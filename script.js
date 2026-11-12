// Adicione o nome dos arquivos das suas fotos e a descrição delas aqui:
const minhasTatuagens = [
    { arquivo: "tatoo1.jpg", descricao: "Estilo Realismo - Lobo" },
    { arquivo: "tatoo2.jpg", descricao: "Fine Line - Floral" },
    { arquivo: "tatoo3.jpg", descricao: "Blackwork - Geométrico" }
];

const galeriaDiv = document.getElementById("galeria");

minhasTatuagens.forEach(tatoo => {
    const card = document.createElement("div");
    card.classList.add("foto-card");

    card.innerHTML = `
        <img src="imagens/${tatoo.arquivo}" alt="${tatoo.descricao}">
        <p>${tatoo.descricao}</p>
    `;

    galeriaDiv.appendChild(card);
});