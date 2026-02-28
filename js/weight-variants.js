document.addEventListener('DOMContentLoaded', function() {
    // Check for hash in URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Remove the '#'
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Add a small timeout to ensure the page is fully loaded
            setTimeout(() => {
                // Calculate the position to scroll to (accounting for fixed header)
                const headerOffset = 100; // Adjust this value based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Scroll to the element
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Add a highlight effect
                targetElement.style.transition = 'background-color 2s ease';
                targetElement.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
                
                // Remove highlight after 2 seconds
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }, 100);
        }
    }
});
