// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function setTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        if(sunIcon) sunIcon.style.display = 'block';
        if(moonIcon) moonIcon.style.display = 'none';
        localStorage.setItem('sbora-theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        if(sunIcon) sunIcon.style.display = 'none';
        if(moonIcon) moonIcon.style.display = 'block';
        localStorage.setItem('sbora-theme', 'dark');
    }
}

if (localStorage.getItem('sbora-theme') === 'light') {
    setTheme(true);
}

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = !document.body.classList.contains('light-mode');
        setTheme(isLight);
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
    });
});

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
    const target = event?.currentTarget || document.getElementById(`type-${type}`);
    if (target) target.classList.add('selected');
    
    document.getElementById('prop-type').value = type;
    
    const deptoDetails = document.getElementById('depto-details');
    if (type === 'depto') {
        deptoDetails.classList.add('active');
    } else {
        deptoDetails.classList.remove('active');
    }
};

// Counter Logic (Step 3) & Dynamic Opts
function renderDynamicOpts(id, count) {
    const container = document.getElementById(`din-${id}`);
    if (!container) return;
    
    if (count === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    container.style.display = 'flex';
    
    // Save current values to preserve them during re-render
    const currentSelects = container.querySelectorAll(`.din-sel-${id}`);
    const values = Array.from(currentSelects).map(s => s.value);
    
    let html = '';
    for (let i = 1; i <= count; i++) {
        html += `<div style="display:flex; justify-content:space-between; align-items:center;">`;
        if (id === 'sil') {
            html += `<label style="font-size:0.85rem;">Sillón ${i}</label>
                     <select class="din-sel-${id}" style="width:140px; padding:0.4rem; font-size:0.85rem; border-radius:6px; background:var(--bg-color); color:var(--text-primary); border:1px solid var(--glass-border);">
                         <option value="1">1 Cuerpo</option>
                         <option value="2">2 Cuerpos</option>
                         <option value="3">3 Cuerpos</option>
                         <option value="esq">Esquinero</option>
                     </select>`;
        } else if (id === 'plac') {
            html += `<label style="font-size:0.85rem;">Placard ${i}</label>
                     <select class="din-sel-${id}" style="width:140px; padding:0.4rem; font-size:0.85rem; border-radius:6px; background:var(--bg-color); color:var(--text-primary); border:1px solid var(--glass-border);">
                         <option value="1">1 Puerta</option>
                         <option value="2">2 Puertas</option>
                         <option value="3">3 Puertas</option>
                         <option value="4">4 Puertas</option>
                         <option value="5">5 Puertas</option>
                         <option value="6">6 Puertas</option>
                     </select>`;
        } else if (id === 'aire') {
            html += `<label style="font-size:0.85rem;">Aire ${i} (Frig.)</label>
                     <input type="number" class="din-sel-${id}" placeholder="Ej: 3000" style="width:140px; padding:0.4rem; font-size:0.85rem; border-radius:6px; background:var(--bg-color); color:var(--text-primary); border:1px solid var(--glass-border);">`;
        }
        html += `</div>`;
    }
    
    container.innerHTML = html;
    
    // Restore values
    const newSelects = container.querySelectorAll(`.din-sel-${id}`);
    newSelects.forEach((sel, idx) => {
        if (values[idx]) sel.value = values[idx];
    });
}

window.inc = function(id) {
    const input = document.getElementById(`inv-${id}`);
    const newVal = parseInt(input.value) + 1;
    input.value = newVal;
    renderDynamicOpts(id, newVal);
};

window.dec = function(id) {
    const input = document.getElementById(`inv-${id}`);
    if (parseInt(input.value) > 0) {
        const newVal = parseInt(input.value) - 1;
        input.value = newVal;
        renderDynamicOpts(id, newVal);
    }
};

function getDynamicValues(id) {
    const els = document.querySelectorAll(`.din-sel-${id}`);
    return Array.from(els).map(e => e.value);
}

// Message Construction
function constructMessage(data, isWhatsApp = true) {
    let msg = `🚚 SOLICITUD DE PRESUPUESTO - SBORA MUDANZAS\n\n`;
    msg += `👤 Cliente: ${data.name}\n`;
    msg += `📧 Email: ${data.email}\n`;
    msg += `📞 WhatsApp: ${data.phone}\n\n`;
    msg += `📍 De: ${data.origin}\n📍 Hacia: ${data.dest}\n`;
    msg += `🏢 Detalles Destino: ${data.destAcc}\n\n`;
    msg += `🏠 Propiedad: ${data.type.toUpperCase()} (Piso ${data.piso}, Ascensor: ${data.asc})\n`;
    msg += `🏠 Ambientes: ${data.amb}\n\n`;
    
    msg += `📦 INVENTARIO:\n`;
    
    const categories = {
        "Dormitorio": {
            "Cama 1P": data.cam1,
            "Cama 2P": data.cam2,
            "Sommier 1P": data.som1,
            "Sommier 2P": data.som2,
            "Mesa Luz": data.mluz,
            "Placard": data.plac
        },
        "Living & Comedor": {
            "TVs": data.tv,
            "Mesa Ratona": data.rat,
            "Mesa Comedor": data.mesa,
            "Sillas": data.silla
        },
        "Cocina & Lavadero": {
            "Heladera": data.hel,
            "Lavavajilla": data.lava,
            "Alacena": data.ala,
            "Cocina": data.coc,
            "Microondas": data.mic,
            "Lavarropas": data.lav,
            "Secarropas": data.sec
        }
    };

    Object.keys(categories).forEach(cat => {
        let catText = "";
        Object.keys(categories[cat]).forEach(item => {
            if (categories[cat][item] > 0) {
                if (item === "Placard" && data.placValues && data.placValues.length > 0) {
                    let pVals = data.placValues.map(v => `${v} Ptas`).join(', ');
                    catText += `- Placards: ${categories[cat][item]} (${pVals})\n`;
                } else {
                    catText += `- ${item}: ${categories[cat][item]}\n`;
                }
            }
        });
        if (catText) {
            msg += `\n[${cat}]\n${catText}`;
        }
    });

    if (data.sil > 0 && data.silValues && data.silValues.length > 0) {
        let sVals = data.silValues.map(v => v === 'esq' ? 'Esquinero' : `${v} Cuerpos`).join(', ');
        msg += `\n- Sillones: ${data.sil} (${sVals})\n`;
    }
    
    if (data.aire > 0) {
        let aVals = data.aireValues && data.aireValues.length > 0 ? data.aireValues.map(v => v ? `${v} fig` : '?').join(', ') : '';
        msg += `\n❄️ Aires Acond.: ${data.aire} (${aVals})\n`;
    }
    
    if (data.vent > 0) msg += `- Ventiladores de Techo: ${data.vent}\n`;

    return isWhatsApp ? encodeURIComponent(msg) : msg;
}

function collectData() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        origin: document.getElementById('origin').value,
        dest: document.getElementById('destination').value,
        destAcc: document.querySelector('input[name="dest-acc"]:checked')?.value || 'N/A',
        type: document.getElementById('prop-type').value,
        piso: document.getElementById('piso').value || '0',
        asc: document.querySelector('input[name="ascensor"]:checked')?.value || 'N/A',
        amb: document.getElementById('inv-amb').value,
        cam1: document.getElementById('inv-cam1').value,
        cam2: document.getElementById('inv-cam2').value,
        som1: document.getElementById('inv-som1').value,
        som2: document.getElementById('inv-som2').value,
        mluz: document.getElementById('inv-mluz').value,
        plac: document.getElementById('inv-plac').value,
        placValues: getDynamicValues('plac'),
        tv: document.getElementById('inv-tv').value,
        rat: document.getElementById('inv-rat').value,
        mesa: document.getElementById('inv-mesa').value,
        silla: document.getElementById('inv-silla').value,
        hel: document.getElementById('inv-hel').value,
        lava: document.getElementById('inv-lava').value,
        ala: document.getElementById('inv-ala').value,
        coc: document.getElementById('inv-coc').value,
        mic: document.getElementById('inv-mic').value,
        lav: document.getElementById('inv-lav').value,
        sec: document.getElementById('inv-sec').value,
        aire: document.getElementById('inv-aire') ? document.getElementById('inv-aire').value : 0,
        aireValues: getDynamicValues('aire'),
        vent: document.getElementById('inv-vent') ? document.getElementById('inv-vent').value : 0,
        sil: document.getElementById('inv-sil').value,
        silValues: getDynamicValues('sil')
    };
}

// Submissions
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectData();
    const whatsappUrl = `https://wa.me/541156543961?text=${constructMessage(data)}`;
    window.open(whatsappUrl, '_blank');
});

window.sendByEmail = function() {
    const data = collectData();
    
    const subject = encodeURIComponent('Consulta de Mudanza Maestro - ' + data.name);
    const body = encodeURIComponent(constructMessage(data, false));
    window.location.href = `mailto:info@sboramudanzas.com.ar?subject=${subject}&body=${body}`;
};

// Smooth Scrolling with dynamic offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offset = window.innerWidth < 1024 ? 80 : 100;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Spy for Mobile Dock
const dockItems = document.querySelectorAll('.dock-item');
const sections = document.querySelectorAll('section[id]');

function scrollSpy() {
    if (window.innerWidth >= 1024) return;
    
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    dockItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', scrollSpy);
window.addEventListener('load', scrollSpy);
