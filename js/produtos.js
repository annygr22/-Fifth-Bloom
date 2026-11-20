
const produtos = [
    {
        nome: "BASE VELVET SKIN",
        descricao: "Sérum de cuidado facial para uma pele iluminada.",
        preco: 89.90,
        categoria: "skincare",
        imagem: "assets/BASE VELVET SKIN.png"
    },
    {
        nome: "BLUSH ROSA PÉTALE",
        descricao: "Blush de acabamento delicado e natural.",
        preco: 79.90,
        categoria: "maquiagem",
        imagem: "assets/BLUSH ROSA PÉTALE.png"
    },
    {
        nome: "LUMIÈRE GLOSS",
        descricao: "Gloss labial com brilho e textura confortável.",
        preco: 49.90,
        categoria: "maquiagem",
        imagem: "assets/LUMIÈRE GLOSS.png"
    },
    {
        nome: "MASCARA FILLERS D'OR",
        descricao: "Máscara para cílios com acabamento sofisticado.",
        preco: 65.90,
        categoria: "maquiagem",
        imagem: "assets/MÁSCARA FLEURS D'OR.png"
    },
    {
        nome: "CREME BLOOM SUPREME",
        descricao: "Hidratante corporal com textura suave.",
        preco: 119.90,
        categoria: "hidratantes",
        imagem: "assets/CRÈME BLOOM SUPREME.png"
    },
    {
        nome: "ESFOLIANTE CORPORAL",
        descricao: "Esfoliação delicada para uma pele macia.",
        preco: 69.90,
        categoria: "corpo",
        imagem: "assets/ESFOLIANTE CORPORAL.png"
    }
];

const grade = document.getElementById("gradeProdutos");

// ABRIR PÁGINA INDIVIDUAL DO PRODUTO
function linkProduto(nome) {
    return `produto.html?nome=${encodeURIComponent(nome)}`;
}

// MOSTRAR PRODUTOS
function mostrarProdutos(lista) {
    if (!grade) return;

    grade.innerHTML = "";

    if (lista.length === 0) {
        grade.innerHTML = `
            <p class="mensagem-vazia">
                Nenhum produto encontrado.
            </p>
        `;
        return;
    }

    lista.forEach(produto => {
        grade.innerHTML += `
            <article class="card-produto">

                <button
                    class="botao-favorito-card"
                    onclick="adicionarFavorito('${produto.nome}')"
                    title="Adicionar aos favoritos">
                    ♡
                </button>

                <a href="${linkProduto(produto.nome)}" class="link-produto">

                    <div class="imagem-produto">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                    </div>

                    <h3>${produto.nome}</h3>

                </a>

                <p>${produto.descricao}</p>

                <div class="preco-produto">
                    R$ ${produto.preco.toFixed(2).replace(".", ",")}
                </div>

                <button
                    type="button"
                    class="botao-sacola"
                    onclick="adicionarSacola('${produto.nome}')">
                    ADICIONAR À SACOLA
                </button>

            </article>
        `;
    });
}

// APLICAR FILTROS
function aplicarFiltros() {
    let resultado = [...produtos];

    // FILTRO DE CATEGORIAS
    const categoriasSelecionadas = [
        ...document.querySelectorAll(
            '.filtros input[type="checkbox"]:not([name="preco"]):checked'
        )
    ].map(input => input.value);

    if (categoriasSelecionadas.length > 0) {
        resultado = resultado.filter(produto =>
            categoriasSelecionadas.includes(produto.categoria)
        );
    }

    // FILTRO DE PREÇOS
    const precosSelecionados = [
        ...document.querySelectorAll(
            '.filtros input[name="preco"]:checked'
        )
    ].map(input => input.value);

    if (precosSelecionados.length > 0) {
        resultado = resultado.filter(produto => {
            return precosSelecionados.some(faixa => {

                if (faixa === "0-50") {
                    return produto.preco <= 50;
                }

                if (faixa === "50-100") {
                    return produto.preco > 50 && produto.preco <= 100;
                }

                if (faixa === "100") {
                    return produto.preco > 100;
                }

                return false;
            });
        });
    }


    // FILTRO DE PESQUISA
const campoBusca = document.getElementById("campo-busca");

if (campoBusca) {
    const pesquisa = campoBusca.value
        .toLocaleLowerCase("pt-BR")
        .trim();

    if (pesquisa) {
        resultado = resultado.filter(produto =>
            produto.nome.toLocaleLowerCase("pt-BR").includes(pesquisa) ||
            produto.descricao.toLocaleLowerCase("pt-BR").includes(pesquisa)
        );
    }
}
    // ORDENAÇÃO
    const ordenar = document.getElementById("ordenar");

    if (ordenar) {
        if (ordenar.value === "menor") {
            resultado.sort((a, b) => a.preco - b.preco);
        }

        if (ordenar.value === "maior") {
            resultado.sort((a, b) => b.preco - a.preco);
        }

        if (ordenar.value === "nome") {
            resultado.sort((a, b) =>
                a.nome.localeCompare(b.nome)
            );
        }
    }

    mostrarProdutos(resultado);
}

// LIMPAR FILTROS
function limparFiltros() {
    document.querySelectorAll(
        '.filtros input[type="checkbox"]'
    ).forEach(input => {
        input.checked = false;
    });

    const ordenar = document.getElementById("ordenar");

    if (ordenar) {
        ordenar.value = "padrao";
    }

    aplicarFiltros();
}

// ADICIONAR AOS FAVORITOS
function adicionarFavorito(nome) {
    const produto = produtos.find(p => p.nome === nome);

    if (!produto) return;

    const favoritos = JSON.parse(
        localStorage.getItem("fifthBloomFavoritos")
    ) || [];

    const jaExiste = favoritos.some(p => p.nome === nome);

    if (jaExiste) {
        alert("Esse produto já está nos seus favoritos!");
        return;
    }

    favoritos.push(produto);

    localStorage.setItem(
        "fifthBloomFavoritos",
        JSON.stringify(favoritos)
    );

    alert(nome + " foi adicionado aos favoritos!");
}

// IDENTIFICAR ALTERAÇÕES NOS FILTROS
document.querySelectorAll(".filtros input").forEach(input => {
    input.addEventListener("change", function() {

        // Permite apenas uma faixa de preço selecionada
        if (this.name === "preco" && this.checked) {
            document.querySelectorAll(
                '.filtros input[name="preco"]'
            ).forEach(outro => {
                if (outro !== this) {
                    outro.checked = false;
                }
            });
        }

        // Permite apenas uma categoria selecionada
        if (this.name === "categoria" && this.checked) {
            document.querySelectorAll(
                '.filtros input[name="categoria"]'
            ).forEach(outro => {
                if (outro !== this) {
                    outro.checked = false;
                }
            });
        }

        aplicarFiltros();
    });
});

// IDENTIFICAR ALTERAÇÃO NA ORDENAÇÃO
const seletorOrdenacao = document.getElementById("ordenar");

if (seletorOrdenacao) {
    seletorOrdenacao.addEventListener("change", aplicarFiltros);
}

// INICIALIZAR
mostrarProdutos(produtos);


// FUNCIONAMENTO DA PESQUISA
function configurarPesquisa() {
    const campoBusca = document.getElementById("campo-busca");
    const formularioBusca = document.getElementById("search-form");

    if (!campoBusca || campoBusca.dataset.configurado) return;

    campoBusca.dataset.configurado = "true";

    // Pesquisa enquanto digita
    campoBusca.addEventListener("input", aplicarFiltros);

    // Impede o formulário de recarregar a página
    if (formularioBusca) {
        formularioBusca.addEventListener("submit", function(event) {
            event.preventDefault();
            aplicarFiltros();
        });
    }
}

// Aguarda o cabeçalho carregar
document.addEventListener("headerLoaded", configurarPesquisa);

// Inicializa caso o campo já esteja disponível
configurarPesquisa();
