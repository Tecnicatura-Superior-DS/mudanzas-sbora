// Navigation Scroll Effects
const header = document.querySelector('.header');
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Scroll to form top for context
    const formTop = document.getElementById('presupuesto').offsetTop - 100;
    window.scrollTo({ top: formTop, behavior: 'smooth' });
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

// Selection Handlers (Step 2)
window.selectType = function(type) {
    const options = document.querySelectorAll('.type-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Find the clicked element via event
    const target = event.currentTarget || document.getElementById(`type-${type}`);
    if (target) target.classList.add('selected');
    
    document.getElementById('prop-type').value = type;
    
    const deptoDetails = document.getElementById('depto-details');
    if (type === 'depto') {
        deptoDetails.classList.add('active');
    } else {
        deptoDetails.classList.remove('active');
    }
};

// Counter Logic (Step 3)
window.inc = function(id) {
    const input = document.getElementById(`inv-${id}`);
    input.value = parseInt(input.value) + 1;
    
    if (id === 'sil') {
        document.getElementById('cuerpos-wrap').classList.add('active');
    }
};

window.dec = function(id) {
    const input = document.getElementById(`inv-${id}`);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        
        if (id === 'sil' && parseInt(input.value) === 0) {
            document.getElementById('cuerpos-wrap').classList.remove('active');
        }
    }
};

// Message Construction
function constructMessage(data, isWhatsApp = true) {
    let msg = `🚚 SOLICITUD DE PRESUPUESTO - SBORA MUDANZAS\n\n`;
    msg += `👤 Cliente: ${data.name}\n`;
    msg += `📧 Email: ${data.email}\n`;
    msg += `📞 WhatsApp: ${data.phone}\n\n`;
    msg += `📍 De: ${data.origin}\n📍 Hacia: ${data.dest}\n\n`;
    msg += `🏠 Propiedad: ${data.type.toUpperCase()} (Piso ${data.piso}, Ascensor: ${data.asc})\n`;
    msg += `📦 Inventario:\n`;
    
    const items = {
        'Ambientes': data.amb,
        'TVs': data.tv,
        'Heladeras': data.hel,
        'Lavarropas': data.lav,
        'Mesas': data.mes,
        'Sillas': data.silla,
        'Camas': data.cam,
        'Cajas': data.caj
    };
    
    Object.keys(items).forEach(key => {
        if (items[key] > 0) msg += `- ${key}: ${items[key]}\n`;
    });
    
    if (data.sil > 0) {
        msg += `- Sillones: ${data.sil} (${data.silCuerpos == 'esq' ? 'Esquinero' : data.silCuerpos + ' Cuerpos'})\n`;
    }
    
    return isWhatsApp ? encodeURIComponent(msg) : msg;
}

// Submissions
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        origin: document.getElementById('origin').value,
        dest: document.getElementById('destination').value,
        type: document.getElementById('prop-type').value,
        piso: document.getElementById('piso').value || '0',
        asc: document.querySelector('input[name="ascensor"]:checked')?.value || 'N/A',
        amb: document.getElementById('inv-amb').value,
        tv: document.getElementById('inv-tv').value,
        sil: document.getElementById('inv-sil').value,
        silCuerpos: document.getElementById('sillones-cuerpos').value,
        hel: document.getElementById('inv-hel').value,
        lav: document.getElementById('inv-lav').value,
        mes: document.getElementById('inv-mes').value,
        silla: document.getElementById('inv-silla').value,
        cam: document.getElementById('inv-cam').value,
        caj: document.getElementById('inv-caj').value
    };
    
    const whatsappUrl = `https://wa.me/541156543961?text=${constructMessage(data)}`;
    window.open(whatsappUrl, '_blank');
});

window.sendByEmail = function() {
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        origin: document.getElementById('origin').value,
        dest: document.getElementById('destination').value,
        type: document.getElementById('prop-type').value,
        piso: document.getElementById('piso').value || '0',
        asc: document.querySelector('input[name="ascensor"]:checked')?.value || 'N/A',
        amb: document.getElementById('inv-amb').value,
        tv: document.getElementById('inv-tv').value,
        sil: document.getElementById('inv-sil').value,
        silCuerpos: document.getElementById('sillones-cuerpos').value,
        hel: document.getElementById('inv-hel').value,
        lav: document.getElementById('inv-lav').value,
        mes: document.getElementById('inv-mes').value,
        silla: document.getElementById('inv-silla').value,
        cam: document.getElementById('inv-cam').value,
        caj: document.getElementById('inv-caj').value
    };
    
    const subject = encodeURIComponent('Consulta de Mudanza - ' + data.name);
    const body = encodeURIComponent(constructMessage(data, false));
    window.location.href = `mailto:info@sboramudanzas.com.ar?subject=${subject}&body=${body}`;
};

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});
