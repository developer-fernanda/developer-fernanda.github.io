//Contato de clientes
function pegarEmail() {
    var quebraDeLinha = '%0D%0A';

    var body = 'Nome: ' + escape(document.getElementById('id_nome').value) +       quebraDeLinha +
        'Telefone: ' + escape(document.getElementById('id_telefone').value) + quebraDeLinha +
        'Mensagem: ' + escape(document.getElementById('id_mensagem').value);

    var link = "mailto:developer.fernanda.ingrid@gmail.com.br" +
        "?cc=" + // Para add mais e-mails)
        "&subject=" + escape("Contato de Cliente") + // Assunto do e-mail
        "&body=" + body; // Texto do e-mail

    window.location.href = link; //isso aqui é como fosse um return, ele retorna a variavel que está recebendo as caracteristicas do email
}
