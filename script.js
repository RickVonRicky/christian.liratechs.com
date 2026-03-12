// ============================================
// BETTY WHITE — Street Art Site
// ============================================

// --- Data ---
const artworks = [
  { id: 1, title: "Kip Watches", category: "murals", desc: "East London wall piece. 12ft tall. Kip watches over the high street.", colors: ["#39ff14", "#1a1a1a"] },
  { id: 2, title: "Tongue Out", category: "canvas", desc: "Acrylic and spray paint on canvas. Kip with tongue catching corporate logos.", colors: ["#ff3366", "#1a1a1a"], price: "£2,400" },
  { id: 3, title: "Lily Pad Riot", category: "murals", desc: "Collaboration piece in Bristol. Kip leading a march of frogs.", colors: ["#39ff14", "#ff3366"] },
  { id: 4, title: "Drip Fed", category: "stencils", desc: "Multi-layer stencil. Commentary on media consumption.", colors: ["#ffe14d", "#1a1a1a"] },
  { id: 5, title: "Neon Swamp", category: "canvas", desc: "Mixed media on canvas. UV-reactive paint under blacklight.", colors: ["#39ff14", "#9b59b6"], price: "£3,100" },
  { id: 6, title: "Croak & Dagger", category: "prints", desc: "Screen print, edition of 50. Kip in noir detective style.", colors: ["#f0f0f0", "#1a1a1a"], price: "£180" },
  { id: 7, title: "Hop Skip", category: "murals", desc: "Abandoned factory wall in Berlin. 30ft mural.", colors: ["#39ff14", "#3498db"] },
  { id: 8, title: "Spawn Point", category: "stencils", desc: "Paste-up series across 6 cities. Kip hatching from an egg.", colors: ["#ffe14d", "#39ff14"] },
  { id: 9, title: "Ribbit Rebel", category: "canvas", desc: "Large format canvas. Protest imagery meets amphibian chaos.", colors: ["#ff3366", "#39ff14"], price: "£4,500" },
  { id: 10, title: "The Pond", category: "prints", desc: "Giclée print, edition of 100. Tranquil scene with hidden messages.", colors: ["#3498db", "#39ff14"], price: "£95" },
  { id: 11, title: "Fly Catcher", category: "stencils", desc: "3-layer stencil found in Shoreditch alleys.", colors: ["#39ff14", "#1a1a1a"] },
  { id: 12, title: "Metamorphosis", category: "canvas", desc: "Triptych. Tadpole to frog to... something else entirely.", colors: ["#9b59b6", "#39ff14"], price: "£6,200" },
];

const shopItems = [
  { id: 101, title: "Croak & Dagger Print", edition: "Edition of 50 — 23 remaining", price: "£180", colors: ["#f0f0f0", "#1a1a1a"] },
  { id: 102, title: "The Pond Print", edition: "Edition of 100 — 67 remaining", price: "£95", colors: ["#3498db", "#39ff14"] },
  { id: 103, title: "Neon Swamp Original", edition: "1/1 Original", price: "£3,100", colors: ["#39ff14", "#9b59b6"] },
  { id: 104, title: "Kip Sticker Pack", edition: "Unlimited", price: "£12", colors: ["#39ff14", "#ff3366"] },
  { id: 105, title: "Tongue Out Tee", edition: "S / M / L / XL", price: "£35", colors: ["#ff3366", "#1a1a1a"] },
  { id: 106, title: "Ribbit Rebel Original", edition: "1/1 Original", price: "£4,500", colors: ["#ff3366", "#39ff14"] },
];

// --- Helpers ---
function createPlaceholderSVG(colors, title, w = 400, h = 400) {
  const [c1, c2] = colors;
  // Generate deterministic "art" from the title
  const seed = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const shapes = [];

  // Background
  shapes.push(`<rect width="${w}" height="${h}" fill="${c2}"/>`);

  // Random-ish shapes based on seed
  for (let i = 0; i < 5; i++) {
    const x = ((seed * (i + 1) * 13) % w);
    const y = ((seed * (i + 1) * 7) % h);
    const r = 20 + ((seed * (i + 1)) % 60);
    const opacity = 0.15 + ((i * 0.12) % 0.5);
    shapes.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${c1}" opacity="${opacity}"/>`);
  }

  // Drip effect
  for (let i = 0; i < 3; i++) {
    const x = ((seed * (i + 3) * 11) % w);
    const height = 50 + ((seed * (i + 2)) % 150);
    shapes.push(`<rect x="${x}" y="0" width="${3 + i}" height="${height}" fill="${c1}" opacity="0.1"/>`);
  }

  // Frog eyes hint
  const cx = w / 2;
  const cy = h / 2 - 20;
  shapes.push(`<circle cx="${cx - 25}" cy="${cy}" r="18" fill="none" stroke="${c1}" stroke-width="2" opacity="0.3"/>`);
  shapes.push(`<circle cx="${cx + 25}" cy="${cy}" r="18" fill="none" stroke="${c1}" stroke-width="2" opacity="0.3"/>`);
  shapes.push(`<circle cx="${cx - 25}" cy="${cy}" r="6" fill="${c1}" opacity="0.25"/>`);
  shapes.push(`<circle cx="${cx + 25}" cy="${cy}" r="6" fill="${c1}" opacity="0.25"/>`);

  // Title text
  shapes.push(`<text x="${w/2}" y="${h - 20}" text-anchor="middle" fill="${c1}" font-family="sans-serif" font-size="11" opacity="0.35">${title.toUpperCase()}</text>`);

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${shapes.join('')}</svg>`;
}

// --- Gallery ---
function renderGallery(filter = 'all') {
  const gallery = document.getElementById('gallery');
  const items = filter === 'all' ? artworks : artworks.filter(a => a.category === filter);

  gallery.innerHTML = items.map(art => `
    <div class="gallery-item fade-in" data-id="${art.id}" data-category="${art.category}">
      ${createPlaceholderSVG(art.colors, art.title)}
      <div class="overlay">
        <h3>${art.title}</h3>
        <p>${art.category}${art.price ? ' &bull; ' + art.price : ''}</p>
      </div>
    </div>
  `).join('');

  // Re-observe for fade-in
  observeElements();

  // Click handlers
  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const art = artworks.find(a => a.id === parseInt(item.dataset.id));
      openLightbox(art);
    });
  });
}

// --- Shop ---
function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = shopItems.map(item => `
    <div class="shop-card fade-in">
      <div class="shop-card-image">
        ${createPlaceholderSVG(item.colors, item.title)}
      </div>
      <div class="shop-card-info">
        <h3>${item.title}</h3>
        <p class="edition">${item.edition}</p>
        <p class="price">${item.price}</p>
        <button class="btn btn-secondary" onclick="addToCart(${item.id})">ADD TO CART</button>
      </div>
    </div>
  `).join('');

  observeElements();
}

// --- Cart (simple alert for now) ---
function addToCart(id) {
  const item = shopItems.find(i => i.id === id);
  alert(`"${item.title}" added to cart! (${item.price})\n\nFull cart functionality coming soon.`);
}

// --- Lightbox ---
function openLightbox(art) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-image').innerHTML = createPlaceholderSVG(art.colors, art.title, 600, 600);
  document.getElementById('lightbox-title').textContent = art.title;
  document.getElementById('lightbox-desc').textContent = art.desc;
  document.getElementById('lightbox-price').textContent = art.price || 'Not for sale';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// --- Filters ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });
});

// --- Mobile menu ---
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// --- Contact form ---
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  alert(`Thanks ${data.get('name')}! Your message has been sent.\n\n(Form submission backend not yet connected.)`);
  form.reset();
});

// --- Scroll fade-in ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function observeElements() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- Nav background on scroll ---
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(10,10,10,0.98)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.9)';
  }
});

// --- Init ---
renderGallery();
renderShop();
observeElements();
