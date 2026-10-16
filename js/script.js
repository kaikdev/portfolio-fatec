//menu mobile
const btnMobile = document.getElementById('btn-mobile');
const nav = document.getElementById('nav');
const menuItems = document.querySelectorAll('#nav a');

function toggleMenu(event) {
    if (event.type === 'touchstart') event.preventDefault();
    nav.classList.toggle('active');

    const active = nav.classList.contains('active');
    btnMobile.setAttribute('aria-expanded', active);

    if (active) {
        btnMobile.setAttribute('aria-label', 'Fechar Menu');
    } else {
        btnMobile.setAttribute('aria-label', 'Abrir Menu');
    }
}

function closeMenu() {
    nav.classList.remove('active');
    btnMobile.setAttribute('aria-expanded', 'false');
    btnMobile.setAttribute('aria-label', 'Abrir Menu');
}

btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);

menuItems.forEach(item => {
    item.addEventListener('click', closeMenu);
});

//header fixo
const menu = document.getElementById('header');

function atualizarHeader() {
    if (window.scrollY > 20) {
        menu.classList.add('fixed');
    } else {
        menu.classList.remove('fixed');
    }
}

window.addEventListener('scroll', atualizarHeader, { passive: true });
atualizarHeader();

//link do menu ativo conforme a seção visível (apenas na home)
const linksSecao = Array.from(menuItems).filter(link => {
    const hash = link.getAttribute('href');
    return hash.startsWith('#') && document.querySelector(hash);
});

function atualizarLinkAtivo() {
    const linhaReferencia = window.innerHeight * 0.35;
    let atual = linksSecao[0];

    linksSecao.forEach(link => {
        const secao = document.querySelector(link.getAttribute('href'));
        if (secao.getBoundingClientRect().top <= linhaReferencia) {
            atual = link;
        }
    });

    //chegou no fim da página: ativa o último link
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        atual = linksSecao[linksSecao.length - 1];
    }

    linksSecao.forEach(link => link.classList.toggle('ativo', link === atual));
}

if (linksSecao.length) {
    let agendado = false;
    window.addEventListener('scroll', () => {
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(() => {
            atualizarLinkAtivo();
            agendado = false;
        });
    }, { passive: true });
    atualizarLinkAtivo();
}