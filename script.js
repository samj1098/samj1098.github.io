document.addEventListener("DOMContentLoaded", function() {
    // Retrieve stored values from localStorage or set defaults
    const startTime = localStorage.getItem('startTime') ? parseInt(localStorage.getItem('startTime')) : Date.now();
    let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;

    // Detect browser information (stored only once)
    const browserInfo = localStorage.getItem('browserInfo') || navigator.userAgent;
    localStorage.setItem('browserInfo', browserInfo); // Save to localStorage

    // Detect device type (stored only once)
    const deviceType = localStorage.getItem('deviceType') || (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
    localStorage.setItem('deviceType', deviceType); // Save to localStorage

    // Update totalClicks with each click and store in localStorage
    document.addEventListener('click', () => {
        totalClicks++;
        localStorage.setItem('totalClicks', totalClicks); // Save click count to localStorage
    });

    // When the user leaves the site (e.g., closes the browser, or navigates to a different site), save final values
    window.addEventListener('beforeunload', function() {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000; // Time spent in seconds

        // Collect visitor data
        const visitorData = {
            ip: null, // This will be captured by the backend
            browser: browserInfo,
            deviceType: deviceType,
            timeSpent: timeSpent,
            totalClicks: totalClicks,
            navigationHistory: window.location.href // Current URL
        };

        // Send data to the server using sendBeacon to ensure it's sent even if the page unloads
        navigator.sendBeacon('http://localhost:3000/api/auth/track-visitor', JSON.stringify(visitorData));

    });

    // Save the startTime when the user first enters the site or navigates between pages
    localStorage.setItem('startTime', startTime);
});
