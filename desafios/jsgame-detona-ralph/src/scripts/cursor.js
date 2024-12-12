 // Audio setup with error handling
let hammer;
try {
    hammer = new Audio('./src/sounds/hit.m4a');
    hammer.volume = 0.3;
} catch (error) {
    console.error("Error loading audio:", error);
    hammer = null;
}

// Cursor animation and interaction
let panel = document.querySelector('.panel');

panel.addEventListener('mousedown', (event) => {
    // Prevent multiple rapid clicks
    if (panel.classList.contains('cursor')) return;

    panel.classList.add('cursor');
    
    // Play sound only if audio is successfully loaded
    if (hammer) {
        hammer.currentTime = 0; // Reset audio to start
        hammer.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }

    setTimeout(() => {
        panel.classList.remove('cursor');
    }, 200);
});