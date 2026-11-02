document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navbar Scroll Effect & Active Link
    // ==========================================
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Glassmorphism on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. Typewriter Effect
    // ==========================================
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const words = ['Front-End Developer', 'CS Student', 'Bootstrap Developer', 'Internship Seeker'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            let speed;

            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                speed = 40;
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                speed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                speed = 2000; // Pause at full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                speed = 400; // Pause before next word
            }

            setTimeout(type, speed);
        }

        type();
    }

    // ==========================================
    // 3. Scroll Reveal Animations (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. Smooth Scrolling + Close Mobile Menu
    // ==========================================
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = navbarCollapse ? new bootstrap.Collapse(navbarCollapse, { toggle: false }) : null;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();

                // Close mobile menu if open
                if (bsCollapse && navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }

                const offset = navbar ? navbar.offsetHeight : 70;
                window.scrollTo({
                    top: targetEl.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 5. Floating Particles in Hero
    // ==========================================
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const colors = [
            'rgba(102, 126, 234, 0.3)',
            'rgba(240, 147, 251, 0.25)',
            'rgba(79, 172, 254, 0.3)',
            'rgba(67, 233, 123, 0.2)',
            'rgba(245, 87, 108, 0.25)',
            'rgba(0, 242, 254, 0.2)'
        ];

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';

            const size = Math.random() * 80 + 15;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 8 + 6;
            const delay = Math.random() * 5;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                background: ${color};
                filter: blur(${size * 0.4}px);
                --duration: ${duration}s;
                --delay: ${delay}s;
                animation-delay: ${delay}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // ==========================================
    // 6. 3D Tilt Effect on Cards
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // ==========================================
    // 7. Counter Animation (About Stats)
    // ==========================================
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
            observer.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ==========================================
    // 8. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 9. Contact Form Handling (mailto fallback)
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // If form action contains "TODO", use mailto fallback instead
            const action = this.getAttribute('action') || '';
            const useMailto = action.includes('TODO');

            if (useMailto) {
                e.preventDefault();
            }

            let isValid = true;
            const inputs = this.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#f5576c';
                } else {
                    input.style.borderColor = '';
                    // Email validation
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.style.borderColor = '#f5576c';
                        }
                    }
                }
            });

            if (isValid && useMailto) {
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                const body = `From: ${name} (${email})%0A%0A${encodeURIComponent(message)}`;
                const mailtoLink = `mailto:elshenawya747@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

                const btnText = this.querySelector('.btn-text');
                const btnLoading = this.querySelector('.btn-loading');
                const btnSuccess = this.querySelector('.btn-success-msg');
                const submitBtn = this.querySelector('.btn-submit');

                // Show loading briefly
                if (btnText) btnText.classList.add('d-none');
                if (btnLoading) btnLoading.classList.remove('d-none');
                if (submitBtn) submitBtn.disabled = true;

                setTimeout(() => {
                    if (btnLoading) btnLoading.classList.add('d-none');
                    if (btnSuccess) btnSuccess.classList.remove('d-none');

                    window.location.href = mailtoLink;
                    this.reset();

                    setTimeout(() => {
                        if (btnSuccess) btnSuccess.classList.add('d-none');
                        if (btnText) btnText.classList.remove('d-none');
                        if (submitBtn) submitBtn.disabled = false;
                    }, 3000);
                }, 800);
            }
        });

        // Clear error styling on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

});
