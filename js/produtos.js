
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
        imagem: "assets/MÁSCARA FLEURS D_OR.png"
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

// NORMALIZAR TEXTOS PARA A PESQUISA
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();
}

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
                    type="button"
                    class="botao-favorito-card"
                    data-favorito="${encodeURIComponent(produto.nome)}"
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
                    data-sacola="${encodeURIComponent(produto.nome)}">
                    ADICIONAR À SACOLA
                </button>

            </article>
        `;
    });

    // EVENTOS DOS BOTÕES DE FAVORITOS
    grade.querySelectorAll("[data-favorito]").forEach(botao => {
        botao.addEventListener("click", function() {
            const nome = decodeURIComponent(this.dataset.favorito);
            adicionarFavorito(nome);
        });
    });

    // EVENTOS DOS BOTÕES DA SACOLA
    grade.querySelectorAll("[data-sacola]").forEach(botao => {
        botao.addEventListener("click", function() {
            const nome = decodeURIComponent(this.dataset.sacola);

            if (typeof adicionarSacola === "function") {
                adicionarSacola(nome);
            } else {
                alert("Não foi possível acessar a sacola.");
            }
        });
    });
}

// APLICAR FILTROS
function aplicarFiltros() {
    let resultado = [...produtos];

    // FILTRO DE CATEGORIAS
    const categoriasSelecionadas = [
        ...document.querySelectorAll(
            '.filtros input[name="categoria"]:checked'
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
        const pesquisa = normalizarTexto(campoBusca.value);

        if (pesquisa) {
            resultado = resultado.filter(produto =>
                normalizarTexto(produto.nome).includes(pesquisa) ||
                normalizarTexto(produto.descricao).includes(pesquisa)
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

    const campoBusca = document.getElementById("campo-busca");

    if (campoBusca) {
        campoBusca.value = "";
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

        // PERMITE APENAS UMA FAIXA DE PREÇO
        if (this.name === "preco" && this.checked) {
            document.querySelectorAll(
                '.filtros input[name="preco"]'
            ).forEach(outro => {
                if (outro !== this) {
                    outro.checked = false;
                }
            });
        }

        // PERMITE APENAS UMA CATEGORIA
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

// FUNCIONAMENTO DA PESQUISA
function configurarPesquisa() {
    const campoBusca = document.getElementById("campo-busca");

    if (!campoBusca || campoBusca.dataset.configurado) return;

    campoBusca.dataset.configurado = "true";

    // RECUPERA A PESQUISA ENVIADA DE OUTRA PÁGINA
    const parametros = new URLSearchParams(window.location.search);
    const pesquisaAnterior = parametros.get("busca");

    if (pesquisaAnterior) {
        campoBusca.value = pesquisaAnterior;
        aplicarFiltros();
    }

    // PESQUISA ENQUANTO DIGITA
    campoBusca.addEventListener("input", aplicarFiltros);
}

// AGUARDA O CABEÇALHO CARREGAR
document.addEventListener("headerLoaded", configurarPesquisa);

// INICIALIZA CASO O CAMPO JÁ ESTEJA DISPONÍVEL
configurarPesquisa();

// INICIALIZAR PRODUTOS
mostrarProdutos(produtos);
