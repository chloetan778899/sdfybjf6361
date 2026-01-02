document.addEventListener('DOMContentLoaded', () => {

    const containerEl = document.getElementById('fluid-3d-container');
    if (!containerEl) return;

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    });
    observer.observe(containerEl);

    const scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    let width = containerEl.clientWidth;
    let height = containerEl.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(14, 14, 14);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    containerEl.appendChild(renderer.domElement);

    const boxGeometry = new THREE.BoxGeometry(16, 10, 16);
    const edges = new THREE.EdgesGeometry(boxGeometry); 
    const boxMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true, 
        opacity: 0.3
    }); 
    const container = new THREE.LineSegments(edges, boxMaterial);
    scene.add(container);

    const hitPlaneGeometry = new THREE.PlaneGeometry(30, 30);
    const hitPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const hitPlane = new THREE.Mesh(hitPlaneGeometry, hitPlaneMaterial);
    hitPlane.rotation.x = -Math.PI / 2;
    container.add(hitPlane);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1600;

    const positions = [];
    const colors = [];

    const gridRows = 40;
    const gridCols = 40;
    const widthSpan = 16;
    const depthSpan = 16;
    const stepX = widthSpan / gridRows;
    const stepZ = depthSpan / gridCols;

    for (let x = 0; x < gridRows; x++) {
        for (let z = 0; z < gridCols; z++) {
            const px = (x * stepX) - (widthSpan/2) + (stepX/2); 
            const pz = (z * stepZ) - (depthSpan/2) + (stepZ/2);
            positions.push(px, 0, pz);
            colors.push(1, 1, 1);
        }
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.10,
        vertexColors: true, 
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        color: 0xffffff
    });

    const waterSurface = new THREE.Points(particlesGeometry, particlesMaterial);
    container.add(waterSurface);

    const themeColors = {
        dark: {
            bg: 0x0d0d0d,
            base: new THREE.Color(0xaaaaaa),
            hover: new THREE.Color(0xffaa00),
            line: 0xffffff
        },
        light: {
            bg: 0xffffff,
            base: new THREE.Color(0x555555),
            hover: new THREE.Color(0xff4500),
            line: 0x000000
        }
    };

    let currentBaseColor = themeColors.dark.base;
    let currentHoverColor = themeColors.dark.hover;

    function updateThemeColors() {
        if (!scene.fog || !container.material) return;

        const isDarkMode = document.body.classList.contains('dark-mode');
        const theme = isDarkMode ? themeColors.dark : themeColors.light;

        scene.fog.color.setHex(theme.bg);
        
        container.material.color.setHex(theme.line);
        container.material.opacity = isDarkMode ? 0.3 : 0.15;

        currentBaseColor = theme.base;
        currentHoverColor = theme.hover;
    }

    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateThemeColors();
            }
        });
    });
    themeObserver.observe(document.body, { attributes: true });
    updateThemeColors();

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-100, -100);

    containerEl.addEventListener('mousemove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    containerEl.addEventListener('touchmove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const touch = event.touches[0];
        mouseVector.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }, { passive: true });

    containerEl.addEventListener('mouseleave', () => { mouseVector.x = -100; mouseVector.y = -100; });
    containerEl.addEventListener('touchend', () => { mouseVector.x = -100; mouseVector.y = -100; });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const time = clock.getElapsedTime();

        let hoverPoint = null;
        if (mouseVector.x !== -100 && mouseVector.y !== -100) {
            raycaster.setFromCamera(mouseVector, camera);
            const intersects = raycaster.intersectObject(hitPlane);
            if (intersects.length > 0) {
                hoverPoint = intersects[0].point;
                container.worldToLocal(hoverPoint); 
            }
        }

        const colorsAttribute = waterSurface.geometry.attributes.color;
        const positionAttribute = waterSurface.geometry.attributes.position;
        
        for (let i = 0; i < particleCount; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);

            const wave1 = Math.sin(x * 0.5 + time * 0.7) * 0.5;
            const wave2 = Math.cos(z * 1.5 + time * 1.5) * 0.2;
            const wave3 = Math.sin((x + z) * 0.8 + time * 0.8) * 0.3;
            positionAttribute.setY(i, wave1 + wave2 + wave3);

            let r = colorsAttribute.getX(i);
            let g = colorsAttribute.getY(i);
            let b = colorsAttribute.getZ(i);

            let targetR = currentBaseColor.r;
            let targetG = currentBaseColor.g;
            let targetB = currentBaseColor.b;

            if (hoverPoint) {
                const dx = x - hoverPoint.x;
                const dz = z - hoverPoint.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < 2.5) {
                    targetR = currentHoverColor.r;
                    targetG = currentHoverColor.g;
                    targetB = currentHoverColor.b;
                }
            }

            r += (targetR - r) * 0.15;
            g += (targetG - g) * 0.15;
            b += (targetB - b) * 0.15;

            colorsAttribute.setXYZ(i, r, g, b);
        }

        positionAttribute.needsUpdate = true;
        colorsAttribute.needsUpdate = true;

        const targetRotY = THREE.MathUtils.clamp(mouseVector.x, -1, 1) * 0.15; 
        const targetRotX = THREE.MathUtils.clamp(mouseVector.y, -1, 1) * 0.15;
        container.rotation.y += 0.05 * (targetRotY - container.rotation.y);
        container.rotation.x += 0.05 * (targetRotX - container.rotation.x);

        renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => {
        width = containerEl.clientWidth;
        height = containerEl.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    resizeObserver.observe(containerEl);

    animate();
});