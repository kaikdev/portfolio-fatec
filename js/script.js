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

btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);

//header fixo
const menu = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        menu.classList.add('fixed');
    } else {
        menu.classList.remove('fixed');
    }
});