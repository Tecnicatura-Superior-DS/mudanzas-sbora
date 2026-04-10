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
    // Scroll to top of form
    document.getElementById('presupuesto').scrollIntoView({ behavior: 'smooth' });
}

window.nextStep = function(stepNum) {
    if (currentStep === 1) {
        if (!document.getElementById('origin').value || !document.getElementById('destination').value) {
            alert('Por favor completa origen y destino.');
            return;
        }
    }
    if (currentStep === 2) {
        if (!document.getElementById('prop-type').value) {
            alert('Por favor selecciona el tipo de propiedad.');
            return;
        }
    }
    showStep(stepNum);
};

window.prevStep = function(stepNum) {
    showStep(stepNum);
};

// Selection Handlers
window.selectType = function(type) {
    const options = document.querySelectorAll('.type-option');
    options.forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('prop-type').value = type;
    
    const deptoDetails = document.getElementById('depto-details');
    if (type === 'depto') {
        deptoDetails.classList.add('active');
    } else {
        deptoDetails.classList.remove('active');
    }
};

window.toggleEst = function(show) {
    const estField = document.getElementById('dest-escalera-piso');
    if (show) estField.classList.add('active');
    else estField.classList.remove('active');
};

// Counter UI Helpers
window.inc = function(id) {
    const input = document.getElementById(`inv-${id}`);
    input.value = parseInt(input.value) + 1;
    
    // Toggle cuerpos select if it's sillones
    if (id === 'sil') {
        document.getElementById('cuerpos-wrap').classList.add('active');
    }
};

window.dec = function(id) {
    const input = document.getElementById(`inv-${id}`);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        
        // Hide cuerpos select if sillones reaches 0
        if (id === 'sil' && parseInt(input.value) === 0) {
            document.getElementById('cuerpos-wrap').classList.remove('active');
        }
    }
};

// Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const dest = document.getElementById('destination').value;
    const type = document.getElementById('prop-type').value;
    const piso = document.getElementById('piso').value || '0';
    const asc = document.querySelector('input[name="ascensor"]:checked')?.value || 'N/A';
    
    // Inventory
    const amb = document.getElementById('inv-amb').value;
    const tv = document.getElementById('inv-tv').value;
    const sil = document.getElementById('inv-sil').value;
    const silCuerpos = document.getElementById('inv-sil-cuerpos').value;
    const mueG = document.getElementById('inv-mue-g').value;
    const mueC = document.getElementById('inv-mue-c').value;
    const cam1 = document.getElementById('inv-cam-1').value;
    const cam2 = document.getElementById('inv-cam-2').value;
    const camS = document.getElementById('inv-cam-s').value;
    const camC = document.getElementById('inv-cam-c').value;
    
    // Checkboxes
    const electro = [];
    if (document.getElementById('inv-lav').checked) electro.push('Lavarropas');
    if (document.getElementById('inv-coc').checked) electro.push('Cocina');
    if (document.getElementById('inv-hel').checked) electro.push('Heladera');
    if (document.getElementById('inv-mic').checked) electro.push('Microondas');
    if (document.getElementById('inv-lv').checked) electro.push('Lavavajilla');
    
    // Tech
    const aa = document.getElementById('inv-aa').value;
    const ven = document.getElementById('inv-ven').value;
    const ilu = document.getElementById('inv-ilu').value;
    
    // Dest
    const destAcc = document.querySelector('input[name="dest-acc"]:checked')?.value || 'N/A';
    const destPisos = document.getElementById('dest-pisos').value || '0';
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // Construct WhatsApp Message
    let message = `🚚 *SOLICITUD DE PRESUPUESTO - SBORA*\n\n`;
    message += `👤 *Nombre:* ${name}\n`;
    message += `📧 *Email:* ${email}\n`;
    message += `📞 *WhatsApp:* ${phone}\n\n`;
    message += `📍 *RUTA:*\nDesde: ${origin}\nHacia: ${dest}\n\n`;
    message += `🏠 *ORIGEN:* ${type.toUpperCase()}\n`;
    if (type === 'depto') message += `Piso: ${piso} | Ascensor: ${asc}\n`;
    message += `\n📦 *INVENTARIO:*\n`;
    if (amb > 0) message += `- Ambientes: ${amb}\n`;
    if (tv > 0) message += `- TVs: ${tv}\n`;
    if (sil > 0) message += `- Sillones: ${sil} (${silCuerpos == 'esq' ? 'Esquinero' : silCuerpos + ' Cuerpos'})\n`;
    if (mueG > 0) message += `- Muebles Gdes (Placard/Alacena): ${mueG}\n`;
    if (mueC > 0) message += `- Muebles Chicos: ${mueC}\n`;
    if (cam1 > 0) message += `- Camas 1p: ${cam1}\n`;
    if (cam2 > 0) message += `- Camas 2p: ${cam2}\n`;
    if (camS > 0) message += `- Sommier: ${camS}\n`;
    if (camC > 0) message += `- Cucheta: ${camC}\n`;
    if (electro.length > 0) message += `- Electro: ${electro.join(', ')}\n`;
    if (aa) message += `- Aire Acond: ${aa}\n`;
    if (ven > 0) message += `- Ventiladores: ${ven}\n`;
    if (ilu) message += `- Iluminación: ${ilu}\n`;
    
    message += `\n🏁 *DESTINO:*\nAcceso: ${destAcc.toUpperCase()}\n`;
    if (destAcc === 'escalera') message += `Pisos: ${destPisos}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/541156543961?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}
