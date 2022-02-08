// executa um bloco de código ou funções, quando o scroll é feito na janela.
function none() {
    var posicaoAtual = document.documentElement.scrollTop;

    if (posicaoAtual <= 350) {
        document.getElementById("nav-color").style.display = "flex";
        document.getElementById("btn-topo").style.display = "none";
        $(".btn-topo").hide("slow");

    } else {
        document.getElementById("nav-color").style.display = "none";
        $(".btn-topo").show("slow");
    }
}

// Quando ocorre o scroll
window.onscroll = function(oEvent) {
    none();
}

$(document).ready(function() {

    $("#btn-topo").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 3000);
    });
});
