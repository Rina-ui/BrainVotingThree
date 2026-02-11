import * as THREE from 'three';

export function createMind() {
    const geo = new THREE.IcosahedronGeometry(3, 8);

    const mat = new THREE.MeshPhysicalMaterial({
        color: 0x5c6cff,
        roughness: 0.1,
        transmission: 0.95,
        thickness: 2,
        emissive: 0x2a3f8f,
        emissiveIntensity: 0.5,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        ior: 1.5,
        reflectivity: 0.9
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.energy = 0;

    // INNER ENERGY CORE
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x8b9fff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    mesh.add(core);

    // OUTER GLOW
    const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x4c5cff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);

    return mesh;
}