const cloud = document.getElementById("cloud");

cloud.addEventListener("click", () => {
    barraLateral.classList.toggle("mini-barra-lateral");
    main.classList.toggle("min-main");
    spans.forEach((span) => {
        span.classList.toggle("oculto");
    });
});




var urlActual = window.location.href
var partesUrl = urlActual.split('/');
var posicionPublic = partesUrl.indexOf('public');
var posicionesHaciaAtras = partesUrl.length - 2 - posicionPublic;
var rutaImagen = '../'.repeat(posicionesHaciaAtras) + 'resource/icon.png';
var imagenHTML = '<img src="' + rutaImagen + '" alt="Logo" width="50">';
var contenedorLogo = document.getElementById("logoContainer");
contenedorLogo.innerHTML = imagenHTML + contenedorLogo.innerHTML;
