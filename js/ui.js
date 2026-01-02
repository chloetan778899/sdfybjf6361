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
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            
            const menuIcon = menuBtn.querySelector('.material-icons-round');
            if (menuIcon) {
                menuIcon.textContent = isOpen ? 'close' : 'menu';
            }
        });
    }

    const mobileLangDropdown = document.querySelector('.mobile-actions .lang-dropdown');
    const mobileLangBtn = mobileLangDropdown ? mobileLangDropdown.querySelector('.icon-btn') : null;

    if (mobileLangBtn && mobileLangDropdown) {
        mobileLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileLangDropdown.classList.toggle('open');
            
            const icon = mobileLangBtn.querySelector('.material-icons-round');
            if (icon) {
                icon.textContent = isOpen ? 'close' : 'language';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('open')) {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove('open');
                const menuIcon = menuBtn.querySelector('.material-icons-round');
                if (menuIcon) menuIcon.textContent = 'menu';
            }
        }

        if (mobileLangDropdown && mobileLangDropdown.classList.contains('open')) {
            if (!mobileLangDropdown.contains(e.target)) {
                mobileLangDropdown.classList.remove('open');
                const icon = mobileLangBtn.querySelector('.material-icons-round');
                if (icon) icon.textContent = 'language';
            }
        }
    });

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

        if (e.ctrlKey || e.metaKey) { 
            const key = e.key.toLowerCase();

            if (key === 's') {
                e.preventDefault();
                return;
            }

            if (key === 'u') {
                e.preventDefault();
                lockSite();
                return;
            }

            if (e.shiftKey || e.altKey) { 
                if (['i', 'j', 'c', 'k'].includes(key)) {
                    e.preventDefault();
                    lockSite();
                    return;
                }
            }
        }
    });

    const initSecurity = () => {
        const isMobile = /Android|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (typeof DisableDevtool !== 'undefined') {
            DisableDevtool({
                ondevtoolopen: (type) => {
                    const ua = navigator.userAgent;
                    const isBotUA = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);

                    if (isBotUA) {
                        const hasBrowserFingerprint = (
                            (navigator.plugins && navigator.plugins.length > 0) || 
                            (window.chrome) ||           
                            (navigator.webdriver === false)                       
                        );

                        if (!hasBrowserFingerprint) {
                            return; 
                        }
                    }

                    lockSite();
                },
                clearLog: true,
                disableMenu: true, 
                disableCopy: true, 
                disableSelect: true,
                disableIframeParents: true,
                interval: isMobile ? 2000 : 500, 
                detectors: isMobile ? [0, 1, 3] : [0, 1, 3, 4, 5, 6, 7]
            });
        }
    };

    if (window.requestIdleCallback) {
        requestIdleCallback(() => initSecurity());
    } else {
        setTimeout(() => initSecurity(), 500);
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