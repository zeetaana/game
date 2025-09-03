document.addEventListener('DOMContentLoaded', () => {
    const levels = {
        level1: true, // Level 1 is always unlocked
        level2: false,
        level3: false,
    };

    // Load progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('levelProgress'));
    if (savedProgress) {
        Object.assign(levels, savedProgress);
    }

    // Update level states
    updateLevelStates();

    // Add click event listeners
    document.getElementById('level1').addEventListener('click', () => {
        alert('Level 1 dimulai!');
        levels.level2 = true; // Unlock Level 2
        saveProgress();
        updateLevelStates();
    });

    document.getElementById('level2').addEventListener('click', () => {
        if (!levels.level2) return;
        alert('Level 2 dimulai!');
        levels.level3 = true; // Unlock Level 3
        saveProgress();
        updateLevelStates();
    });

    document.getElementById('level3').addEventListener('click', () => {
        if (!levels.level3) return;
        alert('Level 3 dimulai!');
    });

    function updateLevelStates() {
        Object.keys(levels).forEach(level => {
            const levelElement = document.getElementById(level);
            if (levels[level]) {
                levelElement.classList.remove('locked');
            } else {
                levelElement.classList.add('locked');
            }
        });
    }

    function saveProgress() {
        localStorage.setItem('levelProgress', JSON.stringify(levels));
    }
});