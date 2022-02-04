// executa um bloco de código ou funções, quando o scroll é feito na janela.
function none() {
    var posicaoAtual = document.documentElement.scrollTop;

    if (posicaoAtual <= 350) {
        document.getElementById("nav-color").style.display = "flex";
    } else {
        document.getElementById("nav-color").style.display = "none";
    }
}

// Quando ocorre o scroll
window.onscroll = function(oEvent) {
    none();
}
