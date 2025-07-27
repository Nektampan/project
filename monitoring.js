        // KONFIGURASI SUPABASE - GANTI DENGAN DATA ANDA
        const SUPABASE_URL = 'https://jihiocajzxsghtqzjegl.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppaGlvY2FqenhzZ2h0cXpqZWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDI4MTksImV4cCI6MjA2NTgxODgxOX0._S9Fsl5rS6v3o3Bl0owgCQii51LFtQYqMNAY36U_2mQ';
        
        let qualityChart, environmentChart;

        // Navigation functionality
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    // Close mobile menu
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    if (link) link.classList.add('active');
                }
            });
        });

        // Fungsi untuk menampilkan notifikasi
        function showNotification(message, isSuccess = true) {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            const icon = notification.querySelector('i');
            
            notificationText.textContent = message;
            notification.className = isSuccess ? 'notification success' : 'notification error';
            icon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        // Fungsi untuk mengambil data dari Supabase
        async function fetchSleepData() {
            showLoading(true);
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/sleep_monitoring?order=recorded_at.desc&limit=10`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                // Generate sample data if API fails
                return generateSampleData();
            } finally {
                showLoading(false);
            }
        }

        // Generate sample data for demo
        function generateSampleData() {
            const data = [];
            const now = new Date();
            
            for (let i = 0; i < 50; i++) {
                const time = new Date(now.getTime() - (i * 30 * 60 * 1000)); // Every 30 minutes
                const baseQuality = 75 + Math.sin(i * 0.3) * 20;
                const quality = Math.max(20, Math.min(100, baseQuality + (Math.random() - 0.5) * 10));
                
                let category;
                if (quality >= 85) category = 'Excellent';
                else if (quality >= 70) category = 'Good';
                else if (quality >= 50) category = 'Fair';
                else category = 'Poor';
                
                data.push({
                    recorded_at: time.toISOString(),
                    sleep_quality_score: Math.round(quality),
                    sleep_quality_category: category,
                    light_level: Math.round(5 + Math.random() * 15),
                    sound_level: Math.round(25 + Math.random() * 20),
                    temperature: Math.round((22 + Math.random() * 4) * 10) / 10,
                    movement_count: Math.round(Math.random() * 5)
                });
            }
            
            showNotification('Menggunakan data demo - hubungkan ke database untuk data real-time');
            return data;
        }

        // Tampilkan/sembunyikan loading overlay
        function showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');
            overlay.style.display = show ? 'flex' : 'none';
        }

        // Update status cards dengan data terbaru
        function updateStatusCards(latestData) {
            if (!latestData) return;

            document.getElementById('currentQuality').textContent = latestData.sleep_quality_score;
            document.getElementById('currentLight').textContent = latestData.light_level;
            document.getElementById('currentSound').textContent = latestData.sound_level;
            document.getElementById('currentTemp').textContent = latestData.temperature;
            document.getElementById('currentMovement').textContent = latestData.movement_count;

            // Add animation to stat cards
            document.querySelectorAll('.stat-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 200);
                }, index * 100);
            });
        }

        // Update tabel data
        function updateDataTable(data) {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                const time = new Date(row.recorded_at).toLocaleString('id-ID');
                const qualityClass = `quality-${row.sleep_quality_category.toLowerCase()}`;

                tr.innerHTML = `
                    <td>${time}</td>
                    <td>${row.sleep_quality_score}%</td>
                    <td><span class="quality-cell ${qualityClass}">${row.sleep_quality_category}</span></td>
                    <td>${row.light_level}</td>
                    <td>${row.sound_level}</td>
                    <td>${row.temperature}</td>
                    <td>${row.movement_count}</td>
                `;
                
                // Add fade-in animation
                tr.style.opacity = '0';
                tr.style.transform = 'translateY(20px)';
                tableBody.appendChild(tr);
                
                setTimeout(() => {
                    tr.style.transition = 'all 0.3s ease';
                    tr.style.opacity = '1';
                    tr.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }

        // Buat chart kualitas tidur
        function createQualityChart(data) {
            const ctx = document.getElementById('qualityChart').getContext('2d');
            
            if (qualityChart) {
                qualityChart.destroy();
            }

            const last24Hours = data.slice(0, 24).reverse();
            const labels = last24Hours.map(item => 
                new Date(item.recorded_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
            );
            const qualityData = last24Hours.map(item => item.sleep_quality_score);

            qualityChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Kualitas Tidur (%)',
                        data: qualityData,
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 4,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#667eea',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.4,
                        fill: true,
                        shadowColor: 'rgba(102, 126, 234, 0.3)',
                        shadowBlur: 15,
                        shadowOffsetX: 0,
                        shadowOffsetY: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                font: {
                                    size: 14,
                                    weight: '600'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                            borderWidth: 1,
                            cornerRadius: 10,
                            padding: 12
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                lineWidth: 1
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                lineWidth: 1
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverBackgroundColor: '#667eea',
                            hoverBorderColor: '#fff',
                            hoverBorderWidth: 3
                        }
                    }
                }
            });
        }

        // Buat chart kondisi lingkungan
        function createEnvironmentChart(data) {
            const ctx = document.getElementById('environmentChart').getContext('2d');
            
            if (environmentChart) {
                environmentChart.destroy();
            }

            const last12Hours = data.slice(0, 12).reverse();
            const labels = last12Hours.map(item => 
                new Date(item.recorded_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
            );

            environmentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Suhu (°C)',
                            data: last12Hours.map(item => item.temperature),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        },
                        {
                            label: 'Cahaya (lux)',
                            data: last12Hours.map(item => item.light_level),
                            borderColor: 'rgba(255, 205, 86, 1)',
                            backgroundColor: 'rgba(255, 205, 86, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        },
                        {
                            label: 'Suara (dB)',
                            data: last12Hours.map(item => item.sound_level),
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                font: {
                                    size: 14,
                                    weight: '600'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                            borderWidth: 1,
                            cornerRadius: 10,
                            padding: 12
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                lineWidth: 1
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                lineWidth: 1
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        }
                    }
                }
            });
        }

        // Fungsi untuk download chart
        function downloadChart(chartId) {
            const chart = chartId === 'qualityChart' ? qualityChart : environmentChart;
            const link = document.createElement('a');
            link.download = `${chartId}_${new Date().toISOString().slice(0, 10)}.png`;
            link.href = chart.toBase64Image();
            link.click();
            showNotification('Chart berhasil diunduh');
        }

        // Fungsi untuk toggle fullscreen
        function toggleFullscreen(chartId) {
            const container = document.querySelector(`#${chartId}`).closest('.chart-container');
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    showNotification('Tidak dapat masuk ke mode fullscreen', false);
                });
            } else {
                document.exitFullscreen();
            }
        }

        // Fungsi untuk export ke Excel
        function exportToExcel() {
            const table = document.getElementById('dataTable');
            const ws = XLSX.utils.table_to_sheet(table);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data Tidur");
            
            // Format tanggal untuk nama file
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            XLSX.writeFile(wb, `data_tidur_${dateStr}.xlsx`);
            showNotification('Data berhasil diekspor ke Excel');
        }

        // Load semua data
        async function loadData() {
            const data = await fetchSleepData();
            
            if (data.length > 0) {
                updateStatusCards(data[0]); // Data terbaru
                updateDataTable(data);
                createQualityChart(data);
                createEnvironmentChart(data);
                showNotification('Data berhasil diperbarui');
            }
        }

        // Auto refresh setiap 30 detik
        setInterval(loadData, 30000);

        // Load data saat halaman dimuat
        window.addEventListener('load', () => {
            setTimeout(loadData, 500); // Delay untuk animasi loading
        });

        // Add parallax effect to header
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });

        // Add hover effects to stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelector('.stat-icon').style.transform = 'rotate(10deg) scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.querySelector('.stat-icon').style.transform = 'rotate(0deg) scale(1)';
            });
        });
  