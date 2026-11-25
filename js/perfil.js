
import { supabaseClient } from "./supabase.js";

document.addEventListener("DOMContentLoaded", iniciarPerfil);

async function iniciarPerfil() {

    const elemento = (id) => document.getElementById(id);

    // ELEMENTOS DO PERFIL
    const nomeUsuario = elemento("nome-usuario");
    const emailUsuario = elemento("email-usuario");
    const dataCadastro = elemento("data-cadastro");
    const boasVindas = elemento("boas-vindas");
    const fotoPerfil = elemento("foto-perfil");

    const formEditar = elemento("form-editar-perfil");
    const inputNome = elemento("novo-nome");
    const mensagemEdicao = elemento("mensagem-edicao");

    const botaoEditar = elemento("btn-editar");
    const botaoCancelar = elemento("cancelar-edicao");
    const botaoSalvar = elemento("salvar-perfil");

    const painelConteudo = elemento("painel-conteudo");

    let usuarioAtual = null;

    // AVATAR PADRÃO
    const fotoPadrao = "./assets/Ícone de perfil minimalista azul-acinzentado.png";

    // VERIFICAR ELEMENTOS
    if (
        !nomeUsuario ||
        !emailUsuario ||
        !dataCadastro ||
        !boasVindas ||
        !fotoPerfil ||
        !formEditar ||
        !inputNome ||
        !mensagemEdicao ||
        !botaoEditar ||
        !botaoCancelar ||
        !botaoSalvar ||
        !painelConteudo
    ) {
        console.error(
            "FIFTH BLOOM: algum elemento do perfil não foi encontrado no HTML."
        );
        return;
    }

    // CARREGAR AVATAR
    fotoPerfil.onerror = () => {
        console.error("Erro ao carregar avatar:", fotoPerfil.src);
    };

    fotoPerfil.src = fotoPadrao;

    // FORMATAR DATA
    function formatarData(data) {
        if (!data) return "--";

        return new Date(data).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric"
        });
    }

    // CARREGAR DADOS DO USUÁRIO
    function carregarDados(usuario) {

        if (!usuario) return;

        usuarioAtual = usuario;

        const nome =
            usuario.user_metadata?.full_name ||
            usuario.user_metadata?.name ||
            usuario.email?.split("@")[0] ||
            "Usuário";

        const email = usuario.email || "";
        const data = formatarData(usuario.created_at);

        nomeUsuario.textContent = nome;
        emailUsuario.textContent = email;
        dataCadastro.textContent = data;

        boasVindas.textContent = nome.trim().split(/\s+/)[0];

        const resumoEmail = elemento("resumo-email");
        const resumoData = elemento("resumo-data");

        if (resumoEmail) {
            resumoEmail.textContent = email;
        }

        if (resumoData) {
            resumoData.textContent = "Membro desde: " + data;
        }

        inputNome.value = nome;

        // MANTER AVATAR AZUL-ACINZENTADO
        fotoPerfil.src = fotoPadrao;
    }

    // VERIFICAR AUTENTICAÇÃO
    try {

        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error) throw error;

        if (!data.user) {
            window.location.href = "login.html";
            return;
        }

        carregarDados(data.user);

    } catch (erro) {

        console.error("Erro ao carregar perfil:", erro);

        nomeUsuario.textContent = "Não foi possível carregar";
        emailUsuario.textContent = "Verifique sua conexão.";

        // MANTER AVATAR MESMO COM ERRO
        fotoPerfil.src = fotoPadrao;

        return;
    }

    // ABRIR EDIÇÃO
    botaoEditar.addEventListener("click", () => {

        formEditar.hidden = !formEditar.hidden;

        if (!formEditar.hidden) {

            inputNome.value =
                usuarioAtual.user_metadata?.full_name ||
                usuarioAtual.user_metadata?.name ||
                usuarioAtual.email?.split("@")[0] ||
                "";

            mensagemEdicao.textContent = "";
            inputNome.focus();
        }
    });

    // CANCELAR EDIÇÃO
    botaoCancelar.addEventListener("click", () => {

        formEditar.hidden = true;
        mensagemEdicao.textContent = "";

    });

    // SALVAR ALTERAÇÕES
    formEditar.addEventListener("submit", async (event) => {

        event.preventDefault();

        const novoNome = inputNome.value.trim();

        if (!novoNome) {
            mensagemEdicao.textContent = "Digite um nome válido.";
            return;
        }

        botaoSalvar.disabled = true;
        botaoSalvar.textContent = "Salvando...";
        mensagemEdicao.textContent = "";

        try {

            const { data, error } =
                await supabaseClient.auth.updateUser({
                    data: {
                        ...usuarioAtual.user_metadata,
                        full_name: novoNome
                    }
                });

            if (error) throw error;

            if (data.user) {
                carregarDados(data.user);
            }

            mensagemEdicao.textContent =
                "Perfil atualizado com sucesso! ♡";

            formEditar.hidden = true;

        } catch (erro) {

            console.error("Erro ao atualizar perfil:", erro);

            mensagemEdicao.textContent =
                "Não foi possível salvar as alterações.";

        } finally {

            botaoSalvar.disabled = false;
            botaoSalvar.textContent = "Salvar alterações";

        }
    });

    // CONTEÚDO DAS ABAS
    const textosAbas = {

        dados: {
            titulo: "Meu Perfil",
            descricao: "Confira suas informações de conta."
        },

        pedidos: {
            titulo: "Histórico de Pedidos",
            descricao: "Acompanhe suas compras na Fifth Bloom."
        },

        favoritos: {
            titulo: "Meus Favoritos",
            descricao: "Seus produtos favoritos aparecerão aqui."
        },

        cupons: {
            titulo: "Meus Cupons",
            descricao: "Confira seus cupons e benefícios disponíveis."
        },

        avaliacoes: {
            titulo: "Minhas Avaliações",
            descricao: "Suas avaliações de produtos aparecerão aqui."
        },

        configuracoes: {
            titulo: "Configurações",
            descricao: "Gerencie suas informações de conta."
        }

    };

    // TROCAR ABA
    function trocarAba(aba) {

        const conteudo = textosAbas[aba];

        if (!conteudo) return;

        // ATUALIZAR BOTÕES
        document.querySelectorAll("[data-aba]").forEach(botao => {

            const selecionado = botao.dataset.aba === aba;

            botao.classList.toggle("ativo", selecionado);
            botao.classList.toggle("ativa", selecionado);

        });

        // ATUALIZAR PAINEL
        painelConteudo.innerHTML = `
            <div class="painel-titulo">
                <h3>${conteudo.titulo}</h3>
            </div>

            <div class="estado-vazio">
                <span>♡</span>

                <h4>${conteudo.titulo}</h4>

                <p>${conteudo.descricao}</p>

                ${
                    aba === "dados"
                        ? '<button type="button" class="botao-abrir-edicao">Editar minhas informações</button>'
                        : aba === "configuracoes"
                        ? '<p>As opções de configuração serão disponibilizadas aqui.</p>'
                        : '<a href="produtos.html">Conhecer produtos</a>'
                }
            </div>
        `;

        // BOTÃO DE EDIÇÃO DENTRO DA ABA
        const botaoInterno =
            painelConteudo.querySelector(".botao-abrir-edicao");

        if (botaoInterno) {

            botaoInterno.addEventListener("click", () => {

                formEditar.hidden = false;

                inputNome.value =
                    usuarioAtual.user_metadata?.full_name ||
                    usuarioAtual.user_metadata?.name ||
                    usuarioAtual.email?.split("@")[0] ||
                    "";

                mensagemEdicao.textContent = "";
                inputNome.focus();

            });

        }
    }

    // EVENTOS DOS BOTÕES DAS ABAS
    document.querySelectorAll("[data-aba]").forEach(botao => {

        botao.addEventListener("click", () => {
            trocarAba(botao.dataset.aba);
        });

    });

    // ABA INICIAL
    trocarAba("pedidos");

    // OBSERVAR ALTERAÇÕES NA AUTENTICAÇÃO
    supabaseClient.auth.onAuthStateChange((evento, session) => {

        if (evento === "SIGNED_OUT" || !session) {
            window.location.href = "login.html";
        }

    });

}
