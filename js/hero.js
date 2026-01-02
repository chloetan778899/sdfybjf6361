document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded.');
        return;
    }
    initGlobe();
});

function initGlobe() {
    const container = document.getElementById('globe-canvas-container');
    if (!container) return;

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    });
    observer.observe(container);

    let width = container.clientWidth;
    let height = container.clientHeight;

    if (width === 0 || height === 0) {
        width = 600; 
        height = 600;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15.5; 
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 4;
    
    const segments = isMobile ? 40 : 64; 
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    
    const material = new THREE.PointsMaterial({
        color: 0x635bff,
        size: 0.08,
        transparent: true,
        opacity: 0.8
    });
    const globeDots = new THREE.Points(geometry, material);
    globeGroup.add(globeDots);

    const coreGeo = new THREE.SphereGeometry(radius - 0.1, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    const globeCore = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(globeCore);

    const linePoints = [];
    for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * Math.PI * 2;
        linePoints.push(new THREE.Vector3(
            (radius + 0.5) * Math.cos(theta),
            (radius + 0.5) * Math.sin(theta) * 0.5,
            (radius + 0.5) * Math.sin(theta)
        ));
    }
    const curve = new THREE.CatmullRomCurve3(linePoints);
    curve.closed = true;
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.02, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffc400, transparent: true, opacity: 0.6 });
    const orbit = new THREE.Mesh(tubeGeo, tubeMat);
    orbit.rotation.x = Math.PI / 4; 
    globeGroup.add(orbit);

    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX);
        mouseY = (e.clientY - windowHalfY);
    });

    function animate() {
        requestAnimationFrame(animate);
        
        if (!isVisible) return;

        const time = clock.getElapsedTime();
        globeGroup.rotation.y += 0.002;
        if (orbit) orbit.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.2;
        
        const targetRotationY = mouseX * 0.0001;
        const targetRotationX = mouseY * 0.0001;
        globeGroup.rotation.y += 0.05 * (targetRotationY - globeGroup.rotation.y);
        globeGroup.rotation.x += 0.05 * (targetRotationX - globeGroup.rotation.x);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        if (newWidth > 0 && newHeight > 0) {
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }
    });
}