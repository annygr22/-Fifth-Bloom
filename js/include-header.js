
fetch("./components/header.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("Não foi possível carregar o cabeçalho.");
        }

        return response.text();
    })
    .then(async html => {

        const container = document.getElementById("header-container");

        if (!container) return;

        container.innerHTML = html;

        const paginaAtual =
            window.location.pathname.split("/").pop() || "index.html";

        // LINK DA PÁGINA ATUAL
        document.querySelectorAll(".main-nav .nav-link").forEach(link => {
            if (link.getAttribute("href") === paginaAtual) {
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

        // PESQUISA
        const formularioBusca = document.getElementById("search-form");
        const campoBusca = document.getElementById("campo-busca");

        if (formularioBusca && campoBusca) {
            formularioBusca.addEventListener("submit", event => {
                event.preventDefault();

                const pesquisa = campoBusca.value.trim();

                if (!pesquisa) return;

                if (paginaAtual !== "produtos.html") {
                    window.location.href =
                        "produtos.html?busca=" + encodeURIComponent(pesquisa);
                } else {
                    campoBusca.dispatchEvent(
                        new Event("input", { bubbles: true })
                    );
                }
            });
        }

        // SUPABASE E PERFIL
        try {

            // O caminho é relativo a este arquivo, que está dentro de js
            const { supabaseClient } = await import("./supabase.js");

            const perfilLink = document.getElementById("perfil-link");
            const perfilTexto = document.getElementById("perfil-texto");
            const botaoSair = document.getElementById("sair-conta");

            function atualizarPerfil(usuario) {

                if (usuario) {

                    const nomeCompleto =
                        usuario.user_metadata?.full_name ||
                        usuario.user_metadata?.name ||
                        usuario.email?.split("@")[0] ||
                        "usuário";

                    const primeiroNome = nomeCompleto
                        .trim()
                        .split(/\s+/)[0];

                    perfilTexto.textContent = `Olá, ${primeiroNome}!`;

                    // DIRECIONA PARA A PÁGINA DE PERFIL
                    perfilLink.href = "perfil.html";

                    botaoSair.hidden = false;

                } else {

                    perfilTexto.textContent = "PERFIL";
                    perfilLink.href = "login.html";
                    botaoSair.hidden = true;

                }
            }

            // VERIFICA A SESSÃO ATUAL
            const { data, error } =
                await supabaseClient.auth.getSession();

            if (error) throw error;

            atualizarPerfil(data.session?.user || null);

            // OBSERVA MUDANÇAS NA SESSÃO
            supabaseClient.auth.onAuthStateChange((evento, session) => {
                atualizarPerfil(session?.user || null);
            });

            // SAIR DA CONTA
            botaoSair.addEventListener("click", async () => {

                botaoSair.disabled = true;
                botaoSair.textContent = "Saindo...";

                try {

                    const { error } =
                        await supabaseClient.auth.signOut();

                    if (error) throw error;

                    atualizarPerfil(null);

                    window.location.href = "index.html";

                } catch (erro) {

                    console.error("Erro ao sair:", erro);

                    alert("Não foi possível sair da conta.");

                    botaoSair.disabled = false;
                    botaoSair.textContent = "Sair";
                }
            });

        } catch (erro) {

            console.error("Erro ao conectar o perfil:", erro);

        }
        // ATUALIZA A QUANTIDADE DE PRODUTOS NA SACOLA
        const CHAVE_SACOLA = "fifthBloomCarrinho";

        const sacola = JSON.parse(
            localStorage.getItem(CHAVE_SACOLA)
        ) || [];

        const quantidade = sacola.reduce(
            (total, produto) => total + produto.quantidade,
            0
        );

        const contadorSacola = document.getElementById("contador-sacola");

        if (contadorSacola) {
            contadorSacola.textContent = quantidade;
        }
        document.dispatchEvent(new Event("headerLoaded"));

    })
    .catch(erro => {
        console.error("Erro ao carregar o cabeçalho:", erro);
    });
