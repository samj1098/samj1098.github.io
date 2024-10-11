let curX = 0;  // Current X position of the orb
let curY = 0;  // Current Y position of the orb
let targetX = 0;  // Target X position (mouse position)
let targetY = 0;  // Target Y position (mouse position)

document.addEventListener('DOMContentLoaded', () => {
    const interactiveOrb = document.querySelector('.interactive');

    function moveOrb() {
        // Smoothly move the orb by adjusting its current position to move closer to the target
        curX += (targetX - curX) / 10;  // The larger the divisor, the slower it will follow
        curY += (targetY - curY) / 10;
        
        // Set the new position of the orb
        interactiveOrb.style.transform = `translate(${curX}px, ${curY}px)`;
        
        // Continue the animation
        requestAnimationFrame(moveOrb);
    }

    // Update the target position on mouse move
    window.addEventListener('mousemove', (event) => {
        // Subtract half of the orb's size to center it on the mouse
        targetX = event.clientX - interactiveOrb.offsetWidth / 2;
        targetY = event.clientY - interactiveOrb.offsetHeight / 2;
    });

    // Start the animation
    moveOrb();
});
