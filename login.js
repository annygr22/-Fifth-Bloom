const formularioLogin = document.getElementById("form-login");

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        if (!email) {
            alert("Digite seu e-mail.");
            return;
        }

        alert("A tela está funcionando! Agora precisamos conectar o sistema de autenticação.");

    });

}

const botaoGoogle = document.getElementById("login-google");

if (botaoGoogle) {

    botaoGoogle.addEventListener("click", function() {

        alert("O login com Google será configurado junto com o sistema de autenticação.");

    });

}