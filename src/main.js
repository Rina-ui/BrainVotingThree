import * as THREE from 'three';
import gsap from 'gsap';

import { createMind } from './mind.js';
import { createNodes } from './nodes.js';
import { createAtmosphere } from './atmosphere.js';
import { setLabel, setEnergy, showVoteResult } from './ui.js';

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 20;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const light1 = new THREE.PointLight(0x6b7cff, 3, 30);
light1.position.set(8, 8, 8);
scene.add(light1);

const light2 = new THREE.PointLight(0xff6b6b, 2, 25);
light2.position.set(-6, -5, 6);
scene.add(light2);

const light3 = new THREE.PointLight(0xf59f00, 2, 25);
light3.position.set(0, -8, -6);
scene.add(light3);

// OBJECTS
const mind = createMind();
scene.add(mind);

const nodes = createNodes();
nodes.forEach(n => scene.add(n));

const atmosphere = createAtmosphere(scene);

// ENERGY PARTICLES POOL
const energyParticles = [];

// SHOCKWAVE SYSTEM
function createShockwave(position, color) {
    const geo = new THREE.RingGeometry(0.1, 0.3, 32);
    const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.position.copy(position);
    ring.lookAt(camera.position);
    scene.add(ring);

    gsap.to(ring.scale, {
        x: 15,
        y: 15,
        z: 15,
        duration: 1.5,
        ease: "power2.out"
    });

    gsap.to(ring.material, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.in",
        onComplete: () => scene.remove(ring)
    });
}

// EXPLOSION PARTICLES
function createExplosion(position, color, count = 30) {
    for (let i = 0; i < count; i++) {
        const geo = new THREE.SphereGeometry(0.05, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        const particle = new THREE.Mesh(geo, mat);
        particle.position.copy(position);

        const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();

        const distance = 2 + Math.random() * 3;

        scene.add(particle);

        gsap.to(particle.position, {
            x: position.x + direction.x * distance,
            y: position.y + direction.y * distance,
            z: position.z + direction.z * distance,
            duration: 1 + Math.random() * 0.5,
            ease: "power2.out"
        });

        gsap.to(particle.material, {
            opacity: 0,
            duration: 1 + Math.random() * 0.5,
            ease: "power2.in",
            onComplete: () => scene.remove(particle)
        });
    }
}

// ENERGY TRAIL SYSTEM
function spawnEnergyTrail(from, to, color) {
    const particleCount = 20;
    const trailParticles = [];

    for (let i = 0; i < particleCount; i++) {
        const geo = new THREE.SphereGeometry(0.08, 12, 12);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(from);
        scene.add(p);
        trailParticles.push(p);

        const delay = i * 0.05;

        gsap.to(p.position, {
            x: to.x,
            y: to.y,
            z: to.z,
            duration: 1.5,
            delay: delay,
            ease: "power1.inOut",
            onComplete: () => scene.remove(p)
        });

        gsap.to(p.scale, {
            x: 0.3,
            y: 0.3,
            z: 0.3,
            duration: 1.5,
            delay: delay,
            ease: "power2.in"
        });

        gsap.to(p.material, {
            opacity: 0,
            duration: 1.5,
            delay: delay,
            ease: "power2.in"
        });
    }
}

// INTERACTION
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let energy = 0;
let votes = { empathie: 0, raison: 0, instinct: 0 };

let hoverNode = null;

// Function to normalize labels to match vote keys
function normalizeLabel(label) {
    const mapping = {
        'Empathie': 'empathie',
        'Raison': 'raison',
        'Instinct': 'instinct'
    };
    return mapping[label] || label.toLowerCase();
}

window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});

window.addEventListener('click', (e) => {
    // Recalculate mouse position on click
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodes);

    if (hits.length > 0) {
        const clickedNode = hits[0].object;

        // VOTE EFFECT
        const worldPos = clickedNode.getWorldPosition(new THREE.Vector3());

        createShockwave(worldPos, clickedNode.material.color);
        createExplosion(worldPos, clickedNode.material.color, 40);
        spawnEnergyTrail(worldPos, mind.position, clickedNode.material.color);

        energy += 10;
        setEnergy(energy);

        const voteKey = normalizeLabel(clickedNode.userData.label);
        votes[voteKey]++;

        console.log('Vote pour:', clickedNode.userData.label, '→', voteKey, '| Votes:', votes);

        showVoteResult(clickedNode.userData.label, votes[voteKey]);

        // Update stats display
        if (window.updateStats) {
            window.updateStats(votes);
        }

        // MIND PULSE
        mind.userData.energy += 0.3;
        gsap.to(mind.scale, {
            x: 1.15,
            y: 1.15,
            z: 1.15,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });

        // CAMERA SHAKE
        const originalZ = camera.position.z;
        gsap.to(camera.position, {
            z: originalZ - 1,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });

        // SCREEN FLASH
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle, ${getColorHex(clickedNode.material.color)}, transparent);
            pointer-events: none;
            opacity: 0.4;
            z-index: 1000;
        `;
        document.body.appendChild(flash);

        gsap.to(flash, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => flash.remove()
        });

        // RESET NODE
        clickedNode.userData.influence = 0.3;
    }
});

function getColorHex(color) {
    return '#' + color.getHexString();
}

// ROTATION CONTROLS
let autoRotate = true;
let targetRotationY = 0;

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        autoRotate = false;
        targetRotationY += 0.5;
    } else if (e.key === 'ArrowRight') {
        autoRotate = false;
        targetRotationY -= 0.5;
    } else if (e.key === ' ') {
        autoRotate = !autoRotate;
    }
});

// ANIMATION LOOP
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodes);

    hoverNode = null;

    nodes.forEach(node => {
        node.userData.influence *= 0.94;

        const isHovered = hits.find(h => h.object === node);

        if (isHovered) {
            hoverNode = node;
            node.userData.influence = Math.min(node.userData.influence + 0.04, 1);
            setLabel(node.userData.label);
            document.body.style.cursor = 'pointer';
        }

        // SCALE ANIMATION
        const targetScale = 1 + node.userData.influence * 3;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // OPACITY
        node.material.opacity = 0.4 + node.userData.influence * 0.5;
        node.material.emissiveIntensity = 0.3 + node.userData.influence * 0.7;

        // FLOATING ANIMATION
        const baseY = Math.sin(node.userData.angle) * 1.2;
        node.position.y = baseY + Math.sin(time + node.userData.angle) * 0.3;

        // PULSING GLOW
        const pulse = Math.sin(time * 2 + node.userData.angle) * 0.2 + 0.8;
        node.material.emissive.setHex(node.userData.baseColor);
        node.material.emissiveIntensity *= pulse;
    });

    if (!hoverNode) {
        setLabel("");
        document.body.style.cursor = 'default';
    }

    // BRAIN REACTION
    mind.userData.energy *= 0.98;
    mind.material.emissiveIntensity = 0.4 + mind.userData.energy * 0.6;

    if (autoRotate) {
        mind.rotation.y += 0.002;
    } else {
        mind.rotation.y += (targetRotationY - mind.rotation.y) * 0.05;
    }

    mind.rotation.x = Math.sin(time * 0.5) * 0.1;

    // BREATHING EFFECT
    const breath = Math.sin(time * 0.8) * 0.05 + 1;
    mind.scale.x = breath;
    mind.scale.y = breath;
    mind.scale.z = breath;

    // ATMOSPHERE
    atmosphere.rotation.y += 0.0003;
    atmosphere.rotation.x = Math.sin(time * 0.2) * 0.1;

    // DYNAMIC LIGHTS
    light1.intensity = 3 + Math.sin(time * 1.5) * 0.5;
    light2.intensity = 2 + Math.sin(time * 2 + 2) * 0.5;
    light3.intensity = 2 + Math.sin(time * 1.8 + 4) * 0.5;

    light1.position.x = Math.cos(time * 0.5) * 8;
    light1.position.z = Math.sin(time * 0.5) * 8;

    // CAMERA MOVEMENT
    const targetZ = 20 - mind.userData.energy * 6;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    camera.position.x = Math.sin(time * 0.3) * 0.5;
    camera.position.y = Math.cos(time * 0.4) * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

// RESIZE
addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});