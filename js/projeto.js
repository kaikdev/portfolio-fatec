document.addEventListener('DOMContentLoaded', () => {
    const elPrincipal = document.getElementById('carrossel-principal');
    const elMiniaturas = document.getElementById('carrossel-miniaturas');

    if (!elPrincipal || !elMiniaturas || typeof Splide === 'undefined') return;

    const traducao = {
        prev: 'Imagem anterior',
        next: 'Próxima imagem',
        first: 'Ir para a primeira imagem',
        last: 'Ir para a última imagem',
        slideX: 'Ir para a imagem %s',
        pageX: 'Ir para a página %s',
        play: 'Iniciar reprodução automática',
        pause: 'Pausar reprodução automática',
        carousel: 'carrossel',
        select: 'Selecione uma imagem para exibir',
        slide: 'imagem',
        slideLabel: '%s de %s'
    };

    const principal = new Splide(elPrincipal, {
        type: 'fade',
        rewind: true,
        pagination: false,
        arrows: true,
        speed: 600,
        i18n: traducao
    });

    const miniaturas = new Splide(elMiniaturas, {
        fixedWidth: 150,
        fixedHeight: 75,
        gap: 12,
        rewind: true,
        pagination: false,
        arrows: false,
        isNavigation: true,
        i18n: traducao,
        breakpoints: {
            700: {
                fixedWidth: 92,
                fixedHeight: 48,
                gap: 8
            }
        }
    });

    // legenda e contador abaixo da imagem principal
    const contador = document.querySelector('.galeria-legenda .contador');
    const legenda = document.querySelector('.galeria-legenda .legenda');
    const formatar = (n) => String(n).padStart(2, '0');

    function atualizarLegenda(indice) {
        const slide = principal.Components.Slides.getAt(indice);
        if (!slide) return;
        const img = slide.slide.querySelector('img');
        if (contador) contador.textContent = formatar(indice + 1) + ' / ' + formatar(principal.length);
        if (legenda && img) legenda.textContent = img.alt;
    }

    principal.on('mounted', () => atualizarLegenda(principal.index));
    principal.on('move', (novoIndice) => atualizarLegenda(novoIndice));

    principal.sync(miniaturas);
    principal.mount();
    miniaturas.mount();
});
