document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOGO HANDLING ---
    const logoImgs = document.querySelectorAll('.nav-logo-img, .footer-logo');
    const body = document.body;
    
    // Config: Paths to your logos
    const logoLightMode = 'images/logodark.svg'; // Dark logo for light background
    const logoDarkMode = 'images/logolight.svg'; // Light logo for dark background

    function updateLogo() {
        const isDark = body.classList.contains('dark-mode');
        logoImgs.forEach(img => {
            img.src = isDark ? logoDarkMode : logoLightMode;
        });
    }

    // --- 2. THEME TOGGLE (Desktop & Mobile) ---
    // Select BOTH buttons
    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    
    function updateThemeIcons() {
        const isDark = body.classList.contains('dark-mode');
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('.material-icons-round');
            if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        });
    }

    // Initialize Theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }
    updateThemeIcons();
    updateLogo();

    // Attach Click Listeners
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            updateThemeIcons();
            updateLogo();
        });
    });

    // --- 3. MOBILE MENU TOGGLE ---
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

    // --- 4. BACK TO TOP BUTTON ---
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

    // --- 5. COPYRIGHT YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 6. DEVELOPER TOOLS LOCK ---
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
        // Prevent F12
        if(e.key === 'F12') { 
            e.preventDefault(); 
            lockSite();
            return; 
        }

        // Prevent Ctrl combinations
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

        // Prevent Mac Command combinations
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
            // Explicit check for Cmd+I (which I missed in the optimization)
            if (e.key === 'i') {
                e.preventDefault();
                lockSite();
                return;
            }
        }
    });
});