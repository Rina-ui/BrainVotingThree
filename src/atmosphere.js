import * as THREE from 'three';

export function createAtmosphere(scene) {
    scene.fog = new THREE.FogExp2(0x030509, 0.035);

    // STARS
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 15000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPos[i] = (Math.random() - 0.5) * 60;
        starsPos[i + 1] = (Math.random() - 0.5) * 60;
        starsPos[i + 2] = (Math.random() - 0.5) * 60;

        // COLOR VARIATION
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            starsColors[i] = 0.42;
            starsColors[i + 1] = 0.67;
            starsColors[i + 2] = 1;
        } else if (colorChoice < 0.66) {
            starsColors[i] = 1;
            starsColors[i + 1] = 0.42;
            starsColors[i + 2] = 0.42;
        } else {
            starsColors[i] = 0.96;
            starsColors[i + 1] = 0.62;
            starsColors[i + 2] = 0;
        }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMat = new THREE.PointsMaterial({
        size: 0.04,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // ENERGY PARTICLES
    const energyGeo = new THREE.BufferGeometry();
    const energyCount = 500;
    const energyPos = new Float32Array(energyCount * 3);

    for (let i = 0; i < energyCount * 3; i++) {
        energyPos[i] = (Math.random() - 0.5) * 30;
    }

    energyGeo.setAttribute('position', new THREE.BufferAttribute(energyPos, 3));

    const energyMat = new THREE.PointsMaterial({
        color: 0x6b7cff,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const energyParticles = new THREE.Points(energyGeo, energyMat);
    scene.add(energyParticles);

    return stars;
}