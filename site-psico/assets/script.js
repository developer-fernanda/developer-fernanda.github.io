// executa um bloco de código ou funções, quando o scroll é feito na janela.
window.onscroll = function(oEvent) {
    var posicaoAtual = document.documentElement.scrollTop;

    if (posicaoAtual >= 350) {
        document.getElementById("botao-topo").style.display = "flex";
    } else {
        document.getElementById("botao-topo").style.display = "none";
    }
}