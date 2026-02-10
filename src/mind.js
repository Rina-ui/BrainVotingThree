import * as THREE from 'three';

export function createMind() {
    const group = new THREE.Group();

    const geometry = new THREE.IcosahedronGeometry(2.2, 3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x6d7cff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0x2a2f6f,
        emissiveIntensity: 0.3
    });

    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    group.userData.core = core;
    return group;
}
