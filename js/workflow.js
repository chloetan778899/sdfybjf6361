document.addEventListener('DOMContentLoaded', () => {
    
    const wrappers = document.querySelectorAll('.card-wrapper');

    wrappers.forEach(wrapper => {
        const card = wrapper.querySelector('.workflow-card');
        if (!card) return;

        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        const handleLeave = () => {
            card.style.setProperty('--mouse-x', '-100%');
            card.style.setProperty('--mouse-y', '-100%');
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('touchstart', handleMove, { passive: true });
        card.addEventListener('touchmove', handleMove, { passive: true });
        card.addEventListener('touchend', handleLeave);
    });

    const chartCanvas = document.getElementById('trafficChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(243, 223, 80, 0.5)'); 
        gradient.addColorStop(1, 'rgba(243, 223, 80, 0)');

        const trafficChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets: [{
                    label: 'Requests',
                    data: [12, 18, 14, 25, 20, 32, 28, 40],
                    borderColor: '#f3df50',
                    borderWidth: 2,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: [], 
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0, max: 60 }
                },
                animation: {
                    duration: 2000,
                    easing: 'linear'
                }
            }
        });

        const card1 = document.querySelector('.wrapper-1 .workflow-card');
        let animationInterval;

        if (card1) {
            card1.addEventListener('mouseenter', () => {
                clearInterval(animationInterval); 
                updateChart();
                animationInterval = setInterval(updateChart, 2000); 
            });

            card1.addEventListener('mouseleave', () => {
                clearInterval(animationInterval); 
            });
        }

        function updateChart() {
            const data = trafficChart.data.datasets[0].data;
            data.shift(); 
            const lastValue = data[data.length - 1];
            const change = (Math.random() - 0.5) * 10; 
            let newValue = lastValue + change;
            newValue = Math.max(10, Math.min(50, newValue));
            data.push(newValue);
            trafficChart.update(); 
        }
    }

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observerOptions = {
            root: null,
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);

        function startCounting() {
            const counters = document.querySelectorAll('.stat-number');
            const duration = 1500;

            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    counter.innerText = Math.floor(progress * target) + suffix;

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                window.requestAnimationFrame(step);
            });
        }
    }
});