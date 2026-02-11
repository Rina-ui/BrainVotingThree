export function setLabel(text) {
    const label = document.getElementById("label");
    label.innerText = text || "";

    if (text) {
        label.style.transform = 'scale(1.1)';
        label.style.opacity = '1';
    } else {
        label.style.transform = 'scale(1)';
        label.style.opacity = '0.85';
    }
}

export function setEnergy(value) {
    document.getElementById("energy").innerText = "Énergie totale : " + value;
}

export function showVoteResult(choice, count) {
    const result = document.getElementById("vote-result");
    result.innerHTML = `
        <div class="vote-popup">
            <div class="vote-choice">${choice}</div>
            <div class="vote-count">Vote #${count}</div>
        </div>
    `;

    result.style.opacity = '1';
    result.style.transform = 'translateY(0)';

    setTimeout(() => {
        result.style.opacity = '0';
        result.style.transform = 'translateY(-20px)';
    }, 2000);
}