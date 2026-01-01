document.addEventListener('DOMContentLoaded', () => {

    const logoImgs = document.querySelectorAll('.nav-logo-img, .footer-logo');
    const body = document.body;
    
    const logoLightMode = 'images/logodark.svg';
    const logoDarkMode = 'images/logolight.svg';

    function updateLogo() {
        const isDark = body.classList.contains('dark-mode');
        logoImgs.forEach(img => {
            img.src = isDark ? logoDarkMode : logoLightMode;
        });
    }

    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    
    function updateThemeIcons() {
        const isDark = body.classList.contains('dark-mode');
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('.material-icons-round');
            if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        });
    }

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }
    updateThemeIcons();
    updateLogo();

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            updateThemeIcons();
            updateLogo();
        });
    });

    const menuBtn = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            
            const menuIcon = menuBtn.querySelector('.material-icons-round');
            if (menuIcon) {
                if (navMenu.classList.contains('open')) {
                    menuIcon.textContent = 'close';
                } else {
                    menuIcon.textContent = 'menu';
                }
            }
        });
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- YOUR CUSTOM OVERLAY FUNCTION (Kept as requested) ---
    let isLocked = false;
    function lockSite() {
        if (isLocked) return; 
        isLocked = true;
        
        document.body.innerHTML = ''; 
        document.head.innerHTML = ''; 

        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const bgColor = isDark ? '#0a2540' : '#ffffff';
        const textColor = isDark ? '#ffffff' : '#0a2540';

        document.body.style.cssText = `margin:0; padding:0; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:${bgColor}; color:${textColor}; font-family: sans-serif; text-align:center; transition: all 0.3s;`;
        
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
                <span class="material-icons-round" style="font-size: 80px; opacity: 0.8;">front_hand</span>
                <h1 style="margin:0; font-size: 24px; font-weight:600;">Developer Mode Detected</h1>
                <p style="margin:0; opacity: 0.7; max-width: 300px; line-height: 1.5;">
                    Please close the Developer Tools to continue browsing.
                </p>
                <button onclick="location.reload()" style="margin-top:20px; padding: 10px 20px; border-radius: 8px; border:none; background: #635bff; color: white; cursor: pointer; font-weight: 500; font-size: 14px;">
                    Refresh Page
                </button>
            </div>
        `;
    }

        document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if(e.key === 'F12') { 
            e.preventDefault(); 
            lockSite();
            return; 
        }

        if (e.ctrlKey) {
            if (e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                e.preventDefault();
                lockSite();
                return;
            }
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                lockSite();
                return;
            }
        }

        if (e.metaKey) { 
            if (e.altKey && (e.key === 'i' || e.key === 'j' || e.key === 'u' || e.key === 'c')) {
                e.preventDefault();
                lockSite();
                return;
            }
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                lockSite();
                return;
            }
            if (e.key === 'i') {
                e.preventDefault();
                lockSite();
                return;
            }
        }
    });

const initSecurity = () => {
    if (typeof DisableDevtool !== 'undefined') {
        DisableDevtool({
            ondevtoolopen: (type) => {
                const ua = navigator.userAgent;
                const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

                if (isBot) {
                    const isFakeBot = (
                        (navigator.plugins && navigator.plugins.length > 0) || 
                        (window.chrome && window.chrome.runtime) ||           
                        (navigator.webdriver === false)                       
                    );

                    if (!isFakeBot) {
                        return; 
                    }
                }

                lockSite();
                
                setInterval(() => {
                    (function() {}.constructor("debugger")());
                }, 500);
            },
            clearLog: true,
            disableMenu: true, 
            disableCopy: true, 
            disableSelect: true,
            disableIframeParents: true,
            interval: 500,
            detectors: [0, 1, 3, 4, 5, 6, 7]
        });
    }
};

if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        initSecurity();
    }, { timeout: 2000 });
} else {
    initSecurity();
}
    } else {
        console.warn('DisableDevtool library not loaded. Make sure to include the CDN link in your HTML.');
    }

    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;

    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    statNumbers.forEach(el => {
                        const target = parseInt(el.getAttribute('data-target'));
                        const suffix = el.getAttribute('data-suffix');
                        const duration = 2000;
                        const start = 0;
                        const startTime = performance.now();

                        function update(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            const ease = 1 - Math.pow(1 - progress, 4);
                            
                            const current = Math.floor(start + (target - start) * ease);
                            el.textContent = current + suffix;

                            if (progress < 1) {
                                requestAnimationFrame(update);
                            } else {
                                el.textContent = target + suffix;
                            }
                        }
                        requestAnimationFrame(update);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }
});
