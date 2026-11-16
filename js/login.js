document.getElementById("form-login").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Digite seu e-mail.");
        return;
    }

    alert("A tela está funcionando! Agora precisamos conectar o sistema de autenticação.");
});

document.getElementById("login-google").addEventListener("click", function() {

    alert("O login com Google será configurado junto com o sistema de autenticação.");

});
