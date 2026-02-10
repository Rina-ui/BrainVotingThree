import * as THREE from 'three';

export function createNodes() {
    const nodes = [];
    const data = [
        { label: "Empathie", color: 0xff6b6b, position: [-1.5, 0.5, 1] },
        { label: "Logique", color: 0x4dabf7, position: [1.2, 0.8, -1] },
        { label: "Instinct", color: 0xf59f00, position: [0, -1.3, 1.2] }
    ];

    data.forEach(d => {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 32, 32),
            new THREE.MeshStandardMaterial({
                color: d.color,
                emissive: d.color,
                emissiveIntensity: 0.6
            })
        );

        mesh.position.set(...d.position);
        mesh.userData = {
            label: d.label,
            activated: false
        };

        nodes.push(mesh);
    });

    return nodes;
}
