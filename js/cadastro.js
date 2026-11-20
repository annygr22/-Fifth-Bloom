
import { auth, provedorGoogle } from "../firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const formulario = document.getElementById("form-cadastro");
const botaoGoogle = document.getElementById("cadastro-google");
const mensagem = document.getElementById("mensagem-cadastro");

// CADASTRO COM E-MAIL E SENHA
formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não são iguais.";
        return;
    }

    mensagem.textContent = "Criando sua conta...";

    try {
        const resultado = await createUserWithEmailAndPassword(
            auth,
            email,
            senha
        );

        await updateProfile(resultado.user, {
            displayName: nome
        });

        mensagem.textContent = "Conta criada com sucesso!";

        window.location.href = "index.html";

    } catch (erro) {
        console.error(erro);

        if (erro.code === "auth/email-already-in-use") {
            mensagem.textContent = "Este e-mail já possui uma conta.";
        } else if (erro.code === "auth/weak-password") {
            mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
        } else if (erro.code === "auth/invalid-email") {
            mensagem.textContent = "Digite um e-mail válido.";
        } else {
            mensagem.textContent = "Não foi possível criar a conta.";
        }
    }
});

// CADASTRO COM GOOGLE
botaoGoogle.addEventListener("click", async () => {
    mensagem.textContent = "Conectando com Google...";

    try {
        await signInWithPopup(auth, provedorGoogle);

        window.location.href = "index.html";

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível cadastrar com Google.";
    }
});
