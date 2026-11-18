
const catalogoDetalhes = [
    {
        nome: "BASE VELVET SKIN",
        descricao: "Sérum de cuidado facial para uma pele iluminada.",
        preco: 89.90,
        categoria: "Skincare",
        imagem: "assets/BASE VELVET SKIN.png",
        sobre: "A BASE VELVET SKIN foi pensada para proporcionar um cuidado especial à pele. Um produto que combina beleza e autocuidado, valorizando a sua rotina e realçando sua beleza natural."
    },
    {
        nome: "BLUSH ROSA PÉTALE",
        descricao: "Blush de acabamento delicado e natural.",
        preco: 79.90,
        categoria: "Maquiagem",
        imagem: "assets/BLUSH ROSA PÉTALE.png",
        sobre: "O BLUSH ROSA PÉTALE traz um toque delicado de cor para a maquiagem. Ideal para quem busca um visual suave, elegante e cheio de personalidade."
    },
    {
        nome: "LUMIÈRE GLOSS",
        descricao: "Gloss labial com brilho e textura confortável.",
        preco: 49.90,
        categoria: "Maquiagem",
        imagem: "assets/LUMIÈRE GLOSS.png",
        sobre: "O LUMIÈRE GLOSS é perfeito para complementar sua produção com um brilho especial. Um toque de luminosidade para destacar sua beleza em qualquer ocasião."
    },
    {
        nome: "MASCARA FILLERS D'OR",
        descricao: "Máscara para cílios com acabamento sofisticado.",
        preco: 65.90,
        categoria: "Maquiagem",
        imagem: "assets/MÁSCARA FLEURS D'OR.png",
        sobre: "A MÁSCARA FILLERS D'OR foi escolhida para fazer parte de uma rotina de beleza sofisticada. Um item para destacar o olhar e completar sua maquiagem."
    },
    {
        nome: "CREME BLOOM SUPREME",
        descricao: "Hidratante corporal com textura suave.",
        preco: 119.90,
        categoria: "Hidratantes",
        imagem: "assets/CRÈME BLOOM SUPREME.png",
        sobre: "O CRÈME BLOOM SUPREME representa um momento de cuidado e carinho com o corpo. Sua proposta é tornar a rotina de autocuidado ainda mais especial."
    },
    {
        nome: "ESFOLIANTE CORPORAL",
        descricao: "Esfoliação delicada para uma pele macia.",
        preco: 69.90,
        categoria: "Corpo",
        imagem: "assets/ESFOLIANTE CORPORAL.png",
        sobre: "O ESFOLIANTE CORPORAL é um aliado nos momentos de autocuidado. Um produto pensado para complementar a rotina de cuidados com a pele."
    }
];

const parametros = new URLSearchParams(window.location.search);
const nomeSelecionado = parametros.get("nome");

const produtoAtual = catalogoDetalhes.find(
    produto => produto.nome === nomeSelecionado
);

let quantidadeAtual = 1;

const elementoQuantidade = document.getElementById("quantidade");
const botaoAdicionar = document.getElementById("adicionar-sacola");
const botaoFavorito = document.getElementById("adicionar-favorito");
const mensagemSacola = document.getElementById("mensagem-sacola");

// FORMATAÇÃO DE PREÇO
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// SE O PRODUTO NÃO EXISTIR
if (!produtoAtual) {
    document.querySelector(".detalhes-produto").innerHTML = `
        <div class="produto-nao-encontrado">
            <h2>Produto não encontrado</h2>
            <p>Não conseguimos localizar esse produto.</p>
            <a href="produtos.html">Voltar para os produtos</a>
        </div>
    `;

} else {

    // CARREGAR INFORMAÇÕES
    document.title = produtoAtual.nome + " | FIFTH BLOOM";

    document.getElementById("nome-produto").textContent = produtoAtual.nome;
    document.getElementById("nome-caminho").textContent = produtoAtual.nome;
    document.getElementById("categoria-produto").textContent = produtoAtual.categoria;
    document.getElementById("descricao-produto").textContent = produtoAtual.descricao;
    document.getElementById("preco-produto").textContent = formatarPreco(produtoAtual.preco);
    document.getElementById("texto-sobre-produto").textContent = produtoAtual.sobre;

    const imagem = document.getElementById("imagem-produto");
    imagem.src = produtoAtual.imagem;
    imagem.alt = produtoAtual.nome;

    imagem.onerror = function () {
        this.alt = "Imagem do produto indisponível";
    };

    // AUMENTAR QUANTIDADE
    document.getElementById("aumentar").addEventListener("click", () => {
        quantidadeAtual++;
        elementoQuantidade.textContent = quantidadeAtual;
    });

    // DIMINUIR QUANTIDADE
    document.getElementById("diminuir").addEventListener("click", () => {
        if (quantidadeAtual > 1) {
            quantidadeAtual--;
            elementoQuantidade.textContent = quantidadeAtual;
        }
    });

    // ADICIONAR À SACOLA
    botaoAdicionar.addEventListener("click", () => {

        for (let i = 0; i < quantidadeAtual; i++) {
            adicionarSacola(produtoAtual.nome);
        }

        mensagemSacola.textContent = "Produto adicionado à sua sacola! ♡";
    });

    // FAVORITOS
    function obterFavoritos() {
        return JSON.parse(localStorage.getItem("fifthBloomFavoritos")) || [];
    }

    function atualizarBotaoFavorito() {
        const favoritos = obterFavoritos();

        const jaFavoritado = favoritos.some(
            item => item.nome === produtoAtual.nome
        );

        botaoFavorito.classList.toggle("favoritado", jaFavoritado);
        botaoFavorito.textContent = jaFavoritado ? "♥" : "♡";
    }

    botaoFavorito.addEventListener("click", () => {

        let favoritos = obterFavoritos();

        const existe = favoritos.some(
            item => item.nome === produtoAtual.nome
        );

        if (existe) {
            favoritos = favoritos.filter(
                item => item.nome !== produtoAtual.nome
            );

            mensagemSacola.textContent = "Produto removido dos favoritos.";

        } else {
            favoritos.push(produtoAtual);
            mensagemSacola.textContent = "Produto adicionado aos favoritos! ♡";
        }

        localStorage.setItem("fifthBloomFavoritos", JSON.stringify(favoritos));

        atualizarBotaoFavorito();
    });

    atualizarBotaoFavorito();
}
