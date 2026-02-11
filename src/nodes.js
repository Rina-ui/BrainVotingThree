import * as THREE from 'three';

export function createNodes() {
    const data = [
        { label: "Empathie", color: 0xff6b6b, angle: 0 },
        { label: "Raison", color: 0x4dabf7, angle: 2.1 },
        { label: "Instinct", color: 0xf59f00, angle: 4.2 }
    ];

    return data.map(d => {
        // MAIN SPHERE
        const mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.4, 2),
            new THREE.MeshPhysicalMaterial({
                color: d.color,
                emissive: d.color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.5,
                metalness: 0.3,
                roughness: 0.2,
                clearcoat: 1,
                clearcoatRoughness: 0.1
            })
        );

        mesh.position.set(
            Math.cos(d.angle) * 6,
            Math.sin(d.angle) * 1.2,
            Math.sin(d.angle) * 6
        );

        mesh.userData = {
            label: d.label,
            influence: 0,
            angle: d.angle,
            baseColor: d.color
        };

        // OUTER GLOW RING
        const ringGeo = new THREE.RingGeometry(0.5, 0.7, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: d.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);

        // INNER CORE
        const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        mesh.add(core);

        return mesh;
    });
}