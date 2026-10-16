(function () {
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ponteiroFino = window.matchMedia('(pointer: fine)').matches;

    // ---------- monta o background ----------
    const bg = document.createElement('div');
    bg.className = 'bg-animado';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML =
        '<div class="bg-blobs">' +
            '<span class="bg-blob bg-blob-1"></span>' +
            '<span class="bg-blob bg-blob-2"></span>' +
            '<span class="bg-blob bg-blob-3"></span>' +
            '<span class="bg-blob bg-blob-4"></span>' +
        '</div>' +
        '<span class="bg-grade"></span>' +
        '<canvas class="bg-particulas"></canvas>' +
        '<span class="bg-luz"></span>';
    document.body.prepend(bg);

    const blobs = bg.querySelector('.bg-blobs');
    const luz = bg.querySelector('.bg-luz');
    const canvas = bg.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const cores = ['208, 60, 209', '133, 88, 246', '64, 139, 247', '31, 202, 246'];
    const mouse = { x: -9999, y: -9999, ativo: false };
    let particulas = [];
    let largura = 0;
    let altura = 0;
    let animacaoId = null;

    function criarParticulas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        largura = window.innerWidth;
        altura = window.innerHeight;
        canvas.width = largura * dpr;
        canvas.height = altura * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const quantidade = Math.max(28, Math.min(90, Math.round((largura * altura) / 16000)));
        particulas = [];
        for (let i = 0; i < quantidade; i++) {
            particulas.push({
                x: Math.random() * largura,
                y: Math.random() * altura,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.8,
                cor: cores[i % cores.length]
            });
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, largura, altura);
        const distLinha = 130;
        const distMouse = 170;

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];

            if (!reduzirMovimento) {
                // empurra levemente as partículas para longe do mouse
                if (mouse.ativo) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d = Math.hypot(dx, dy);
                    if (d < distMouse && d > 0) {
                        const forca = (1 - d / distMouse) * 0.6;
                        p.x += (dx / d) * forca;
                        p.y += (dy / d) * forca;
                    }
                }

                // atrito para voltar à velocidade normal depois de um "clique"
                const vel = Math.hypot(p.vx, p.vy);
                if (vel > 0.4) {
                    p.vx *= 0.96;
                    p.vy *= 0.96;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -20) p.x = largura + 20;
                if (p.x > largura + 20) p.x = -20;
                if (p.y < -20) p.y = altura + 20;
                if (p.y > altura + 20) p.y = -20;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.cor + ', 0.75)';
            ctx.fill();

            // linhas entre partículas próximas
            for (let j = i + 1; j < particulas.length; j++) {
                const q = particulas[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d = dx * dx + dy * dy;
                if (d < distLinha * distLinha) {
                    const alpha = (1 - Math.sqrt(d) / distLinha) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = 'rgba(133, 88, 246, ' + alpha + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // linhas ligando as partículas ao mouse
            if (mouse.ativo) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < distMouse + 40) {
                    const alpha = (1 - d / (distMouse + 40)) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(31, 202, 246, ' + alpha + ')';
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        desenhar();
        animacaoId = requestAnimationFrame(loop);
    }

    function iniciar() {
        if (animacaoId === null && !reduzirMovimento) loop();
    }

    function parar() {
        if (animacaoId !== null) {
            cancelAnimationFrame(animacaoId);
            animacaoId = null;
        }
    }

    criarParticulas();
    if (reduzirMovimento) {
        desenhar();
    } else {
        iniciar();
    }

    let redimensionarTimer;
    window.addEventListener('resize', () => {
        clearTimeout(redimensionarTimer);
        redimensionarTimer = setTimeout(() => {
            criarParticulas();
            if (reduzirMovimento) desenhar();
        }, 200);
    });

    // pausa a animação quando a aba não está visível (economiza bateria)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) parar();
        else iniciar();
    });

    // ---------- interação com o mouse ----------
    if (ponteiroFino && !reduzirMovimento) {
        let quadroPendente = false;
        let ultimoX = 0;
        let ultimoY = 0;

        window.addEventListener('pointermove', (e) => {
            ultimoX = e.clientX;
            ultimoY = e.clientY;
            mouse.x = ultimoX;
            mouse.y = ultimoY;
            mouse.ativo = true;
            bg.classList.add('mouse-ativo');

            if (!quadroPendente) {
                quadroPendente = true;
                requestAnimationFrame(() => {
                    luz.style.transform = 'translate3d(' + ultimoX + 'px, ' + ultimoY + 'px, 0)';
                    blobs.style.setProperty('--px', (ultimoX / largura - 0.5).toFixed(3));
                    blobs.style.setProperty('--py', (ultimoY / altura - 0.5).toFixed(3));
                    quadroPendente = false;
                });
            }
        }, { passive: true });

        document.addEventListener('pointerleave', () => {
            mouse.ativo = false;
            bg.classList.remove('mouse-ativo');
        });
        document.documentElement.addEventListener('mouseleave', () => {
            mouse.ativo = false;
            bg.classList.remove('mouse-ativo');
        });

        // clique: "onda" que espalha as partículas próximas
        window.addEventListener('pointerdown', (e) => {
            particulas.forEach((p) => {
                const dx = p.x - e.clientX;
                const dy = p.y - e.clientY;
                const d = Math.hypot(dx, dy);
                if (d < 220 && d > 0) {
                    const impulso = (1 - d / 220) * 4;
                    p.vx += (dx / d) * impulso;
                    p.vy += (dy / d) * impulso;
                }
            });
        }, { passive: true });

        // brilho que segue o mouse dentro dos cards de projeto
        document.querySelectorAll('.projetos .item').forEach((card) => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
            });
        });
    }

    // ---------- animações de entrada ao rolar ----------
    if (reduzirMovimento || !('IntersectionObserver' in window)) return;

    const seletores = [
        '.titulo',
        'section.experiencia .item',
        '.projetos .item',
        '.projeto-hero .ficha',
        '.galeria .galeria-wrapper',
        '.projeto-detalhes .bloco',
        '.navegacao-projetos a',
        '#footer .footer-topo > *'
    ];
    const alvos = document.querySelectorAll(seletores.join(','));

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    alvos.forEach((el) => {
        // atraso em cascata entre itens irmãos
        const irmaos = Array.from(el.parentElement.children).filter((c) => c.matches(seletores.join(',')));
        const indice = irmaos.indexOf(el);
        el.style.setProperty('--atraso', (Math.max(indice, 0) % 4) * 90 + 'ms');
        el.classList.add('reveal');
        observador.observe(el);
    });
})();
