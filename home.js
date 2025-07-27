        // Smooth scrolling untuk navigasi
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animasi counter untuk statistik
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                if (target > 1000) {
                    element.textContent = Math.floor(current / 1000) + 'K+';
                } else if (target === 98) {
                    element.textContent = Math.floor(current) + '%';
                } else {
                    element.textContent = Math.floor(current) + (target === 5 ? '★' : '');
                }
            }, 20);
        }

        // Intersection Observer untuk animasi ketika elemen terlihat
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const text = stat.textContent;
                        if (text.includes('98%')) animateCounter(stat, 98);
                        else if (text.includes('10K+')) animateCounter(stat, 10000);
                        else if (text.includes('24/7')) stat.textContent = '24/7';
                        else if (text.includes('5★')) animateCounter(stat, 5);
                    });
                }
            });
        });

        observer.observe(document.querySelector('.stats'));

        // Efek paralaks sederhana
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.floating-elements');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
