        // Interactive card details
        function showDetails(topic) {
            const details = {
                rutina: "🛏️ Rutina Tidur Sehat:\n\n• Tidur dan bangun pada waktu yang sama setiap hari\n• Hindari kafein 6 jam sebelum tidur\n• Lakukan aktivitas santai 1 jam sebelum tidur\n• Matikan lampu terang 30 menit sebelum tidur",
                relaksasi: "🧘‍♀️ Teknik Relaksasi:\n\n• Latihan pernapasan dalam 4-7-8\n• Progressive muscle relaxation\n• Meditasi mindfulness 10-15 menit\n• Mendengarkan musik santai atau white noise",
                lingkungan: "🌡️ Lingkungan Tidur Ideal:\n\n• Suhu kamar 18-22°C\n• Kamar gelap atau gunakan eye mask\n• Kasur dan bantal yang nyaman\n• Ventilasi udara yang baik",
                nutrisi: "🍵 Nutrisi & Tidur:\n\n• Hindari makan berat 3 jam sebelum tidur\n• Konsumsi teh chamomile atau susu hangat\n• Hindari alkohol dan nikotin\n• Perbanyak makanan kaya magnesium",
                digital: "📱 Digital Detox:\n\n• Matikan gadget 1 jam sebelum tidur\n• Gunakan mode night pada perangkat\n• Jauhkan ponsel dari tempat tidur\n• Ganti scrolling dengan membaca buku",
                jadwal: "⏰ Jadwal Tidur Optimal:\n\n• Dewasa butuh 7-9 jam tidur per malam\n• Tidur sebelum jam 11 malam\n• Bangun saat sinar matahari muncul\n• Hindari tidur siang lebih dari 30 menit"
            };
            
            alert(details[topic]);
        }

        // Smooth scrolling for navigation
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

        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(12, 12, 12, 0.98)';
            } else {
                header.style.background = 'rgba(12, 12, 12, 0.95)';
            }
        });

        // Parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.floating-element');
            const speed = 0.5;

            parallax.forEach((element, index) => {
                const yPos = -(scrolled * speed * (index + 1) * 0.1);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
   