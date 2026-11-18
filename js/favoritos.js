
const gradeFavoritos = document.getElementById("grade-favoritos");
const quantidadeFavoritos = document.getElementById("quantidade-favoritos");

// Recupera os favoritos salvos no navegador
function obterFavoritos() {
    return JSON.parse(localStorage.getItem("fifthBloomFavoritos")) || [];
}

// Atualiza a quantidade de favoritos
function atualizarQuantidade() {
    const favoritos = obterFavoritos();

    quantidadeFavoritos.textContent =
        favoritos.length === 1
            ? "1 produto"
            : `${favoritos.length} produtos`;
}

// Exibe os produtos favoritos
function mostrarFavoritos() {
    const favoritos = obterFavoritos();

    atualizarQuantidade();

    if (favoritos.length === 0) {
        gradeFavoritos.innerHTML = `
            <div class="favoritos-vazios">
                <div class="coracao-vazio">♡</div>
                <h3>Seu cantinho está vazio!</h3>
                <p>Você ainda não adicionou nenhum produto aos seus favoritos.</p>
                <a href="produtos.html">EXPLORAR PRODUTOS</a>
            </div>
        `;

        return;
    }

    gradeFavoritos.innerHTML = "";

    favoritos.forEach((produto, index) => {
        gradeFavoritos.innerHTML += `
            <article class="card-favorito">

                <button class="remover-favorito"
                    onclick="removerFavorito(${index})"
                    aria-label="Remover dos favoritos">
                    ♥
                </button>

                <div class="imagem-favorito">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>

                <div class="info-favorito">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>

                    <strong class="preco-favorito">
                        R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                    </strong>

                    <button class="adicionar-favorito"
                        onclick="adicionarSacola('${produto.nome}')">
                        ADICIONAR À SACOLA
                    </button>
                </div>

            </article>
        `;
    });
}

// Remove um produto dos favoritos
function removerFavorito(index) {
    const favoritos = obterFavoritos();

    favoritos.splice(index, 1);

    localStorage.setItem("fifthBloomFavoritos", JSON.stringify(favoritos));

    mostrarFavoritos();
}

// Ação provisória do botão da sacola
function adicionarSacola(nome) {
    alert(nome + " foi selecionado!");
}

// Inicializa a página
mostrarFavoritos();
