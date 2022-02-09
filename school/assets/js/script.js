// executa um bloco de código ou funções, quando o scroll é feito na janela.
function ocultaBotao() {
    var posicaoAtual = document.documentElement.scrollTop;

    if (posicaoAtual >= 50) {
        document.getElementById("icone-topo").style.display = "flex";
    } else {
        document.getElementById("icone-topo").style.display = "none";
    }
}

//Quando ocorre o scroll
window.onscroll = function(oEvent) {
    ocultaBotao();
}

//Quando a página é carregada, executa a função
$(document).ready(function() {

    //função do btn
    ocultaBotao();

    $("#icone-topo").click(function(event) {
        event.preventDefault()
        var posicao = $("#home").offset().top;
        $("html, body").animate({ scrollTop: posicao }, 500);
    });

    $("#item-home").click(function(event) {
        event.preventDefault()
        var posicao = $("#home").offset().top;
        $("html, body").animate({ scrollTop: posicao }, 500);
    });

    $("#item-sobre").click(function() {
        var posicao = $("#sobre").offset().top;
        $("html, body").animate({ scrollTop: posicao }, 500);
    });

    $("#item-servicos").click(function() {
        var posicao = $("#servicos").offset().top;
        $("html, body").animate({ scrollTop: posicao }, 500);
    });

    $("#item-contato").click(function() {
        var posicao = $("#contato").offset().top;
        $("html, body").animate({ scrollTop: posicao }, 500);
    });

});
