<?php include("header_geral.php") ?>

<?php include("carousel.php") ?>

<!--SOBRE-->
<div class="container">
    <section>
        <div class="row" id="sobre">
            <div class="col-md-12 text-center">
                <h4> ESPAÇO DAMASIO </h4>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque quia numquam, eos sed magnam facilis, illum natus vel quae reiciendis iusto mollitia officia temporibus, distinctio tempora eius amet dolor ducimus.</p>
                </p>
            </div>
            <!--MISSÃO-->
            <div class="col-md-6 col-lg-4 mt-5">
                <div class="card card-body mx-1 h-100 text-center card-folha shadow">
                    <i class="fas fa-dove"></i>
                    <h5>MISSÃO</h5>
                    <p>Lorem ipsum dolor.</p>
                </div>
            </div>
            <!--VISÃO-->
            <div class="col-md-6 col-lg-4  mt-5">
                <div class="card card-body  mx-1 h-100 text-center card-folha shadow">
                    <i class="fas fa-user-edit"></i>
                    <h5>VISÃO</h5>
                    <p>Lorem ipsum dolor.</p>
                </div>
            </div>
            <!--VALORES-->
            <div class="col-md-6 col-lg-4 mt-5">
                <div class="card card-body mx-1 h-100 text-center card-folha shadow">
                    <i class="fas fa-paste"></i>
                    <h5>VALORES</h5>
                    <p>Lorem ipsum dolor.</p>
                </div>
            </div>
        </div>
    </section>
</div>

<!--CAROUSEL SALAS-->
<div class="container-fluid" id="section-carousel">
    <section id="fotos_sala">
        <h4> SALAS DE ATENDIMENTO </h4>
        <div class="carousel-salas">
            <div class="imagem-sala">
                <!--Data-name / nome abaixo de cada foto-->

                <img data-name="Recepção" data-descricao="Espaço de acolhimento" class="slide" src="assets/img/carousel/01.png" alt="Sala 1">

                <img data-name="Sala Andorinha" data-descricao="Este consultório xxxx" class="slide" src="assets/img/carousel/02.jpg" alt="Sala 2">

                <img data-name="Sala Pardal" data-descricao="Este consultório xxxxxxx" class="slide" src="assets/img/carousel/03.jpg" alt="Sala 3">

                <img data-name="Sala Beija-Flor" data-descricao="Nosso espaço lúdico xxxxx" class="slide" src="assets/img/carousel/05.jpg" alt="Sala 4">

                <img data-name="Área externa" data-descricao="Espaço Externo xxxxxx" class="slide" src="assets/img/carousel/05.jpg" alt="Sala 5">

            </div>

            <!--Setas-->
            <div id="arrow-prev" class="arrow"> <i class="fas fa-chevron-circle-left"></i></div>
            <!--nome da sala-->
            <div id="nome-sala" class="description"></div>
            <!--Setas-->
            <div id="arrow-next" class="arrow"><i class=" fas fa-chevron-circle-right"></i></div>

            <!--Descrição da sala-->
            <div id="descricao-sala"></div>

        </div>
    </section>


</div>

<?php include("vamos_conversar.php") ?>
<?php include("footer.php") ?>

