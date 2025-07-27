        // Create animated stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const numberOfStars = 50;

            for (let i = 0; i < numberOfStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }

        // Parallax effect for cards
        function handleScroll() {
            const cards = document.querySelectorAll('.card');
            const scrollTop = window.pageYOffset;

            cards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrollTop * speed);
                card.style.transform = `translateY(${yPos}px)`;
            });
        }

        // Smooth reveal animation on scroll
        function revealOnScroll() {
            const elements = document.querySelectorAll('.card, .feature-item');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Initialize animations
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
            
            // Add scroll event listeners
            window.addEventListener('scroll', () => {
                handleScroll();
                revealOnScroll();
            });
            
            // Initial reveal check
            revealOnScroll();
            
            // Add hover effects to feature items
            const featureItems = document.querySelectorAll('.feature-item');
            featureItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(10px) scale(1.05)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0) scale(1)';
                });
            });
        });

        // Smooth scrolling for CTA button
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add a gentle shake animation
            this.style.animation = 'shake 0.5s ease-in-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });

        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    