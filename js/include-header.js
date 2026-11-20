
fetch("./components/header.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("Não foi possível carregar o cabeçalho.");
        }

        return response.text();
    })
    .then(html => {
        const container = document.getElementById("header-container");

        // Verifica se existe o espaço reservado para o cabeçalho
        if (!container) {
            console.error("O elemento #header-container não foi encontrado.");
            return;
        }

        // Insere o cabeçalho na página
        container.innerHTML = html;

        // Identifica a página atual
        const paginaAtual =
            window.location.pathname.split("/").pop() || "index.html";

        // Destaca o link da página atual
        document.querySelectorAll(".main-nav .nav-link").forEach(link => {
            const destino = link.getAttribute("href");

            if (destino === paginaAtual) {
                link.classList.add("active");
            }
        });

        // MENU HAMBÚRGUER
        const botaoMenu = document.getElementById("btn-menu");
        const menu = document.getElementById("main-nav");

        if (botaoMenu && menu) {
            botaoMenu.addEventListener("click", () => {
                menu.classList.toggle("active");
            });
        }

        // PESQUISA GLOBAL
        const formularioBusca = document.getElementById("search-form");
        const campoBusca = document.getElementById("campo-busca");

        if (formularioBusca && campoBusca) {
            formularioBusca.addEventListener("submit", function(event) {
                event.preventDefault();

                const pesquisa = campoBusca.value.trim();

                if (!pesquisa) return;

                if (paginaAtual !== "produtos.html") {
                    window.location.href =
                        "produtos.html?busca=" + encodeURIComponent(pesquisa);
                } else {
                    campoBusca.dispatchEvent(new Event("input", {
                        bubbles: true
                    }));
                }
            });
        }

        // Avisa que o cabeçalho terminou de carregar
        document.dispatchEvent(new Event("headerLoaded"));
    })
    .catch(erro => {
        console.error("Erro ao carregar o cabeçalho:", erro);
    });
