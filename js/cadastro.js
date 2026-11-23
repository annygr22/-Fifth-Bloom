
import { supabaseClient } from "./supabase.js";

const formulario = document.getElementById("form-cadastro");
const botaoGoogle = document.getElementById("cadastro-google");
const mensagem = document.getElementById("mensagem-cadastro");

function mostrarMensagem(texto) {
    if (mensagem) {
        mensagem.textContent = texto;
    }
}

// CADASTRO COM E-MAIL E SENHA
if (formulario) {
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha =
            document.getElementById("confirmar-senha").value;

        if (!nome || !email || !senha || !confirmarSenha) {
            mostrarMensagem("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem("As senhas não são iguais.");
            return;
        }

        if (senha.length < 6) {
            mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        const botaoEnviar = formulario.querySelector(
            'button[type="submit"]'
        );

        if (botaoEnviar) botaoEnviar.disabled = true;

        mostrarMensagem("Criando sua conta...");

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        full_name: nome
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                mostrarMensagem("Conta criada com sucesso!");

                window.location.href = "index.html";
            } else {
                mostrarMensagem(
                    "Cadastro realizado! Verifique seu e-mail para confirmar a conta."
                );
            }

        } catch (erro) {
            console.error("Erro no cadastro:", erro);

            if (erro.message.toLowerCase().includes("already registered")) {
                mostrarMensagem("Este e-mail já possui uma conta.");
            } else if (erro.message.toLowerCase().includes("email")) {
                mostrarMensagem("Verifique se o e-mail está correto.");
            } else if (erro.message.toLowerCase().includes("password")) {
                mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");
            } else {
                mostrarMensagem("Não foi possível criar sua conta.");
            }

        } finally {
            if (botaoEnviar) botaoEnviar.disabled = false;
        }
    });
}

// CADASTRO COM GOOGLE
if (botaoGoogle) {
    botaoGoogle.addEventListener("click", async () => {
        mostrarMensagem("Conectando com Google...");

        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: new URL("index.html", window.location.href).href
            }
        });

        if (error) {
            console.error(error);
            mostrarMensagem("Não foi possível cadastrar com Google.");
        }
    });
}
