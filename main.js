// Handle existing UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Navbar Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Enquiry form submission
    const form = document.getElementById('enquiry-form');
    const formMsg = document.getElementById('form-msg');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulating sending data...
        formMsg.textContent = 'Enquiry Sent Successfully! We will contact you soon.';
        formMsg.style.color = 'var(--green-primary)';
        
        // Reset form
        form.reset();
        
        // Remove message after few seconds
        setTimeout(() => {
            formMsg.textContent = '';
        }, 5000);
    });

    // Initialize 3D Background Scene
    initThreeJS();
});

// Three.js Logic for Landing Background
function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd8f3dc);
    // Add some fog for depth
    scene.fog = new THREE.Fog(0xd8f3dc, 10, 50);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    
    // RENDERER
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffdfba, 0.8);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(dirLight);

    // MATERIALS
    const matWood = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9, depthWrite: true });
    const matGround = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 1 });
    const matTomato = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.3 });
    const matCarrot = new THREE.MeshStandardMaterial({ color: 0xff7f00, roughness: 0.6 });
    const matCabbage = new THREE.MeshStandardMaterial({ color: 0x8fbc8f, roughness: 0.8 });
    const matPotato = new THREE.MeshStandardMaterial({ color: 0xcdaa7d, roughness: 0.9 });
    const matLeaf = new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.5 });

    // GROUND
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const ground = new THREE.Mesh(groundGeo, matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // BASKETS & VEG GROUP
    const farmGroup = new THREE.Group();
    scene.add(farmGroup);

    // Baskets geometry (Simplified as open boxes)
    const createBasket = (x, z) => {
        const group = new THREE.Group();
        group.position.set(x, 0.5, z);
        
        // Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 2.4), matWood);
        base.position.y = -0.4;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Sides
        const sideGeo = new THREE.BoxGeometry(2.6, 1, 0.2);
        const s1 = new THREE.Mesh(sideGeo, matWood); s1.position.set(0, 0, 1.2); s1.castShadow=true; s1.receiveShadow=true;
        const s2 = new THREE.Mesh(sideGeo, matWood); s2.position.set(0, 0, -1.2); s2.castShadow=true; s2.receiveShadow=true;
        const s3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 2.4), matWood); s3.position.set(1.2, 0, 0); s3.castShadow=true; s3.receiveShadow=true;
        const s4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 2.4), matWood); s4.position.set(-1.2, 0, 0); s4.castShadow=true; s4.receiveShadow=true;
        
        group.add(s1, s2, s3, s4);
        return group;
    };

    // Array to hold animating veggies
    const animVeggies = [];

    // Tomato Basket
    const basketTomatoes = createBasket(-3, -2);
    farmGroup.add(basketTomatoes);
    
    // Add Tomatoes
    for(let i=0; i<6; i++) {
        const tomato = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), matTomato);
        const top = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.15, 5), matLeaf);
        top.position.y = 0.35;
        body.castShadow = true; body.receiveShadow = true;
        tomato.add(body, top);
        
        tomato.position.set((Math.random()-0.5)*1.5, Math.random()*0.5 + 0.1, (Math.random()-0.5)*1.5);
        
        // random rotation
        tomato.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        basketTomatoes.add(tomato);
        animVeggies.push(tomato);
    }

    // Carrot Basket
    const basketCarrots = createBasket(3, -1);
    farmGroup.add(basketCarrots);

    // Add Carrots
    for(let i=0; i<8; i++) {
        const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 8), matCarrot);
        carrot.castShadow = true; carrot.receiveShadow = true;
        carrot.position.set((Math.random()-0.5)*1.5, Math.random()*0.4 + 0.2, (Math.random()-0.5)*1.5);
        carrot.rotation.set(Math.random()*Math.PI/2, Math.random()*Math.PI, Math.random()*Math.PI/2 + Math.PI/4);
        basketCarrots.add(carrot);
        animVeggies.push(carrot);
    }

    // Cabbage Basket
    const basketCabbage = createBasket(-1, 2);
    farmGroup.add(basketCabbage);

    // Add Cabbages
    for(let i=0; i<3; i++) {
        const cabbage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), matCabbage);
        cabbage.castShadow = true; cabbage.receiveShadow = true;
        cabbage.position.set((Math.random()-0.5)*1, Math.random()*0.3 + 0.3, (Math.random()-0.5)*1);
        cabbage.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        basketCabbage.add(cabbage);
        animVeggies.push(cabbage);
    }

    // Potato Basket
    const basketPotatoes = createBasket(3.5, 3);
    farmGroup.add(basketPotatoes);

    // Add Potatoes
    for(let i=0; i<10; i++) {
        const potato = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), matPotato);
        potato.castShadow = true; potato.receiveShadow = true;
        potato.scale.set(1, 0.7, 0.8);
        potato.position.set((Math.random()-0.5)*1.5, Math.random()*0.4, (Math.random()-0.5)*1.5);
        potato.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        basketPotatoes.add(potato);
        animVeggies.push(potato);
    }

    // Animation & Parallax variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    // RENDER LOOP
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Hover animation for veggies
        animVeggies.forEach((veg, idx) => {
            veg.position.y += Math.sin(time * 2 + idx) * 0.002;
            veg.rotation.y += 0.01;
        });

        // Parallax Effect
        targetX = mouseX * 0.003;
        targetY = mouseY * 0.003;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        // Keep camera Y roughly around 5, add offset
        camera.position.y += (5 + targetY - camera.position.y) * 0.05;
        
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();
}
