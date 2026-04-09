// Navigation Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Multi-step Form Logic
let currentStep = 1;
const form = document.getElementById('multi-step-form');
const steps = document.querySelectorAll('.form-step');
const circles = document.querySelectorAll('.circle');
const progress = document.getElementById('progress');

function updateProgress() {
    circles.forEach((circle, idx) => {
        if (idx < currentStep) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    });

    const actives = document.querySelectorAll('.circle.active');
    progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';
}

function showStep(stepNum) {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNum}`).classList.add('active');
    currentStep = stepNum;
    updateProgress();
}

window.nextStep = function(stepNum) {
    // Basic validation for Step 1
    if (currentStep === 1) {
        const origin = document.getElementById('origin').value;
        const dest = document.getElementById('destination').value;
        if (!origin || !dest) {
            alert('Por favor completa origen y destino.');
            return;
        }
    }
    
    // Basic validation for Step 2
    if (currentStep === 2) {
        const size = document.getElementById('size-selection').value;
        if (!size) {
            alert('Por favor selecciona el tamaño de la mudanza.');
            return;
        }
    }

    showStep(stepNum);
};

window.prevStep = function(stepNum) {
    showStep(stepNum);
};

// Size Selection Logic
window.selectSize = function(size) {
    const options = document.querySelectorAll('.size-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Find the clicked element and mark as selected
    const selectedOpt = event.currentTarget;
    selectedOpt.classList.add('selected');
    
    document.getElementById('size-selection').value = size;
};

// Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const dest = document.getElementById('destination').value;
    const size = document.getElementById('size-selection').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    const sizeMap = {
        'mono': 'Monoambiente',
        '2amb': '2 Ambientes',
        'casa': 'Casa Grande',
        'oficina': 'Oficina'
    };

    // Construct WhatsApp Message
    const message = `Hola Mudanzas Sbora! Mi nombre es ${name}. 
Me gustaría un presupuesto para una mudanza:
📍 Origen: ${origin}
🏁 Destino: ${dest}
📦 Tamaño: ${sizeMap[size]}
📞 Contacto: ${phone}

Espero su respuesta, ¡gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491112345678?text=${encodedMessage}`;

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
});

// Mobile Menu Toggle (Simplified)
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
