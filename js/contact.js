// Check if EmailJS is loaded
if (typeof emailjs === 'undefined') {
    console.error('EmailJS is not loaded!');
} else {
    console.log('EmailJS is loaded:', emailjs);
}

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    
    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }

    console.log('Contact form found, setting up submit handler...');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            to_name: 'Hajiyar Rice Mundy',
            from_name: document.getElementById('from_name').value.trim(),
            from_email: document.getElementById('from_email').value.trim(),
            phone_number: document.getElementById('from_phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        statusDiv.textContent = 'Sending your message...';
        statusDiv.className = 'form-status';
        
        console.log('Sending email with data:', formData);
        
        // Send email
        emailjs.send('service_m0re5ov', 'template_hfrjoip', formData)
            .then(function(response) {
                console.log('Email sent successfully!', response);
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.className = 'form-status success';
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('Email send error:', error);
                statusDiv.textContent = 'Failed to send. Please call us directly.';
                statusDiv.className = 'form-status error';
                
                // More detailed error message
                if (error.text) {
                    try {
                        const errorData = JSON.parse(error.text);
                        console.error('EmailJS Error:', errorData);
                        if (errorData.error) {
                            statusDiv.textContent = 'Error: ' + errorData.error;
                        }
                    } catch (e) {
                        console.error('Error parsing error response:', e);
                    }
                }
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
});