/* ============================================
   MogxTech — script.js
   Emmanuel Stanley Mogella · Arusha, Tanzania
   ============================================ */

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '255768557268';

/* ══════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════ */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

/* ══════════════════════════════════════════════
   NAVBAR — SHRINK ON SCROLL
══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ══════════════════════════════════════════════
   SCROLL FADE-IN ANIMATIONS
══════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const menu = document.getElementById('mobileMenu');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});

/* ══════════════════════════════════════════════
   SELECT ORDER — Pre-fills form from service buttons
══════════════════════════════════════════════ */
function selectOrder(serviceName) {
  // Scroll to contact section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Pre-fill the service dropdown after scroll lands
  setTimeout(() => {
    const serviceEl = document.getElementById('service');
    if (serviceEl) {
      // Find matching option (case-insensitive, partial match)
      const options = Array.from(serviceEl.options);
      const match = options.find(o =>
        o.text.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) {
        serviceEl.value = match.value;
        pulseField(serviceEl);
      }
    }

    // Auto-set order type based on service name
    const orderTypeEl = document.getElementById('orderType');
    if (orderTypeEl) {
      const productKeywords = ['accessories', 'product'];
      const isProduct = productKeywords.some(k => serviceName.toLowerCase().includes(k));
      orderTypeEl.value = isProduct ? 'product' : 'service';
      updateQuantityVisibility();
    }

    // Focus first name if empty
    const firstNameEl = document.getElementById('firstName');
    if (firstNameEl && !firstNameEl.value.trim()) {
      firstNameEl.focus();
    }
  }, 700);
}

/* ══════════════════════════════════════════════
   ORDER TYPE — Show/hide quantity based on type
══════════════════════════════════════════════ */
function updateQuantityVisibility() {
  const orderTypeEl = document.getElementById('orderType');
  const quantityGroup = document.getElementById('quantity')?.closest('.form-group');
  if (!orderTypeEl || !quantityGroup) return;

  const val = orderTypeEl.value;
  // Show quantity only for product or both orders
  quantityGroup.style.display = (val === 'product' || val === 'both') ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const orderTypeEl = document.getElementById('orderType');
  if (orderTypeEl) {
    updateQuantityVisibility(); // initial state
    orderTypeEl.addEventListener('change', updateQuantityVisibility);
  }
});

/* ══════════════════════════════════════════════
   WHATSAPP SUBMIT — Builds message & opens WhatsApp
══════════════════════════════════════════════ */
function submitForm() {
  const firstName     = document.getElementById('firstName').value.trim();
  const lastName      = document.getElementById('lastName').value.trim();
  const phone         = document.getElementById('phone').value.trim();
  const email         = document.getElementById('email').value.trim();
  const orderType     = document.getElementById('orderType')?.value || '';
  const service       = document.getElementById('service').value;
  const quantity      = document.getElementById('quantity')?.value.trim() || '';
  const message       = document.getElementById('message').value.trim();
  const contactMethod = document.getElementById('contactMethod')?.value || 'WhatsApp';
  const successEl     = document.getElementById('successMsg');

  /* ── Validation ── */
  if (!firstName) { shakeField('firstName', 'First name is required'); return; }
  if (!phone)     { shakeField('phone', 'Phone number is required'); return; }
  if (!service)   { shakeField('service', 'Please select a service'); return; }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    shakeField('email', 'Please enter a valid email address');
    return;
  }

  /* ── Loading state ── */
  const btn = document.querySelector('.submit-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Preparing WhatsApp…';
  btn.disabled = true;

  setTimeout(() => {
    /* ── Build WhatsApp message ── */
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    const qty      = quantity && parseInt(quantity) > 0 ? parseInt(quantity) : 1;

    let waMsg = `*🛠 New Order — MogxTech*\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `*Name:* ${fullName}\n`;
    waMsg += `*Phone:* ${phone}\n`;
    if (email) waMsg += `*Email:* ${email}\n`;
    waMsg += `*Order Type:* ${orderType || 'Not specified'}\n`;
    waMsg += `*Service / Product:* ${service}\n`;
    if (orderType === 'product' || orderType === 'both') {
      waMsg += `*Quantity:* ${qty}\n`;
    }
    waMsg += `*Preferred Contact:* ${contactMethod}\n`;
    if (message) {
      waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
      waMsg += `*Details:*\n${message}\n`;
    }
    waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `_Sent via MogxTech website_`;

    const encoded = encodeURIComponent(waMsg);
    const waURL   = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    /* ── Open WhatsApp ── */
    window.open(waURL, '_blank', 'noopener,noreferrer');

    /* ── Reset button ── */
    btn.textContent = originalText;
    btn.disabled = false;

    /* ── Show success banner ── */
    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* ── Clear form ── */
    ['firstName','lastName','phone','email','message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const serviceEl = document.getElementById('service');
    if (serviceEl) serviceEl.value = '';
    const orderTypeEl = document.getElementById('orderType');
    if (orderTypeEl) { orderTypeEl.value = ''; updateQuantityVisibility(); }
    const quantityEl = document.getElementById('quantity');
    if (quantityEl) quantityEl.value = '';
    const contactMethodEl = document.getElementById('contactMethod');
    if (contactMethodEl) contactMethodEl.value = 'WhatsApp';

    /* ── Hide success after 8 seconds ── */
    setTimeout(() => { successEl.style.display = 'none'; }, 8000);
  }, 900);
}

/* ══════════════════════════════════════════════
   FIELD HELPERS
══════════════════════════════════════════════ */
function shakeField(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#ff4444';
  el.style.animation   = 'shake 0.4s ease';
  el.focus();
  const originalPlaceholder = el.placeholder;
  el.placeholder = msg;
  setTimeout(() => {
    el.style.animation   = '';
    el.style.borderColor = '';
    el.placeholder       = originalPlaceholder;
  }, 2000);
}

function pulseField(el) {
  el.style.transition  = 'box-shadow 0.3s ease';
  el.style.boxShadow   = '0 0 0 3px rgba(0,212,255,0.35)';
  setTimeout(() => { el.style.boxShadow = ''; }, 1200);
}

/* ── Inject keyframes ── */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(styleTag);

/* ══════════════════════════════════════════════
   REAL-TIME CHARACTER COUNTER — message textarea
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const msgEl = document.getElementById('message');
  if (!msgEl) return;

  // Create counter element
  const counter = document.createElement('small');
  counter.style.cssText = 'display:block;text-align:right;color:var(--muted,#888);margin-top:4px;font-size:.78rem;';
  counter.textContent = '0 / 500 characters';
  msgEl.parentNode.appendChild(counter);

  msgEl.setAttribute('maxlength', '500');
  msgEl.addEventListener('input', () => {
    const len = msgEl.value.length;
    counter.textContent = `${len} / 500 characters`;
    counter.style.color = len > 450 ? '#ff8c00' : 'var(--muted,#888)';
  });
});

/* ══════════════════════════════════════════════
   LIVE PHONE FORMAT HINT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const phoneEl = document.getElementById('phone');
  if (!phoneEl) return;

  phoneEl.addEventListener('input', () => {
    // Strip non-numeric except leading +
    let val = phoneEl.value.replace(/[^\d+]/g, '');
    phoneEl.value = val;
  });
});

/* ══════════════════════════════════════════════
   GALLERY LIGHTBOX
══════════════════════════════════════════════ */
const galleryData = [
  {
    emoji: '📱',
    title: 'Phone Screen Replacement',
    desc:  'We replace cracked and damaged screens for all major smartphone brands — Samsung, iPhone, Tecno, Infinix, and more. Same-day service available.'
  },
  {
    emoji: '💻',
    title: 'PC Maintenance & Repair',
    desc:  'Full PC diagnostics, hardware upgrades, virus removal, OS reinstallation and optimization. We get your computer running like new.'
  },
  {
    emoji: '🌐',
    title: 'Web Development',
    desc:  'Custom websites and web applications built with HTML, CSS, JavaScript and modern frameworks. Responsive, fast, and professional.'
  },
  {
    emoji: '🔌',
    title: 'Network Infrastructure',
    desc:  'Complete network setup for homes and offices — routers, switches, Wi-Fi access points, LAN cabling and network security configuration.'
  },
  {
    emoji: '⚡',
    title: 'Charge Port & Battery Repair',
    desc:  'Phone not charging? We repair or replace charge ports, batteries and power management components quickly and reliably.'
  },
  {
    emoji: '🖥️',
    title: 'System Design & Architecture',
    desc:  'Custom software system design, database architecture, and technical planning for startups and growing businesses.'
  }
];

function openLightbox(index) {
  const lb   = document.getElementById('lightbox');
  const data = galleryData[index];
  document.getElementById('lbEmoji').textContent = data.emoji;
  document.getElementById('lbTitle').textContent = data.title;
  document.getElementById('lbDesc').textContent  = data.desc;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function openAccLightbox() {
  const lightbox = document.getElementById('accLightbox');
  if (lightbox) {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAccLightbox() {
  const lightbox = document.getElementById('accLightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeProdModal() {
  const modal = document.getElementById('prodModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  const lb = document.getElementById('lightbox');
  const accLightbox = document.getElementById('accLightbox');
  const prodModal = document.getElementById('prodModal');

  if (lb && e.target === lb) closeLightbox();
  if (accLightbox && e.target === accLightbox) closeAccLightbox();
  if (prodModal && e.target === prodModal) closeProdModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeAccLightbox();
    closeProdModal();
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* ══════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ══════════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT
══════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ══════════════════════════════════════════════
   PRICING CARD — HOVER TILT
══════════════════════════════════════════════ */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform  = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ══════════════════════════════════════════════
   WHATSAPP TOOLTIP — Show on hover after 2s idle
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const waBtn     = document.querySelector('.whatsapp-btn');
  const waTooltip = document.querySelector('.whatsapp-tooltip');
  if (!waBtn || !waTooltip) return;

  let tooltipTimer;

  // Show tooltip after page has loaded for 3 seconds
  tooltipTimer = setTimeout(() => {
    waTooltip.style.opacity   = '1';
    waTooltip.style.transform = 'translateY(0)';
    setTimeout(() => {
      waTooltip.style.opacity   = '0';
      waTooltip.style.transform = 'translateY(8px)';
    }, 3500);
  }, 3000);

  waBtn.addEventListener('mouseenter', () => {
    waTooltip.style.opacity   = '1';
    waTooltip.style.transform = 'translateY(0)';
  });
  waBtn.addEventListener('mouseleave', () => {
    waTooltip.style.opacity   = '0';
    waTooltip.style.transform = 'translateY(8px)';
  });
});

/* ══════════════════════════════════════════════
   FOOTER YEAR AUTO-UPDATE
══════════════════════════════════════════════ */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════
   PRODUCTS MODAL (FIX IMAGE NOT SHOWING)
══════════════════════════════════════════════ */
const products = [
  {
    name: '🔋 Phone Battery',
    imgs: ['images/accessories/battery.jpg', 'images/accessories/accessories.jpg'],
    price: 'From TSh 8,000',
    specs: [
      'Compatible with Samsung, iPhone, Tecno, Infinix & more',
      'High-capacity original quality cells',
      'Long-lasting charge cycle life',
      'Safe overcharge & temperature protection',
      'Available for most phone models'
    ]
  },
  {
    name: '✨ Chemli',
    imgs: ['images/accessories/chemli.jpg', 'images/accessories/accessories.jpg'],
    price: 'Ask for Price',
    specs: [
      'Premium quality product',
      'Durable and long-lasting build',
      'Compatible with multiple devices',
      'Available in various styles',
      'Contact us for full details'
    ]
  },
  {
    name: '💡 Fume Light',
    imgs: ['images/accessories/fume-light.jpg', 'images/accessories/accessories.jpg'],
    price: 'Ask for Price',
    specs: [
      'Portable and rechargeable',
      'Bright LED output',
      'USB charging support',
      'Compact and lightweight design',
      'Ideal for home and outdoor use'
    ]
  },
  {
    name: '🖥️ Phone & PC Stand',
    imgs: ['images/accessories/stand.jpg', 'images/accessories/accessories.jpg'],
    price: 'From TSh 10,000',
    specs: [
      'Adjustable height and angle',
      'Compatible with phones, tablets & laptops',
      'Anti-slip base for stability',
      'Foldable and portable design',
      'Reduces neck and eye strain'
    ]
  },
  {
    name: '⚡ Charger',
    imgs: ['images/accessories/charger.jpg', 'images/accessories/accessories.jpg'],
    price: 'From TSh 5,000',
    specs: [
      'Fast charging support (18W–65W)',
      'Compatible with USB-C, Micro-USB & Lightning',
      'Universal voltage (100–240V)',
      'Built-in surge protection',
      'Available: wall charger, car charger & travel adapters'
    ]
  },
  {
    name: '🎧 Earpods',
    imgs: ['images/accessories/earpods.jpg', 'images/accessories/accessories.jpg'],
    price: 'From TSh 6,000',
    specs: [
      'Crystal clear stereo sound',
      'Wired & wireless (Bluetooth) options',
      'Built-in microphone for calls',
      'Comfortable ergonomic fit',
      'Compatible with all smartphones'
    ]
  },
  {
    name: '🛍️ Other Accessories',
    imgs: ['images/accessories/accessories.jpg', 'images/accessories/charger.jpg'],
    price: 'Various Prices',
    specs: [
      'Screen protectors (tempered glass)',
      'Phone cases for all brands',
      'Memory cards (original quality)',
      'USB cables (fast charging)',
      'Contact us for full product list'
    ]
  },
  {
    name: '⌚ Smart Watch',
    imgs: ['images/accessories/smartwatch.jpg', 'images/accessories/accessories.jpg'],
    price: 'From TSh 35,000',
    specs: [
      'Heart rate & fitness tracking',
      'Bluetooth call & notification support',
      'Water resistant design',
      'Long battery life (5–7 days)',
      'Compatible with Android & iOS'
    ]
  }
];

let currentProductImages = [];
let currentImageIndex = 0;

/* OPEN PRODUCT MODAL */
function openProduct(index) {
  const product = products[index];
  if (!product) return;

  const prodModalImg = document.getElementById('prodModalImg');
  const prodModalName = document.getElementById('prodModalName');
  const prodModalPrice = document.getElementById('prodModalPrice');
  const specsList = document.getElementById('prodModalSpecs');
  const prodModalOrder = document.getElementById('prodModalOrder');
  const prodModal = document.getElementById('prodModal');

  if (!prodModalImg || !prodModalName || !prodModalPrice || !specsList || !prodModalOrder || !prodModal) return;

  const images = Array.isArray(product.imgs) ? product.imgs : [product.imgs || product.img];
  currentProductImages = images.filter(Boolean);
  currentImageIndex = 0;
  renderProductGallery(currentProductImages, product.name);
  prodModalName.textContent = product.name;
  prodModalPrice.textContent = product.price;
  specsList.innerHTML = '';

  product.specs.forEach(spec => {
    const li = document.createElement('li');
    li.textContent = spec;
    specsList.appendChild(li);
  });

  const waMsg = encodeURIComponent(
    `Hello EmStanTech! 👋\nI am interested in: *${product.name}*\nPlease send me more details and availability.\n_Sent from MogxTech website_`
  );
  prodModalOrder.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  prodModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderProductGallery(images, productName) {
  const prodModalImg = document.getElementById('prodModalImg');
  const prodModalThumbs = document.getElementById('prodModalThumbs');
  if (!prodModalImg || !prodModalThumbs) return;

  prodModalThumbs.innerHTML = '';
  if (!images.length) {
    prodModalImg.src = '';
    prodModalImg.alt = productName || 'Product image';
    return;
  }

  images.forEach((src, index) => {
    const thumbBtn = document.createElement('button');
    thumbBtn.type = 'button';
    thumbBtn.className = 'prod-modal-thumb' + (index === currentImageIndex ? ' active' : '');
    thumbBtn.innerHTML = `<img src="${src}" alt="${productName} image ${index + 1}" />`;
    thumbBtn.addEventListener('click', () => setModalImage(index));
    prodModalThumbs.appendChild(thumbBtn);
  });

  setModalImage(currentImageIndex);
}

function setModalImage(index) {
  if (!currentProductImages.length) return;
  currentImageIndex = ((index % currentProductImages.length) + currentProductImages.length) % currentProductImages.length;

  const prodModalImg = document.getElementById('prodModalImg');
  const thumbs = document.querySelectorAll('.prod-modal-thumb');
  if (prodModalImg) {
    prodModalImg.src = currentProductImages[currentImageIndex];
    prodModalImg.alt = `Product image ${currentImageIndex + 1}`;
  }

  thumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === currentImageIndex));
}

function changeModalImage(direction) {
  if (!currentProductImages.length) return;
  setModalImage(currentImageIndex + direction);
}

/* CLOSE MODAL */
function closeProdModal() {
  const modal = document.getElementById('prodModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
