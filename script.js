document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Mobile Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = btn.querySelector('span');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        if(menu.classList.contains('hidden')) {
            icon.textContent = 'menu';
        } else {
            icon.textContent = 'close';
        }
    });

    // Fermer le menu mobile au clic sur un lien
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            icon.textContent = 'menu';
        });
    });

    // =========================================
    // 2. Animations au Scroll (Intersection Observer)
    // C'est ici que la classe 'active' est ajoutée
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe qui déclenche l'animation CSS
                entry.target.classList.add('active');
                
                // Logique pour les compteurs de statistiques
                const counters = entry.target.querySelectorAll('.counter');
                if(counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // ms
                        const increment = target / (duration / 16);
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                        counter.classList.remove('counter'); 
                    });
                }
                // Optionnel : arrêter d'observer une fois animé
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // On observe tous les éléments avec la classe 'reveal'
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Animation Canvas Hero (Particules flottantes)
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            const isBlue = Math.random() > 0.5;
            this.color = isBlue ? 'rgba(11, 61, 145, 0.15)' : 'rgba(6, 182, 212, 0.2)'; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            let p1 = particles[i];
            p1.update();
            p1.draw();
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let distance = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(11, 61, 145, ${0.1 - distance/1500})`; 
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // 4. Effet de la barre de navigation au scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-md');
            nav.classList.replace('bg-white/90', 'bg-white/95');
        } else {
            nav.classList.remove('shadow-md');
            nav.classList.replace('bg-white/95', 'bg-white/90');
        }
    });
});



// Date footer
document.getElementById('year').textContent = new Date().getFullYear();