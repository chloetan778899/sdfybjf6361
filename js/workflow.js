document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FLASHLIGHT EFFECT (Kept exactly as is) ---
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

    // --- 2. CHART CONFIGURATION & ANIMATION (FIXED) ---
    const chartCanvas = document.getElementById('trafficChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        // Purple/Yellow Gradient
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
                    tension: 0.4, // Smooth curves
                    pointRadius: 0,
                    pointHoverRadius: 0 // Disable hover dots
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // DISABLE MOUSE EVENTS ON CHART TO PREVENT JITTER
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
                    duration: 2000, // Matches the interval below exactly
                    easing: 'linear' // Constant speed, no "slow down/speed up"
                }
            }
        });

        // --- SMOOTH HOVER ANIMATION ---
        const card1 = document.querySelector('.wrapper-1 .workflow-card');
        let animationInterval;

        if (card1) {
            card1.addEventListener('mouseenter', () => {
                clearInterval(animationInterval); 
                
                // Trigger an update immediately so you don't wait 2 seconds
                updateChart();

                // Update every 2 seconds for a slow, fluid wave
                animationInterval = setInterval(updateChart, 2000); 
            });

            card1.addEventListener('mouseleave', () => {
                clearInterval(animationInterval); 
                // Optional: Reset to a "calm" state or just pause
            });
        }

        function updateChart() {
            const data = trafficChart.data.datasets[0].data;
            
            data.shift(); // Remove left point
            
            // Generate new gentle random point
            const lastValue = data[data.length - 1];
            // Smaller random change for smoother look
            const change = (Math.random() - 0.5) * 10; 
            let newValue = lastValue + change;
            
            // Keep it visible inside the chart
            newValue = Math.max(10, Math.min(50, newValue));
            
            data.push(newValue); // Add right point
            
            trafficChart.update(); 
        }
    }
});