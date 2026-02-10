import * as THREE from 'three';
import gsap from 'gsap';
import './style.css';
import { createMind } from './mind.js';
import { createNodes } from './nodes.js';
import { setText } from './ui.js';

// SCENE
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050714, 6, 15);

// CAMERA
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// MIND
const mind = createMind();
scene.add(mind);

// NODES
const nodes = createNodes();
nodes.forEach(n => mind.add(n));

// INTERACTION
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let activatedCount = 0;

function updateMouse(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', e => {
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);

    const hit = raycaster.intersectObjects(nodes)[0];
    if (hit) {
        document.body.style.cursor = "pointer";
        setText(hit.object.userData.label);
    } else {
        document.body.style.cursor = "default";
        setText("");
    }
});

window.addEventListener('click', e => {
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);

    const hit = raycaster.intersectObjects(nodes)[0];
    if (!hit) return;

    const node = hit.object;
    if (node.userData.activated) return;

    node.userData.activated = true;
    activatedCount++;

    gsap.to(node.scale, { x: 2, y: 2, z: 2, duration: 0.4 });
    gsap.to(mind.userData.core.material, {
        emissiveIntensity: 0.8,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });

    if (activatedCount === nodes.length) {
        setText("L’esprit est maintenant façonné.");
        gsap.to(camera.position, { z: 12, duration: 2 });
    }
});

// LOOP
function animate() {
    mind.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
