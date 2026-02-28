document.addEventListener('DOMContentLoaded', function() {
    const variantsSection = document.getElementById('variants');
    const variantsContainer = document.querySelector('.variants-container');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const variantsScroll = document.querySelector('.variants-scroll');

    const scrollAmount = 300;

    // Scroll left
    function scrollLeft() {
        variantsContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Scroll right
    function scrollRight() {
        variantsContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    if (scrollLeftBtn) scrollLeftBtn.addEventListener('click', scrollLeft);
    if (scrollRightBtn) scrollRightBtn.addEventListener('click', scrollRight);
    
    if (variantsContainer) {
        // Handle touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        variantsContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        variantsContainer.addEventListener('touchmove', function(e) {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });
        
        variantsContainer.addEventListener('touchend', function() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    scrollRight();
                } else {
                    scrollLeft();
                }
            }
        }, { passive: true });
    }
    
    // Initial setup
    window.addEventListener('scroll', function() {
        if (!variantsSection) return;
        
        const rect = variantsSection.getBoundingClientRect();
        const isInView = (
            rect.top <= (window.innerHeight * 0.8) && 
            rect.bottom >= (window.innerHeight * 0.2)
        );
        
        if (isInView) {
            variantsSection.classList.add('visible');
        } else {
            variantsSection.classList.remove('visible');
        }
    });
    window.addEventListener('resize', function() {
        if (!variantsSection) return;
        
        const rect = variantsSection.getBoundingClientRect();
        const isInView = (
            rect.top <= (window.innerHeight * 0.8) && 
            rect.bottom >= (window.innerHeight * 0.2)
        );
        
        if (isInView) {
            variantsSection.classList.add('visible');
        } else {
            variantsSection.classList.remove('visible');
        }
    });
});
