
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

// INICIALIZAR
mostrarProdutos(produtos);

