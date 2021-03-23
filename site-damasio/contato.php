<!DOCTYPE html>
<html lang="br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f1e5be">
    <title>www.espacodamasio.com</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <!--slick-->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.7.1/slick.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.7.1/slick-theme.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

</head>

<body style="background: #fff">
    <?php include("header_geral.php") ?>

    <div class="container">
        <div class="row" id="contato">

            <div class="col-12 py-4 text-center">
                <h4>CONTATO </h4>
                <h5> Preencha o formulário e deixe seus dados que entraremos em contato em algumas horas.</h5>
            </div>

            <!--COLUNA 1 - FORMULÁRIO-->
            <div class="col-lg-7">
                <form action="/contato" method="post" role="form" id="form_contato" name="form_contato" class="p-5 card-folha shadow">
                 <h5>FORMULÁRIO DE CONTATO </h5>
                    <div class="row form-group">
                        <div class="col-12">
                            <label for="id_nome">Nome</label>
                            <input required="" type="text" id="id_nome" name="nome" placeholder="Digite seu nome" value="" class="form-control ">
                        </div>
                        <div class="col-12">
                            <label for="id_telefone" class="mt-3">Telefone</label>
                            <input required="" type="email" id="id_telefone" name="telefone" placeholder="Telefone" value="" class="form-control ">
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-12">
                            <label for="id_email">Email</label>
                            <input required="" type="email" id="id_email" name="email" placeholder="Email" value="" class="form-control ">
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-12">
                            <label for="message">Mensagem</label>
                            <textarea required="" id="id_mensagem" name="mensagem" cols="30" rows="5" placeholder="Digite aqui sua mensagem ..." class="form-control "></textarea>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-12 mt-4 text-center">
                            <button type="submit" class="btn  px-4" id="btn_submit_form_contato">ENVIAR</button>
                        </div>
                    </div>
                </form>
            </div>

            <!--COLUNA 2 - CONTATOS E MAPA-->
            <div class="col-lg-5" id="contato_saude">
                <h5>CENTRO DE SAÚDE EMOCIONAL</h5>
                <h6>ESPACO DAMASIO</h6>
                <p> <i class="fas fa-home"></i> Rua Maria Andrade de Oliveira, 155 - Jardim Floresta. Vargem Grande Paulista.</p>
                <p> <i class="fas fa-mobile-alt"></i> +55 11 99309-7983 </p>
                <p> <i class="far fa-clock"></i> Segunda à Sexta-feira: 8:00 às 19:00</p>
                <p> <i class="far fa-clock"></i> Sábado: 8:00 às 12:00</p>
                <a target="_blank" href="https://wa.me/5511993097983" class="btn  mt-1
                            " style="border-radius: 25px;"> <i class="fab fa-whatsapp "></i>
                </a>
                <a target="_blank" href="https://www.instagram.com/damasiosaude/" class="btn  mt-1 " style="border-radius: 25px; "> <i class="fab fa-instagram"></i>
                </a>
                <a target="_blank" href="https://www.facebook.com/damasiosaude/" class="btn  mt-1 " style="border-radius: 25px; "> <i class="fab fa-facebook-f"></i>
                </a> <br>
                <iframe src="https://www.google.com/maps/embed?pb=!4v1615838086585!6m8!1m7!1suRgdVpUtKbi6vtrxGB_rEQ!2m2!1d-23.60868596647413!2d-47.02931182592037!3f61.42698264204599!4f10.199096217963799!5f0.7820865974627469" width="400" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>

        </div>


    </div>

    <?php include("vamos_conversar.php") ?>

    <?php include("footer.php") ?>

    <!--slick-->
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="https://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.7.1/slick.js"></script>
    <script src="assets/js/slick.js"></script>
    <!--slick-->

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js " integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo " crossorigin="anonymous "></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js " integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49 " crossorigin="anonymous "></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js " integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy " crossorigin="anonymous "></script>
</body>

</html>