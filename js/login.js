
import { supabaseClient } from "./supabase.js";

const formularioLogin = document.getElementById("form-login");
const botaoGoogle = document.getElementById("login-google");
const mensagem = document.getElementById("mensagem-login");

function mostrarMensagem(texto) {
    if (mensagem) {
        mensagem.textContent = texto;
    }
}

// VERIFICA PARA ONDE O USUÁRIO DEVE IR
function obterDestino() {
    const veioDoCheckout =
        localStorage.getItem("retornoCheckout") === "true";

    return veioDoCheckout ? "./sacola.html" : "./index.html";
}

// LOGIN COM E-MAIL E SENHA
if (formularioLogin) {
    formularioLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        if (!email || !senha) {
            mostrarMensagem("Preencha seu e-mail e sua senha.");
            return;
        }

        const botaoEnviar = formularioLogin.querySelector(
            'button[type="submit"]'
        );

        if (botaoEnviar) botaoEnviar.disabled = true;

        mostrarMensagem("Verificando seus dados...");

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: senha
                });

            if (error) throw error;

            if (!data.session) {
                throw new Error("A sessão não foi criada.");
            }

            mostrarMensagem("Login realizado com sucesso!");

            window.location.href = obterDestino();

        } catch (erro) {
            console.error("ERRO REAL NO LOGIN:", erro);

            const erroLogin = erro.message.toLowerCase();

            if (erroLogin.includes("invalid login credentials")) {
                mostrarMensagem("E-mail ou senha incorretos.");
            } else if (erroLogin.includes("email not confirmed")) {
                mostrarMensagem("Seu e-mail ainda não foi confirmado.");
            } else {
                mostrarMensagem("Erro ao entrar: " + erro.message);
            }

        } finally {
            if (botaoEnviar) botaoEnviar.disabled = false;
        }
    });
}

// LOGIN COM GOOGLE
if (botaoGoogle) {
    botaoGoogle.addEventListener("click", async () => {
        mostrarMensagem("Conectando com Google...");

        try {
            const { error } =
                await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: new URL(
                            obterDestino(),
                            window.location.href
                        ).href
                    }
                });

            if (error) throw error;

        } catch (erro) {
            console.error("ERRO NO LOGIN GOOGLE:", erro);
            mostrarMensagem(
                "Erro ao entrar com Google: " + erro.message
            );
        }
    });
}
