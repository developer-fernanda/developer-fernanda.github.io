// executa um bloco de código ou funções, quando o scroll é feito na janela.
window.onscroll = function(oEvent) {
    var posicaoAtual = document.documentElement.scrollTop;

    if (posicaoAtual >= 350) {
        document.getElementById("botao-topo").style.display = "flex";
    } else {
        document.getElementById("botao-topo").style.display = "none";
    }
}

$(document).ready(function() {

    function atualizar_informacoes() {
        //Informações de texto
        $("#nome-sala").text($(".slick-center").data("name"));
        $("#descricao-sala").text($(".slick-center").data("descricao"));

    }

    //Quando inicia o slide, já atualiza as informações 
    $(".imagem-sala").on('init', function() {
        atualizar_informacoes();
    });

    $(".imagem-sala").slick({
        infinite: true, //infinito
        slidesToShow: 3, //Mostra 3 fotos 
        slidesToScroll: 1, //Exibe 1 por vez
        centerMode: true, //Classe SlickCenter (Configurado no CSS)
        prevArrow: $("#arrow-prev"), //setas
        nextArrow: $("#arrow-next"), //setas
        //Responsivo, abaixo de 640, mostra apenas 1 slide
        responsive: [{
            breakpoint: 640,
            settings: {
                slidesToShow: 1
            }
        }]
    });

    //Atualiza as informações a cada mudança de slide
    $(".imagem-sala").on('afterChange', function() {
        atualizar_informacoes();
    });

});