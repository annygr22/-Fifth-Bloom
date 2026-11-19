
document.addEventListener("DOMContentLoaded", function () {

    // CARREGAR CABEÇALHO
    fetch("./components/header.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("Não foi possível carregar o cabeçalho: " + response.status);
            }

            return response.text();

        })
        .then(html => {

            const container = document.getElementById("header-container");

            if (!container) {
                console.error("O elemento header-container não foi encontrado.");
                return;
            }

            // INSERIR CABEÇALHO
            container.innerHTML = html;

            console.log("Cabeçalho carregado com sucesso!");

            // IDENTIFICAR PÁGINA ATUAL
            const paginaAtual =
                window.location.pathname.split("/").pop() || "index.html";

            document.querySelectorAll(".main-nav .nav-link").forEach(link => {

                if (link.getAttribute("href") === paginaAtual) {
                    link.classList.add("active");
                }

            });

            // MENU HAMBÚRGUER
            const botaoMenu = document.getElementById("btn-menu");
            const menu = document.getElementById("main-nav");

            if (botaoMenu && menu) {

                botaoMenu.addEventListener("click", function () {
                    menu.classList.toggle("active");
                });

            }

            // AVISAR QUE O CABEÇALHO FOI CARREGADO
            document.dispatchEvent(new Event("headerLoaded"));

        })
        .catch(erro => {
            console.error("ERRO AO CARREGAR CABEÇALHO:", erro);
        });

});
