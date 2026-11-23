
const CHAVE_SACOLA = "fifthBloomCarrinho";

// Busca os produtos salvos
function obterSacola() {
    return JSON.parse(localStorage.getItem(CHAVE_SACOLA)) || [];
}

// Salva os produtos
function salvarSacola(sacola) {
    localStorage.setItem(CHAVE_SACOLA, JSON.stringify(sacola));
}

// Atualiza o número sobre o ícone da sacola
function atualizarContadorSacola() {
    const contador = document.getElementById("contador-sacola");

    if (!contador) return;

    const sacola = obterSacola();

    const quantidade = sacola.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    contador.textContent = quantidade;
}

// Formata os valores em reais
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Adiciona um produto à sacola
function adicionarSacola(nome, precoPersonalizado = null) {

    if (typeof produtos === "undefined") {
        alert("Não foi possível encontrar os produtos.");
        return;
    }

    // Compara nomes mesmo quando há diferenças de acentuação
    const normalizarNome = texto =>
        texto.normalize("NFD")
             .replace(/[\u0300-\u036f]/g, "")
             .toUpperCase()
             .trim();

    const produto = produtos.find(
        p => normalizarNome(p.nome) === normalizarNome(nome)
    );

    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    // Utiliza o preço personalizado quando informado
    const precoFinal = precoPersonalizado !== null
        ? precoPersonalizado
        : produto.preco;

    let sacola = obterSacola();

    const existente = sacola.find(
        p => normalizarNome(p.nome) === normalizarNome(nome)
    );

    if (existente) {

        existente.quantidade++;

    } else {

        sacola.push({
            ...produto,
            nome: nome,
            preco: precoFinal,
            quantidade: 1
        });

    }

    salvarSacola(sacola);
    atualizarContadorSacola();

    alert(nome + " foi adicionado à sua sacola!");
}

// Mostra os produtos na página da sacola
function mostrarSacola() {
    const lista = document.getElementById("lista-sacola");

    if (!lista) return;

    const sacola = obterSacola();

    // Atualiza o contador do cabeçalho
    atualizarContadorSacola();

    const quantidadeItens = document.getElementById("quantidade-itens");
    const subtotalElemento = document.getElementById("subtotal-sacola");
    const freteElemento = document.getElementById("frete-sacola");
    const totalElemento = document.getElementById("total-sacola");
    const botaoFinalizar = document.getElementById("botao-finalizar");

    if (sacola.length === 0) {
        lista.innerHTML = `
            <div class="sacola-vazia">
                <h3>Sua sacola está vazia</h3>
                <p>Você ainda não adicionou nenhum produto.</p>
                <a href="produtos.html" class="continuar-comprando">
                    CONTINUAR COMPRANDO
                </a>
            </div>
        `;

        quantidadeItens.textContent = "0 itens";
        subtotalElemento.textContent = formatarPreco(0);
        freteElemento.textContent = "A calcular";
        totalElemento.textContent = formatarPreco(0);

        if (botaoFinalizar) botaoFinalizar.disabled = true;

        return;
    }

    let subtotal = 0;
    let quantidadeTotal = 0;

    lista.innerHTML = "";

    sacola.forEach((produto, indice) => {
        const totalProduto = produto.preco * produto.quantidade;

        subtotal += totalProduto;
        quantidadeTotal += produto.quantidade;

        lista.innerHTML += `
            <div class="item-sacola">
                <img
                    class="imagem-item-sacola"
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

                <div class="info-item-sacola">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>

                    <strong class="preco-item-sacola">
                        ${formatarPreco(produto.preco)}
                    </strong>

                    <div class="controles-quantidade">
                        <button type="button" data-acao="diminuir" data-indice="${indice}">−</button>

                        <span>${produto.quantidade}</span>

                        <button type="button" data-acao="aumentar" data-indice="${indice}">+</button>
                    </div>

                    <button
                        type="button"
                        class="remover-item"
                        data-acao="remover"
                        data-indice="${indice}"
                    >
                        Remover
                    </button>
                </div>

                <strong class="total-item-sacola">
                    ${formatarPreco(totalProduto)}
                </strong>
            </div>
        `;
    });

    quantidadeItens.textContent =
        quantidadeTotal + (quantidadeTotal === 1 ? " item" : " itens");

    subtotalElemento.textContent = formatarPreco(subtotal);

    if (subtotal >= 150) {
        freteElemento.textContent = "Grátis";
        totalElemento.textContent = formatarPreco(subtotal);
    } else {
        freteElemento.textContent = "A calcular";
        totalElemento.textContent = formatarPreco(subtotal);
    }

    if (botaoFinalizar) botaoFinalizar.disabled = false;
}

// Controla os botões de quantidade e remoção
document.addEventListener("click", function(event) {
    const botao = event.target.closest("[data-acao]");

    if (!botao) return;

    const acao = botao.dataset.acao;
    const indice = Number(botao.dataset.indice);

    let sacola = obterSacola();

    if (!sacola[indice]) return;

    if (acao === "aumentar") {
        sacola[indice].quantidade++;
    }

    if (acao === "diminuir") {
        sacola[indice].quantidade--;

        if (sacola[indice].quantidade <= 0) {
            sacola.splice(indice, 1);
        }
    }

    if (acao === "remover") {
        sacola.splice(indice, 1);
    }

    salvarSacola(sacola);
    mostrarSacola();
    atualizarContadorSacola();
});

// Botão de finalizar compra demonstrativo
document.addEventListener("DOMContentLoaded", function() {
    mostrarSacola();
    atualizarContadorSacola();

    const botaoFinalizar = document.getElementById("botao-finalizar");

    if (botaoFinalizar) {
        botaoFinalizar.addEventListener("click", function() {
            alert("Finalização demonstrativa! Sua sacola está funcionando.");
        });
    }
});

// Atualiza o contador quando o cabeçalho termina de carregar
document.addEventListener("headerLoaded", function() {
    atualizarContadorSacola();
});
