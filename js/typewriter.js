// Define words outside function scope to ensure they are available
const words = [
  "web apps", "ecommerce", "marketing", "education", 
  "security", "finance", "healthcare", "software", "AI"
];

function initTypewriter() {
    const targetElement = document.getElementById('typewriter-text');
    if (!targetElement) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Clear any fallback text before starting
    targetElement.textContent = '';

    function typeLoop() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Deleting
            targetElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing
            targetElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            // Finished typing, pause
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(typeLoop, typeSpeed);
    }
    
    typeLoop();
}

// Check if DOM is ready, if so run immediately, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
    initTypewriter();
}