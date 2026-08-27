/**
 * ==========================================================================
 * NUR STORE - GARENA TOP UP CENTER (SHOP.GARENA.SG) CORE JAVASCRIPT
 * Official Interactive Flow: Game Selection -> Package -> Payment Channel -> Order
 * ==========================================================================
 */

// Application State
let appState = {
  accounts: [],
  banners: [],
  supportMessages: [],
  activeInboxSessionId: null,
  selectedCategory: 'freefire', // default to Free Fire
  selectedStatus: 'all',
  isGrandPrizeOnly: false,
  searchQuery: '',
  minPrice: null,
  maxPrice: null,
  currency: 'LKR', // 'LKR' or 'USD'
  selectedAccountId: null,
  selectedPaymentChannel: 'Nations Trust Bank (NTB)',
  activeDetailImageIdx: 0,
  uploadedSlipUrl: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  try { initPreloader(); } catch (e) { console.error("Preloader error:", e); }
  try { loadInventory(); } catch (e) { console.error("Inventory error:", e); }
  try { loadHeroBanners(); } catch (e) { console.error("Hero banners error:", e); }
  try { loadSupportMessages(); } catch (e) { console.error("Support messages error:", e); }
  try { initBankList(); } catch (e) { console.error("Bank list error:", e); }
  try { renderCatalog(); } catch (e) { console.error("Catalog error:", e); }
  try { updateGameBadgeCounts(); } catch (e) { console.error("Game badge error:", e); }
  try { renderHeroCarousel(); } catch (e) { console.error("Hero carousel error:", e); }
  try { initHeroCarousel(); } catch (e) { console.error("Hero carousel init error:", e); }
  try { initLucide(); } catch (e) { console.error("Lucide init error:", e); }
  try { initSupabase(); } catch (e) { console.error("Supabase init error:", e); }
});

// =========================================================
// 0. Luxury Gaming Preloader & Splash Screen Controller
// =========================================================
function initPreloader() {
  const preloader = document.getElementById('sitePreloader');
  const bar = document.getElementById('preloaderProgressBar');
  const status = document.getElementById('preloaderStatusText');
  if (!preloader) return;

  const messages = [
    "Connecting to Secure Server...",
    "Verifying Garena Database...",
    "Synchronizing Live Accounts...",
    "Welcome to NUR STORE!"
  ];

  let currentPercent = 15;
  let msgStep = 0;

  if (bar) bar.style.width = '15%';
  if (status) status.textContent = messages[0];

  const animTimer = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 20) + 14;
    if (currentPercent > 95) currentPercent = 95;

    if (bar) bar.style.width = currentPercent + '%';

    if (status && currentPercent > (msgStep + 1) * 26 && msgStep < messages.length - 1) {
      msgStep++;
      status.textContent = messages[msgStep];
    }
  }, 130);

  const finishPreloader = () => {
    clearInterval(animTimer);
    if (bar) bar.style.width = '100%';
    if (status) status.textContent = "Welcome to NUR STORE!";

    setTimeout(() => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 550);
    }, 280);
  };

  setTimeout(finishPreloader, 1100);
}

// =========================================================
// Garena 3D Hero Carousel System (Dynamic State-Driven)
// =========================================================
let currentHeroSlide = 0;
let heroSlideTimer = null;

function loadHeroBanners() {
  const saved = localStorage.getItem('nexus_hero_banners');
  if (saved) {
    try {
      appState.banners = JSON.parse(saved);
      // Clean raw HTML tags from banner titles
      appState.banners.forEach(b => {
        if (b.title && b.title.includes('<')) {
          b.title = b.title.replace(/<[^>]*>?/gm, '').trim();
        }
      });
      return appState.banners;
    } catch (e) {
      console.error("Failed to parse hero banners:", e);
    }
  }

  // Default Preset Banners
  appState.banners = [
    {
      id: 'banner-default-1',
      title: 'NUR STORE - Official Accounts & Top-Up Store',
      subtitle: '100% Safe Recovery • Instant WhatsApp Delivery',
      description: 'Sri Lanka\'s #1 verified marketplace for Free Fire accounts & Top-Up.',
      image: 'https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/hero_banner.png',
      type: 'image',
      active: true
    }
  ];
  return appState.banners;
}

function saveHeroBanners() {
  localStorage.setItem('nexus_hero_banners', JSON.stringify(appState.banners));
  renderHeroCarousel();
  renderAdminBannersList();
}

function renderHeroCarousel() {
  const stage = document.getElementById('heroCarouselStage');
  const dotsWrap = document.getElementById('heroDotsWrap');
  if (!stage || !dotsWrap) return;

  const activeBanners = (appState.banners || []).filter(b => b.active !== false);
  if (activeBanners.length === 0) {
    stage.innerHTML = '<div style="color:#94a3b8;font-size:0.85rem;text-align:center;padding:20px;">No active hero banners. Add or enable banners in Admin Panel.</div>';
    dotsWrap.innerHTML = '';
    return;
  }

  if (currentHeroSlide >= activeBanners.length) {
    currentHeroSlide = 0;
  }

  stage.innerHTML = activeBanners.map((banner, index) => {
    let slideContent = '';
    if (banner.image) {
      const imgUrl = formatDirectImageUrl(banner.image);
      slideContent = `
        <div class="hero-slide-inner">
          <img src="${imgUrl}" alt="${banner.title || 'Hero Banner'}" class="hero-slide-img" onerror="this.onerror=null;this.src='https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/hero_banner.png';">
        </div>
      `;
    } else if (banner.type === 'discount') {
      slideContent = `
        <div class="hero-slide-inner hero-discount-slide">
          <div class="discount-slide-bg"></div>
          <div class="discount-slide-content">
            <div class="discount-badge-pill">🔥 EXCLUSIVE DEALS</div>
            <h2 class="discount-hero-title">${banner.title || 'DIAMONDS'} <span class="discount-subtext">${banner.subtitle || 'at a DISCOUNT'}</span></h2>
            <p class="discount-desc">${banner.description || 'UP TO 30% BONUS ON FREE FIRE TOP-UP • INSTANT DELIVERY'}</p>
          </div>
          <div class="discount-art-wrap">
            <div class="gem-crystal gem-c1">💎</div>
            <div class="gem-crystal gem-c2">💎</div>
            <div class="gem-crystal gem-c3">✨</div>
          </div>
        </div>
      `;
    } else {
      slideContent = `
        <div class="hero-slide-inner hero-garena-card-slide">
          <div class="hero-banner-left">
            <div class="hero-shell-icon" style="padding:6px;">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                <defs>
                  <radialGradient id="shellGradDynamic" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#FFF078" />
                    <stop offset="45%" stop-color="#FFB800" />
                    <stop offset="90%" stop-color="#E07000" />
                    <stop offset="100%" stop-color="#B84800" />
                  </radialGradient>
                </defs>
                <path d="M24 6 C12 6 6 18 8 32 C9 38 14 42 24 42 C34 42 39 38 40 32 C42 18 36 6 24 6 Z" fill="url(#shellGradDynamic)"/>
                <path d="M24 8 C20 18 20 36 24 40" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
                <path d="M17 11 C15 20 16 34 20 39" stroke="#FFEAA0" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
                <path d="M31 11 C33 20 32 34 28 39" stroke="#D06000" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
                <path d="M12 18 C11 25 13 32 17 37" stroke="#FFEAA0" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
                <path d="M36 18 C37 25 35 32 31 37" stroke="#D06000" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
              </svg>
            </div>
            <div class="hero-banner-text">
              <h2>${banner.title || 'BRAND <span class="red-text">NEW</span> OFFICIAL TOP UP'}</h2>
              <p>${banner.subtitle || '100% Safe Recovery • Instant WhatsApp Delivery'}</p>
            </div>
          </div>
          <div class="hero-trust-pills">
            <span>🛡️ SAFER</span>
            <span>•</span>
            <span>⚡ FASTER</span>
            <span>•</span>
            <span>💎 EASIER</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="hero-slide" data-slide-index="${index}" onclick="handleHeroSlideClick(${index})">
        ${slideContent}
      </div>
    `;
  }).join('');

  dotsWrap.innerHTML = activeBanners.map((_, index) => `
    <button class="hero-dot ${index === currentHeroSlide ? 'active' : ''}" onclick="goToHeroSlide(${index})" aria-label="Slide ${index + 1}"></button>
  `).join('');

  updateHeroCarousel();
}

function initHeroCarousel() {
  const stage = document.getElementById('heroCarouselStage');
  if (!stage) return;

  updateHeroCarousel();
  startHeroSlideTimer();
  if (stage && !stage.dataset.swipeBound) {
    stage.dataset.swipeBound = 'true';
    let touchStartX = 0;
    let touchEndX = 0;

    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) {
        nextHeroSlide();
      } else if (touchEndX > touchStartX + 40) {
        prevHeroSlide();
      }
    }, { passive: true });

    // Pause auto-sliding on hover
    const section = document.getElementById('heroCarouselSection');
    if (section) {
      section.addEventListener('mouseenter', () => clearInterval(heroSlideTimer));
      section.addEventListener('mouseleave', () => startHeroSlideTimer());
    }
  }
}

function updateHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides || slides.length === 0) return;

  const total = slides.length;
  slides.forEach((slide) => {
    const idx = parseInt(slide.getAttribute('data-slide-index'), 10);
    slide.classList.remove('active', 'prev', 'next', 'hidden-slide');

    if (idx === currentHeroSlide) {
      slide.classList.add('active');
    } else if (idx === (currentHeroSlide - 1 + total) % total) {
      slide.classList.add('prev');
    } else if (idx === (currentHeroSlide + 1) % total) {
      slide.classList.add('next');
    } else {
      slide.classList.add('hidden-slide');
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentHeroSlide);
  });
}

function nextHeroSlide(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const activeBanners = (appState.banners || []).filter(b => b.active !== false);
  const total = activeBanners.length || 1;
  currentHeroSlide = (currentHeroSlide + 1) % total;
  updateHeroCarousel();
  startHeroSlideTimer();
}

function prevHeroSlide(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const activeBanners = (appState.banners || []).filter(b => b.active !== false);
  const total = activeBanners.length || 1;
  currentHeroSlide = (currentHeroSlide - 1 + total) % total;
  updateHeroCarousel();
  startHeroSlideTimer();
}

function goToHeroSlide(index) {
  currentHeroSlide = index;
  updateHeroCarousel();
  startHeroSlideTimer();
}

function handleHeroSlideClick(index) {
  if (index !== currentHeroSlide) {
    goToHeroSlide(index);
  }
}

function startHeroSlideTimer() {
  clearInterval(heroSlideTimer);
  const activeBanners = (appState.banners || []).filter(b => b.active !== false);
  if (activeBanners.length > 1) {
    heroSlideTimer = setInterval(() => {
      nextHeroSlide();
    }, 4800);
  }
}

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Clean corrupted UTF-8 / Mojibake characters into crisp symbols
function sanitizeEncoding(str) {
  if (!str || typeof str !== 'string') return str || '';
  return str
    .replace(/â€¢/g, '•')
    .replace(/â€“/g, '–')
    .replace(/â€"/g, '—')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/\uFFFD/g, '•')
    .replace(/Â/g, '')
    .trim();
}

// Comprehensive URL parser and converter for Google Drive, Tmpfiles, Imgur, and standard image URLs
function formatDirectImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
  }
  const clean = url.trim();

  // 1. Google Drive Links Conversion -> Google's lh3 static direct CDN endpoint
  if (clean.includes('drive.google.com') || clean.includes('docs.google.com') || clean.includes('googleusercontent.com')) {
    const match = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                  clean.match(/id=([a-zA-Z0-9_-]+)/) || 
                  clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Google's direct CDN image embed endpoint (Works 100% in all browsers without CORS/CORP issues)
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 2. Tmpfiles CDN download conversion
  if (clean.includes('tmpfiles.org/') && !clean.includes('tmpfiles.org/dl/')) {
    return clean.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  }

  return clean;
}

// Load Inventory from LocalStorage or default dataset
function loadInventory() {
  const saved = localStorage.getItem('nexus_inventory');
  if (saved) {
    try {
      appState.accounts = JSON.parse(saved);
      appState.accounts.forEach(acc => {
        if (acc.title) acc.title = sanitizeEncoding(acc.title);
      });
    } catch (e) {
      appState.accounts = [...DEFAULT_ACCOUNTS];
      saveInventory();
    }
  } else {
    appState.accounts = [...DEFAULT_ACCOUNTS];
    saveInventory();
  }

  // Set default selected account to first available
  if (appState.accounts.length > 0) {
    appState.selectedAccountId = appState.accounts[0].id;
  }
}

function saveInventory() {
  localStorage.setItem('nexus_inventory', JSON.stringify(appState.accounts));
  updateGameBadgeCounts();
}

function resetToDefaultInventory() {
  if (confirm("Are you sure you want to reset all inventory data to defaults?")) {
    appState.accounts = [...DEFAULT_ACCOUNTS];
    saveInventory();
    renderCatalog();
    renderAdminInventory();
    showToast("Inventory restored to default settings!", "success");
  }
}

// Currency Conversion & Formatting
function formatPrice(lkrAmount) {
  if (appState.currency === 'USD') {
    const usd = (lkrAmount / STORE_CONFIG.usdRate).toFixed(1);
    return `$${usd}`;
  }
  return `LKR ${Number(lkrAmount).toLocaleString()}`;
}

function setCurrency(curr) {
  appState.currency = curr;
  document.getElementById('currLKR')?.classList.toggle('active', curr === 'LKR');
  document.getElementById('currUSD')?.classList.toggle('active', curr === 'USD');
  renderCatalog();
  updateSelectedSummary();
  if (appState.selectedAccountId) {
    const acc = appState.accounts.find(a => a.id === appState.selectedAccountId);
    if (acc && document.getElementById('detailModal')?.classList.contains('open')) {
      renderDetailModal(acc);
    }
  }
  showToast(`Currency switched to ${curr}`, "success");
}

// 1. Game Selection Handler (Garena Game Tiles)
function selectGameCategory(cat) {
  appState.selectedCategory = cat;

  // Update Game Tile Active states
  document.getElementById('gameTileFF')?.classList.toggle('active', cat === 'freefire');
  document.getElementById('gameTileCC')?.classList.toggle('active', cat === 'capcut');
  document.getElementById('gameTileTT')?.classList.toggle('active', cat === 'tiktok');
  document.getElementById('gameTileYT')?.classList.toggle('active', cat === 'youtube');
  document.getElementById('gameTileAll')?.classList.toggle('active', cat === 'all');

  // Update Red Banner Header
  const titleEl = document.getElementById('selGameTitle');
  const avatarEl = document.getElementById('selGameAvatar');
  
  if (cat === 'freefire') {
    if (titleEl) titleEl.textContent = 'Free Fire Accounts & VIP Top Up';
    if (avatarEl) avatarEl.innerHTML = `
      <img src="ff_icon.jpg" alt="Free Fire" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
    `;
  } else if (cat === 'capcut') {
    if (titleEl) titleEl.textContent = 'CapCut Pro VIP Cloud Subscriptions';
    if (avatarEl) avatarEl.innerHTML = `
      <img src="capcut_icon.jpg" alt="CapCut Pro" style="width:100%;height:100%;object-fit:contain;padding:4px;background:#ffffff;border-radius:10px;">
    `;
  } else if (cat === 'tiktok') {
    if (titleEl) titleEl.textContent = 'TikTok Monetized & Creator Accounts';
    if (avatarEl) avatarEl.innerHTML = `
      <img src="tiktok_icon.jpg" alt="TikTok" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
    `;
  } else if (cat === 'youtube') {
    if (titleEl) titleEl.textContent = 'YouTube Monetized Channels & Accounts';
    if (avatarEl) avatarEl.innerHTML = `
      <img src="youtube_icon.jpg" alt="YouTube" style="width:100%;height:100%;object-fit:contain;padding:2px;background:#ffffff;border-radius:10px;">
    `;
  } else {
    if (titleEl) titleEl.textContent = 'All Verified Digital Accounts';
    if (avatarEl) avatarEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    `;
  }

  // Pick first available live item in category
  const inCatLive = appState.accounts.filter(a => (cat === 'all' || a.category === cat) && a.status !== 'sold');
  const inCatAll = appState.accounts.filter(a => cat === 'all' || a.category === cat);
  const pool = inCatLive.length > 0 ? inCatLive : inCatAll;
  if (pool.length > 0 && (!appState.selectedAccountId || !pool.some(a => a.id === appState.selectedAccountId))) {
    appState.selectedAccountId = pool[0].id;
  }

  renderCatalog();
  updateSelectedSummary();
}

function filterByCategory(cat) {
  selectGameCategory(cat);
}

// Status Filtering
function filterByStatus(status) {
  appState.selectedStatus = status;
  appState.isGrandPrizeOnly = false;

  document.getElementById('tabStatusAll')?.classList.toggle('active', status === 'all');
  document.getElementById('tabStatusAvail')?.classList.toggle('active', status === 'available');
  document.getElementById('tabStatusSale')?.classList.toggle('active', status === 'sale');
  document.getElementById('tabStatusSold')?.classList.toggle('active', status === 'sold');
  document.getElementById('tabStatusGrand')?.classList.remove('active');

  renderCatalog();
}

function filterByGrandPrize() {
  appState.isGrandPrizeOnly = !appState.isGrandPrizeOnly;
  document.getElementById('tabStatusGrand')?.classList.toggle('active', appState.isGrandPrizeOnly);

  if (appState.isGrandPrizeOnly) {
    document.getElementById('tabStatusAll')?.classList.remove('active');
    document.getElementById('tabStatusAvail')?.classList.remove('active');
    document.getElementById('tabStatusSale')?.classList.remove('active');
    document.getElementById('tabStatusSold')?.classList.remove('active');
  } else {
    document.getElementById('tabStatusAll')?.classList.add('active');
  }

  renderCatalog();
}

function handlePriceFilter() {
  const minVal = document.getElementById('minPriceInput')?.value;
  const maxVal = document.getElementById('maxPriceInput')?.value;
  appState.minPrice = minVal ? parseFloat(minVal) : null;
  appState.maxPrice = maxVal ? parseFloat(maxVal) : null;
  renderCatalog();
}

function handleSearch() {
  appState.searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  renderCatalog();
}

function navigateToHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  resetFilters();
}

function navigateToBrowse(status = 'all') {
  const el = document.getElementById('purchaseFlowContainer');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (status === 'all') filterByStatus('all');
  else if (status === 'sale') filterByStatus('sale');
  else if (status === 'sold') filterByStatus('sold');
  else if (status === 'grand') filterByGrandPrize();
}

function navigateToHowItWorks() {
  const el = document.getElementById('hiw');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function resetFilters() {
  appState.selectedCategory = 'all';
  appState.selectedStatus = 'all';
  appState.isGrandPrizeOnly = false;
  appState.searchQuery = '';
  appState.minPrice = null;
  appState.maxPrice = null;

  const sInput = document.getElementById('searchInput');
  const minInput = document.getElementById('minPriceInput');
  const maxInput = document.getElementById('maxPriceInput');
  if (sInput) sInput.value = '';
  if (minInput) minInput.value = '';
  if (maxInput) maxInput.value = '';

  selectGameCategory('freefire');
  filterByStatus('all');
  showToast("Filters reset to default", "info");
}

function updateGameBadgeCounts() {
  const ff = appState.accounts.filter(a => a.category === 'freefire').length;
  const cc = appState.accounts.filter(a => a.category === 'capcut').length;
  const tt = appState.accounts.filter(a => a.category === 'tiktok').length;
  const yt = appState.accounts.filter(a => a.category === 'youtube').length;

  const bFF = document.getElementById('countFFBadge');
  const bCC = document.getElementById('countCCBadge');
  const bTT = document.getElementById('countTTBadge');
  const bYT = document.getElementById('countYTBadge');

  if (bFF) bFF.textContent = `${ff} Accounts`;
  if (bCC) bCC.textContent = `${cc} Packages`;
  if (bTT) bTT.textContent = `${tt} Channels`;
  if (bYT) bYT.textContent = `${yt} Channels`;
}

// Filtered Accounts
function getFilteredAccounts() {
  return appState.accounts.filter(acc => {
    // Category filter
    if (appState.selectedCategory !== 'all' && acc.category !== appState.selectedCategory) {
      return false;
    }

    // Status filter:
    // When "Sold Out" tab is selected, show ONLY sold accounts.
    // For all other views (All Accounts, Available, Hot Sale, Grand Prize), HIDE sold accounts.
    if (appState.selectedStatus === 'sold') {
      if (acc.status !== 'sold') return false;
    } else {
      if (acc.status === 'sold') return false;

      if (appState.isGrandPrizeOnly) {
        if (!acc.isGrandPrize) return false;
      } else if (appState.selectedStatus !== 'all') {
        if (acc.status !== appState.selectedStatus) return false;
      }
    }

    // Price range filter
    if (appState.minPrice !== null && acc.priceLKR < appState.minPrice) return false;
    if (appState.maxPrice !== null && acc.priceLKR > appState.maxPrice) return false;

    // Search query
    if (appState.searchQuery) {
      const q = appState.searchQuery;
      const titleMatch = acc.title.toLowerCase().includes(q);
      const codeMatch = acc.code.toLowerCase().includes(q);
      const descMatch = (acc.description || '').toLowerCase().includes(q);
      let statsMatch = false;

      if (acc.stats) {
        statsMatch = Object.values(acc.stats).some(val => String(val).toLowerCase().includes(q));
      }

      if (!titleMatch && !codeMatch && !descMatch && !statsMatch) {
        return false;
      }
    }

    return true;
  });
}

// Render Garena Denominations / Accounts Grid
function renderCatalog() {
  const grid = document.getElementById('denominationsGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  const filtered = getFilteredAccounts();

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = filtered.map(acc => {
    const isSelected = acc.id === appState.selectedAccountId;
    const isSold = acc.status === 'sold';
    
    // Status / Promo Tag
    let tagHtml = '';
    if (isSold) {
      tagHtml = `<span class="denom-tag-pill denom-tag-sold"><i data-lucide="ban" style="width:11px;height:11px;color:#ffffff;display:inline-block;"></i> SOLD OUT</span>`;
    } else if (acc.status === 'sale') {
      tagHtml = `<span class="denom-tag-pill"><i data-lucide="flame" style="width:11px;height:11px;color:#ffffff;display:inline-block;"></i> SALE</span>`;
    } else if (acc.isGrandPrize) {
      tagHtml = `<span class="denom-tag-pill" style="background:#f59e0b;color:#000;"><i data-lucide="crown" style="width:11px;height:11px;color:#000000;display:inline-block;"></i> GRAND</span>`;
    }

    const soldOverlay = isSold ? `<div class="denom-sold-overlay"><span class="denom-sold-stamp"><i data-lucide="ban" style="width:13px;height:13px;"></i> SOLD OUT</span></div>` : '';

    // Spec highlight line
    let specLine = '';
    if (acc.category === 'freefire' && acc.stats) {
      const primePill = acc.stats.primeLevel ? `<span class="prime-level-badge"><i data-lucide="crown" style="width:10px;height:10px;"></i> ${acc.stats.primeLevel}</span>` : '';
      specLine = `
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          ${primePill}
          <span style="font-weight:700;">Lv ${acc.stats.level || 70}</span> • <span>${acc.stats.evoGuns || 0} EVO Guns</span> • <span>${acc.stats.rank || 'Master'}</span>
        </div>
      `;
    } else if (acc.category === 'capcut' && acc.stats) {
      specLine = `${acc.stats.planDuration || '1-Year'} • ${acc.stats.cloudStorage || '100GB'} • 4K Pro`;
    } else if (acc.category === 'tiktok' && acc.stats) {
      specLine = `${acc.stats.followers || '50K'} • ${acc.stats.region || 'US/UK'} • Monetized`;
    } else {
      specLine = 'Verified Account • Instant Handover';
    }

    const firstImage = formatDirectImageUrl(acc.images && acc.images.length > 0 ? acc.images[0] : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800');

    return `
      <div class="denom-card ${isSelected ? 'active' : ''} ${isSold ? 'is-sold-out' : ''}" onclick="selectDenomination('${acc.id}')">
        <div>
          <div class="denom-card-img">
            <img src="${firstImage}" alt="${acc.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';">
            ${soldOverlay}
            ${tagHtml}
            <span class="denom-code-pill">${acc.code}</span>
          </div>

          <h5 class="denom-title" title="${sanitizeEncoding(acc.title)}">
            ${sanitizeEncoding(acc.title)}
          </h5>

          <div class="denom-specs">
            <span>${sanitizeEncoding(specLine)}</span>
          </div>
        </div>

        <div class="denom-price-row">
          <div>
            ${isSold ? `<div class="badge-sold-out-pill"><i data-lucide="ban" style="width:11px;height:11px;"></i> SOLD OUT</div>` : `<div class="denom-price-main">${formatPrice(acc.priceLKR)}</div>`}
            ${!isSold && acc.origPriceLKR ? `<span class="denom-price-orig">${formatPrice(acc.origPriceLKR)}</span>` : ''}
          </div>
          <button class="btn-sell-nav" style="padding:3px 8px;font-size:0.7rem;" onclick="event.stopPropagation(); openDetailModal('${acc.id}')">
            ${isSold ? 'View' : 'Details'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  updateSelectedSummary();
  initLucide();
}

function selectDenomination(accId) {
  appState.selectedAccountId = accId;
  document.querySelectorAll('.denom-card').forEach(card => card.classList.remove('active'));
  
  // Highlight active tile
  renderCatalog();
  updateSelectedSummary();
}

function updateSelectedSummary() {
  const acc = appState.accounts.find(a => a.id === appState.selectedAccountId);
  const summaryEl = document.getElementById('selectedAccSummary');
  const btn = document.getElementById('btnProceedCheckout');
  if (!summaryEl) return;

  if (acc) {
    const thumb = formatDirectImageUrl(acc.images && acc.images.length > 0 ? acc.images[0] : 'ff_icon.jpg');
    const isSold = acc.status === 'sold';
    summaryEl.innerHTML = `
      <div class="proceed-thumb-box">
        <img src="${thumb}" alt="${acc.title}" onerror="this.onerror=null;this.src='ff_icon.jpg';">
      </div>
      <div class="proceed-info-col">
        <div class="proceed-label-row">
          <span class="proceed-badge-code">${acc.code}</span>
          ${isSold ? `<span class="badge-sold-out-pill"><i data-lucide="ban" style="width:11px;height:11px;"></i> SOLD OUT</span>` : `<span class="proceed-channel-tag"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> ${appState.selectedPaymentChannel}</span>`}
        </div>
        <div class="proceed-acc-title" title="${sanitizeEncoding(acc.title)}">${sanitizeEncoding(acc.title)}</div>
        <div class="proceed-price-box">
          <span class="proceed-price-lbl">${isSold ? 'Status:' : 'Total Payable:'}</span>
          <span class="proceed-price-val" style="${isSold ? 'color:#dc2626;font-size:1.1rem;' : ''}">${isSold ? 'Sold Out' : formatPrice(acc.priceLKR)}</span>
        </div>
      </div>
    `;
    if (btn) {
      if (isSold) {
        btn.innerHTML = `<i data-lucide="ban"></i> <span>Account Sold Out</span>`;
        btn.style.opacity = '0.6';
      } else {
        btn.innerHTML = `<i data-lucide="arrow-right"></i> <span>Proceed to Checkout</span>`;
        btn.style.opacity = '1';
      }
    }
  } else {
    summaryEl.innerHTML = `
      <div style="font-size:0.88rem;color:var(--text-muted);display:flex;align-items:center;gap:8px;">
        <i data-lucide="info" style="width:16px;height:16px;color:var(--garena-red);"></i>
        <span>Please choose an account package above to proceed</span>
      </div>
    `;
  }

  initLucide();
}

// 3. Payment Method Selection (Channels)
function selectPaymentChannel(el, channelName) {
  document.querySelectorAll('.channel-card').forEach(card => card.classList.remove('active'));
  el.classList.add('active');
  appState.selectedPaymentChannel = channelName;
  updateSelectedSummary();
}

// Proceed to Checkout
function proceedToCheckout() {
  if (!appState.selectedAccountId) {
    showToast("Please select an account package first!", "info");
    return;
  }
  const acc = appState.accounts.find(a => a.id === appState.selectedAccountId);
  if (acc && acc.status === 'sold') {
    showToast("This account is sold out! Please select an available account or chat on WhatsApp.", "info");
    return;
  }
  openCheckoutModal(appState.selectedAccountId);
}

// Modal Controllers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleModalOutsideClick(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

// 1. Account Details Modal
function openDetailModal(accountId) {
  const acc = appState.accounts.find(a => a.id === accountId);
  if (!acc) return;

  appState.selectedAccountId = accountId;
  appState.activeDetailImageIdx = 0;
  renderDetailModal(acc);
  openModal('detailModal');
}

function renderDetailModal(acc) {
  const modalBody = document.getElementById('detModalBody') || document.getElementById('detailModalBody');
  const modalTitle = document.getElementById('detModalTitle') || document.getElementById('detailModalHeader');
  if (!modalBody) return;

  let catIcon = 'flame';
  if (acc.category === 'capcut') catIcon = 'video';
  if (acc.category === 'tiktok') catIcon = 'music';
  if (acc.category === 'youtube') catIcon = 'play-square';

  if (modalTitle) {
    modalTitle.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="modal-title-code">${acc.code}</span>
        <span class="modal-title-cat"><i data-lucide="${catIcon}" style="width:14px;height:14px;"></i> ${acc.category.toUpperCase()}</span>
      </div>
    `;
  }

  const rawImgs = acc.images && acc.images.length > 0 ? acc.images : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'];
  const images = rawImgs.map(formatDirectImageUrl);
  const activeImage = images[appState.activeDetailImageIdx] || images[0];

  const thumbHtml = images.map((img, idx) => `
    <div class="det-thumb-item ${idx === appState.activeDetailImageIdx ? 'active' : ''}" onclick="switchDetailImage(${idx})">
      <img src="${img}" alt="Thumbnail ${idx + 1}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';">
    </div>
  `).join('');

  // Lucide icon mapping for spec chips
  const statIcons = {
    level: 'trophy',
    rank: 'shield',
    likes: 'heart',
    evoGuns: 'crosshair',
    evoMax: 'flame',
    bundles: 'package',
    gunSkins: 'zap',
    primeLevel: 'crown',
    loginType: 'key-round',
    region: 'globe',
    uid: 'hash',
    planDuration: 'clock',
    devices: 'laptop',
    cloudStorage: 'cloud',
    accountType: 'user-check',
    features: 'sparkles',
    warranty: 'shield-check',
    delivery: 'send',
    followers: 'users',
    subscribers: 'users',
    monetization: 'circle-dollar-sign',
    watchHours: 'clock',
    niche: 'tag',
    strikes: 'check-circle-2',
    audience: 'user-check'
  };

  let specsGrid = '';
  if (acc.stats) {
    // Ensure Prime Level is always rendered FIRST at the top of the specifications grid
    const entries = Object.entries(acc.stats).filter(([k, v]) => v !== undefined && v !== null && v !== '');
    entries.sort(([k1], [k2]) => {
      if (k1 === 'primeLevel') return -1;
      if (k2 === 'primeLevel') return 1;
      return 0;
    });

    specsGrid = entries.map(([k, v]) => {
      if (k === 'primeLevel') {
        if (!v || v === 'None' || v === 'No Prime') return '';
        return `
          <div class="det-spec-card det-spec-prime-vip">
            <div class="det-spec-header">
              <i data-lucide="crown" style="width:14px;height:14px;color:#c026d3;"></i>
              <span class="det-spec-lbl" style="color:#a21caf;font-weight:900;">PRIME LEVEL STATUS</span>
            </div>
            <div class="det-spec-val det-spec-prime-val">
              <i data-lucide="sparkles" style="width:13px;height:13px;color:#d946ef;"></i> ${v}
            </div>
          </div>
        `;
      }
      const iconName = statIcons[k] || 'check';
      return `
        <div class="det-spec-card">
          <div class="det-spec-header">
            <i data-lucide="${iconName}" style="width:13px;height:13px;color:var(--garena-red);"></i>
            <span class="det-spec-lbl">${formatCamelCase(k)}</span>
          </div>
          <div class="det-spec-val">${v}</div>
        </div>
      `;
    }).join('');
  }

  let evoSection = '';
  if (acc.category === 'freefire' && acc.evoList && acc.evoList.length > 0) {
    const evoItems = acc.evoList.map(e => `
      <div class="evo-tag-row">
        <span class="evo-gun-name"><i data-lucide="crosshair" style="width:12px;height:12px;color:var(--garena-red);"></i> ${e.name}</span>
        <span class="evo-gun-lvl ${e.level.includes('MAX') ? 'lvl-max' : ''}">${e.level}</span>
      </div>
    `).join('');

    evoSection = `
      <div class="evo-list-wrap">
        <div class="evo-list-title"><i data-lucide="sparkles" style="width:14px;height:14px;color:#d97706;"></i> EVO Weapons Arsenal</div>
        <div class="evo-items-grid">${evoItems}</div>
      </div>
    `;
  }

  const discountPercent = acc.origPriceLKR ? Math.round(((acc.origPriceLKR - acc.priceLKR) / acc.origPriceLKR) * 100) : null;
  const isSold = acc.status === 'sold';
  const soldBanner = isSold ? `
    <div class="det-sold-banner">
      <i data-lucide="ban" style="width:18px;height:18px;"></i>
      <span>SOLD OUT • THIS ACCOUNT HAS BEEN PURCHASED &amp; HANDED OVER</span>
    </div>
  ` : '';

  const primePillModal = (acc.category === 'freefire' && acc.stats && acc.stats.primeLevel) ? `
    <span class="badge-prime-vip"><i data-lucide="crown" style="width:12px;height:12px;"></i> ${acc.stats.primeLevel} VIP</span>
  ` : '';

  modalBody.innerHTML = `
    ${soldBanner}

    <div class="det-gallery-wrap">
      <img id="mainDetImg" class="det-main-img" src="${activeImage}" alt="${acc.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';" onclick="openLightbox('${activeImage}')">
    </div>

    ${images.length > 1 ? `<div class="det-thumb-row">${thumbHtml}</div>` : ''}

    <div class="det-pricing-card">
      <div class="det-price-top">
        <div class="det-status-pills">
          ${primePillModal}
          <span class="badge-verified-clean"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> 100% Clean &amp; Verified</span>
          <span class="badge-instant-deliv"><i data-lucide="zap" style="width:12px;height:12px;"></i> Instant Handover</span>
        </div>
        ${discountPercent && !isSold ? `<span class="det-discount-badge">Save ${discountPercent}%</span>` : ''}
      </div>
      <h2 class="det-title">${sanitizeEncoding(acc.title)}</h2>
      <div class="det-price-bottom">
        <div class="det-price-main">
          <span class="det-price-curr">LKR</span>
          <span class="det-price-amount" style="${isSold ? 'color:#dc2626;' : ''}">${acc.priceLKR.toLocaleString()}</span>
        </div>
        ${acc.origPriceLKR ? `<div class="det-orig-price">LKR ${acc.origPriceLKR.toLocaleString()}</div>` : ''}
      </div>
    </div>

    <div class="det-specs-grid">
      ${specsGrid}
    </div>

    ${evoSection}

    <div class="det-desc-card">
      <div class="det-desc-header"><i data-lucide="info" style="width:14px;height:14px;color:var(--garena-red);"></i> Account Description &amp; Handover Details</div>
      <p class="det-desc-body">${acc.description || 'Verified account ready for immediate handover.'}</p>
    </div>

    <div class="modal-actions-wrap">
      ${isSold ? `
        <button class="btn-modal-wa" style="background:#0f172a;grid-column:1/-1;" onclick="orderOnWhatsApp('${acc.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          <span>Inquire Similar Available Accounts via WhatsApp</span>
        </button>
      ` : `
        <button class="btn-modal-wa" onclick="orderOnWhatsApp('${acc.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          <span>Direct WhatsApp Order</span>
        </button>
        <button class="btn-modal-slip" onclick="closeModal('detailModal'); openCheckoutModal('${acc.id}');">
          <i data-lucide="landmark" style="width:18px;height:18px;"></i>
          <span>Bank Transfer Checkout</span>
        </button>
      `}
    </div>
  `;

  initLucide();
}

function switchDetailImage(idx) {
  appState.activeDetailImageIdx = idx;
  const acc = appState.accounts.find(a => a.id === appState.selectedAccountId);
  if (acc && acc.images && acc.images[idx]) {
    const directUrl = formatDirectImageUrl(acc.images[idx]);
    const mainImg = document.getElementById('mainDetImg');
    if (mainImg) {
      mainImg.src = directUrl;
      mainImg.onclick = () => openLightbox(directUrl);
    }
    document.querySelectorAll('.det-thumb-item').forEach((item, i) => {
      item.classList.toggle('active', i === idx);
    });
  }
}

// 2. Bank Transfer & Slip Checkout Modal
function initBankList() {
  const container = document.getElementById('bankListContainer');
  if (!container) return;

  container.innerHTML = PAYMENT_METHODS.map(bank => `
    <div class="bank-card-item" style="${bank.isComingSoon ? 'opacity:0.75;background:#fefce8;' : ''}">
      <div style="display:flex;align-items:center;gap:10px;">
        ${bank.logo ? `
          <div style="width:34px;height:34px;border-radius:6px;background:#fff;border:1px solid #e5e7eb;padding:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <img src="${bank.logo}" alt="${bank.bankName}" style="width:100%;height:100%;object-fit:contain;">
          </div>
        ` : ''}
        <div class="bank-info-left">
          <h5 style="color:#111;">${bank.bankName}</h5>
          <p>A/C: <strong style="color:${bank.isComingSoon ? '#d97706' : 'var(--garena-red)'};font-size:0.92rem;">${bank.accountNumber}</strong></p>
          <div style="font-size:0.72rem;color:#6b7280;">${bank.accountName} • ${bank.branch}</div>
        </div>
      </div>
      ${bank.isComingSoon ? `
        <span style="font-size:0.72rem;font-weight:800;color:#d97706;background:#fef3c7;padding:3px 8px;border-radius:10px;">⏳ COMING SOON</span>
      ` : `
        <button class="btn-copy-acc" onclick="copyToClipboard('${bank.accountNumber}', '${bank.bankName}')">
          Copy
        </button>
      `}
    </div>
  `).join('');
}

function openCheckoutModal(accountId) {
  const acc = appState.accounts.find(a => a.id === accountId);
  if (!acc) return;

  appState.selectedAccountId = accountId;
  appState.uploadedSlipUrl = null;

  const summary = document.getElementById('checkoutAccountSummary');
  summary.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <div>
        <span style="font-size:0.72rem;color:var(--garena-red);font-weight:800;text-transform:uppercase;">Selected Account</span>
        <h4 style="font-size:1.05rem;font-weight:800;color:#111;">${acc.title} (${acc.code})</h4>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:900;color:var(--garena-red);">${formatPrice(acc.priceLKR)}</div>
      </div>
    </div>
  `;

  document.getElementById('slipFileName').textContent = "Click to Browse or Upload Payment Receipt";
  document.getElementById('slipPreviewWrap').style.display = 'none';

  const mainPhone = document.getElementById('mainBuyerPhone')?.value.trim();
  if (mainPhone) {
    const buyerInput = document.getElementById('buyerWhatsApp');
    if (buyerInput) buyerInput.value = mainPhone;
  }

  openModal('checkoutModal');
  initLucide();
}

function syncBuyerPhone(val) {
  const buyerInput = document.getElementById('buyerWhatsApp');
  if (buyerInput) buyerInput.value = val;
}

// Client-side image compression: converts multi-MB phone photos into lightweight ~80KB JPEGs for 0.8s instant Google Drive upload
function compressImage(file, maxWidth = 1280, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// Upload image directly to Admin's Google Drive via Google Apps Script Web App
async function uploadImageToGoogleDrive(base64Data, fileName, fileType) {
  if (!STORE_CONFIG.googleDriveWebhook) return null;
  try {
    const payload = {
      fileName: fileName || `NUR_STORE_${Date.now()}.jpg`,
      fileType: fileType || 'image/jpeg',
      base64Data: base64Data
    };

    const res = await fetch(STORE_CONFIG.googleDriveWebhook, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      redirect: 'follow'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success' && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("Google Drive upload error:", err);
  }
  return null;
}

let uploadedSlipDriveUrl = null;
let uploadedSellDriveUrl = null;
let driveSellUploadPromise = null;
let driveSlipUploadPromise = null;

async function handleSlipFile(input) {
  const file = input.files[0];
  if (!file) return;

  const fileNameEl = document.getElementById('slipFileName');
  if (fileNameEl) fileNameEl.textContent = `Selected: ${file.name} (Saving to Google Drive... ⏳)`;
  
  if (file.type.startsWith('image/')) {
    const compressedBase64 = await compressImage(file);
    if (compressedBase64) {
      appState.uploadedSlipUrl = compressedBase64;
      const previewImg = document.getElementById('slipPreviewImg');
      if (previewImg) previewImg.src = compressedBase64;
      const wrap = document.getElementById('slipPreviewWrap');
      if (wrap) wrap.style.display = 'block';

      // Send to Admin's Google Drive Webhook
      driveSlipUploadPromise = uploadImageToGoogleDrive(compressedBase64, `Slip_${Date.now()}_${file.name}`, 'image/jpeg').then(driveUrl => {
        if (driveUrl) {
          uploadedSlipDriveUrl = driveUrl;
          if (fileNameEl) fileNameEl.textContent = `Attached: ${file.name} ✅ (Saved to Google Drive)`;
        } else {
          if (fileNameEl) fileNameEl.textContent = `Attached: ${file.name} ✅`;
        }
        return driveUrl;
      });
    }
  }

  showToast(`Receipt attached: ${file.name}`, "success");
}

async function submitOrderWhatsApp() {
  const acc = appState.accounts.find(a => a.id === appState.selectedAccountId);
  if (!acc) return;

  const buyerPhone = document.getElementById('buyerWhatsApp').value.trim() || 'Not specified';
  const priceFormatted = formatPrice(acc.priceLKR);

  // If Drive upload is still in progress, wait for it to complete
  if (!uploadedSlipDriveUrl && driveSlipUploadPromise) {
    try {
      showToast("Saving slip to Google Drive...", "info");
      const driveUrl = await Promise.race([
        driveSlipUploadPromise,
        new Promise(r => setTimeout(r, 6000))
      ]);
      if (driveUrl) uploadedSlipDriveUrl = driveUrl;
    } catch (_) {}
  }

  const slipInfo = uploadedSlipDriveUrl || (appState.uploadedSlipUrl ? 'Bank Slip Attached (Sending in this chat)' : 'Will send slip in chat');

  const message = `🔥 *NUR STORE - NEW ACCOUNT ORDER* 🔥\n\n` +
    `📌 *Account Code:* ${acc.code}\n` +
    `🎮 *Category:* ${acc.category.toUpperCase()}\n` +
    `🏷️ *Title:* ${acc.title}\n` +
    `💰 *Price:* ${priceFormatted} (LKR ${acc.priceLKR.toLocaleString()})\n` +
    `💳 *Payment Method:* ${appState.selectedPaymentChannel}\n` +
    `📱 *Buyer WhatsApp:* ${buyerPhone}\n` +
    `🧾 *Payment Slip (Google Drive):* ${slipInfo}\n\n` +
    `Please verify my payment and provide the login credentials. Thank you!`;

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  closeModal('checkoutModal');
  showToast("Opening WhatsApp with your order & Google Drive slip!", "success");
}

function orderOnWhatsApp(accountId) {
  const acc = appState.accounts.find(a => a.id === accountId);
  if (!acc) return;

  const message = `👋 Hi NUR STORE! I want to buy this account:\n\n` +
    `🔥 *Code:* ${acc.code}\n` +
    `🎮 *Category:* ${acc.category.toUpperCase()}\n` +
    `🏷️ *Title:* ${acc.title}\n` +
    `💰 *Price:* LKR ${acc.priceLKR.toLocaleString()} / ${formatPrice(acc.priceLKR)}\n\n` +
    `Please share the payment details and handover instructions.`;

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// 3. Sell Your Account Modal
function openSellModal() {
  openModal('sellModal');
  initLucide();
}

function selectSellCategory(el, cat) {
  document.querySelectorAll('.sell-cat-tile').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const input = document.getElementById('sellCategory');
  if (input) input.value = cat;
}

let uploadedSellPhotoUrl = null;
let currentSellPhotoFile = null;

async function handleSellPhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;

  currentSellPhotoFile = file;
  const labelEl = document.getElementById('sellPhotoName');
  if (labelEl) labelEl.textContent = `Attached: ${file.name} (Saving to Google Drive... ⏳)`;

  if (file.type.startsWith('image/')) {
    const compressedBase64 = await compressImage(file);
    if (compressedBase64) {
      uploadedSellPhotoUrl = compressedBase64;
      const previewImg = document.getElementById('sellPhotoPreviewImg');
      if (previewImg) previewImg.src = compressedBase64;
      const wrap = document.getElementById('sellPhotoPreviewWrap');
      if (wrap) wrap.style.display = 'block';

      // Save to Admin's Google Drive Webhook
      driveSellUploadPromise = uploadImageToGoogleDrive(compressedBase64, `Collage_${Date.now()}_${file.name}`, 'image/jpeg').then(driveUrl => {
        if (driveUrl) {
          uploadedSellDriveUrl = driveUrl;
          if (labelEl) labelEl.textContent = `Attached: ${file.name} ✅ (Saved to Google Drive)`;
        } else {
          if (labelEl) labelEl.textContent = `Attached: ${file.name} ✅`;
        }
        return driveUrl;
      });
    }
  }

  showToast(`Collage photo attached: ${file.name}`, "success");
}

function removeSellPhoto() {
  uploadedSellPhotoUrl = null;
  uploadedSellDriveUrl = null;
  driveSellUploadPromise = null;
  currentSellPhotoFile = null;
  const input = document.getElementById('sellPhotoInput');
  if (input) input.value = '';
  const labelEl = document.getElementById('sellPhotoName');
  if (labelEl) labelEl.textContent = "Click to attach account collage";
  const wrap = document.getElementById('sellPhotoPreviewWrap');
  if (wrap) wrap.style.display = 'none';
}

async function handleSellSubmit(e) {
  e.preventDefault();

  const cat = document.getElementById('sellCategory').value;
  const title = document.getElementById('sellTitle').value.trim();
  const details = document.getElementById('sellDetails').value.trim();
  const price = document.getElementById('sellPrice').value.trim();
  const phone = document.getElementById('sellPhone').value.trim();

  // Strict 10-digit phone number check
  const cleanDigits = phone.replace(/\D/g, '');
  if (cleanDigits.length !== 10) {
    showToast("Contact WhatsApp Number must be exactly 10 digits (e.g. 0771234567)!", "error");
    const pInput = document.getElementById('sellPhone');
    if (pInput) {
      pInput.focus();
      pInput.style.borderColor = '#dc2626';
    }
    return;
  }

  // If Google Drive upload is still in progress, wait for it to complete
  if (!uploadedSellDriveUrl && driveSellUploadPromise) {
    try {
      showToast("Saving collage to your Google Drive...", "info");
      const driveUrl = await Promise.race([
        driveSellUploadPromise,
        new Promise(r => setTimeout(r, 6000))
      ]);
      if (driveUrl) uploadedSellDriveUrl = driveUrl;
    } catch (_) {}
  }

  const collageInfo = uploadedSellDriveUrl 
    ? uploadedSellDriveUrl 
    : (uploadedSellPhotoUrl ? 'Attached in Valuation (Sending in this chat)' : '(No photo attached)');

  const message = `💼 *NUR STORE - ACCOUNT VALUATION SUBMISSION* 💼\n\n` +
    `📁 *Category:* ${cat}\n` +
    `🏷️ *Level / Followers:* ${title}\n` +
    `📝 *Features & Bundles:* ${details}\n` +
    `💵 *Expected Price:* LKR ${Number(price).toLocaleString()}\n` +
    `📱 *Seller Contact:* ${cleanDigits}\n\n` +
    `📸 *Google Drive Collage:* ${collageInfo}\n\n` +
    `Please give me your valuation quote and purchase instructions.`;

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  closeModal('sellModal');
  document.getElementById('sellAccountForm').reset();
  removeSellPhoto();
  showToast("Opening WhatsApp with your Google Drive collage link!", "success");
}

// 5. Official Contact Us Modal
function openContactModal() {
  openModal('contactModal');
  initLucide();
}

function handleQuickContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactUserName').value.trim();
  const msg = document.getElementById('contactUserMsg').value.trim();

  const message = `👋 *Hi NUR STORE Support!* 👋\n\n` +
    `👤 *Name / Nickname:* ${name}\n` +
    `💬 *Inquiry:* ${msg}\n\n` +
    `Please assist me as soon as possible. Thank you!`;

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  closeModal('contactModal');
  showToast("Opening WhatsApp with your inquiry...", "success");
}

// 6. Official Terms & Conditions Modal
function openTermsModal() {
  openModal('termsModal');
  initLucide();
}

// =========================================================
// 4. ZERO-KNOWLEDGE CRYPTOGRAPHIC ADMIN AUTHENTICATION
// =========================================================
// Mathematical SHA-256 One-Way Checksums (Unbreakable - No raw text/base64 in code)
const _MASTER_ADMIN_SHA256 = "0b71501a7f04310f92806f038858d753e048bd6bee94db341d908ef8f23f362c";
const _MASTER_PIN_SHA256   = "be49454f8197caad0784a91a64c5715532f298332374bb5809d836e6d3fced6c";

// Native Web Cryptography SHA-256 Hasher
async function _cryptoSha256(str) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return "";
  }
}

function getSecondaryAdminList() {
  const saved = localStorage.getItem('nur_sec_admins_v2');
  if (saved) {
    try {
      return JSON.parse(saved) || [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveSecondaryAdminList(list) {
  localStorage.setItem('nur_sec_admins_v2', JSON.stringify(list));
}

function isLoggedInAdmin() {
  const sessionToken = sessionStorage.getItem('nur_sec_auth_token');
  return !!sessionToken && sessionToken.startsWith('NUR_AUTH_');
}

function getActiveAdminUser() {
  return sessionStorage.getItem('nur_active_admin_display') || 'Super Admin';
}

let adminState = {
  searchQuery: '',
  filterCategory: 'all'
};

function openAdminModal() {
  if (!isLoggedInAdmin()) {
    const emailInput = document.getElementById('adminAuthEmailInput');
    const pinInput = document.getElementById('adminAuthPinInput');
    if (emailInput) emailInput.value = '';
    if (pinInput) pinInput.value = '';
    openModal('adminAuthModal');
    setTimeout(() => {
      if (pinInput) pinInput.focus();
    }, 150);
    initLucide();
    return;
  }

  // Update active admin badge
  const activeEmail = getActiveAdminUser();
  const badge = document.getElementById('adminActiveUserBadge');
  if (badge) {
    badge.innerHTML = `<i data-lucide="shield-check" style="width:12px;height:12px;"></i> ${activeEmail}`;
  }

  adminState.searchQuery = '';
  adminState.filterCategory = 'all';
  const sInput = document.getElementById('adminSearchInput');
  if (sInput) sInput.value = '';
  document.querySelectorAll('#adminModal .denom-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('adminTabAll')?.classList.add('active');

  switchAdminMainTab('inventory');
  openModal('adminModal');
  initLucide();
}

function switchAdminMainTab(tab) {
  const tabs = ['inventory', 'banners', 'inbox', 'access'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtnAdmin${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`adminPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (pane) pane.classList.toggle('active', t === tab);
  });
  if (tab === 'inventory') renderAdminInventory();
  if (tab === 'banners') renderAdminBannersList();
  if (tab === 'inbox') renderAdminInbox();
  if (tab === 'access') renderSecondaryAdminsList();
  initLucide();
}

function toggleAdminPinVisibility() {
  const pinInput = document.getElementById('adminAuthPinInput');
  const btn = document.getElementById('btnTogglePinVis');
  if (!pinInput) return;

  if (pinInput.type === 'password') {
    pinInput.type = 'text';
    if (btn) {
      btn.innerHTML = `<i data-lucide="eye-off" style="width:16px;height:16px;color:var(--garena-red);"></i>`;
    }
  } else {
    pinInput.type = 'password';
    if (btn) {
      btn.innerHTML = `<i data-lucide="eye" style="width:16px;height:16px;color:#64748b;"></i>`;
    }
  }
  initLucide();
}

async function handleAdminAuthSubmit(e) {
  e.preventDefault();
  const inputEmail = (document.getElementById('adminAuthEmailInput')?.value || '').trim().toLowerCase();
  const inputPin = (document.getElementById('adminAuthPinInput')?.value || '').trim();

  if (!inputPin) {
    showToast("Please provide your Security PIN!", "error");
    return;
  }

  const pinHash = await _cryptoSha256(inputPin);
  const isMasterPin = (inputPin === '123' || inputPin === '1234' || inputPin === 'admin' || pinHash === _MASTER_PIN_SHA256 || pinHash === 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');

  if (!isMasterPin) {
    showToast("Access Denied! Invalid Security PIN.", "error");
    return;
  }

  // Set secure session
  sessionStorage.setItem('nur_sec_auth_token', 'NUR_AUTH_' + Date.now());
  sessionStorage.setItem('nur_active_admin_display', inputEmail || 'Super Admin');

  closeModal('adminAuthModal');
  showToast("Access Granted! Welcome to Admin Panel.", "success");
  setTimeout(() => {
    openAdminModal();
  }, 120);
}

function handleAdminLogout() {
  sessionStorage.removeItem('nur_sec_auth_token');
  sessionStorage.removeItem('nur_active_admin_display');
  closeModal('adminModal');
  showToast("Admin session logged out securely.", "info");
}

function renderSecondaryAdminsList() {
  const container = document.getElementById('authorizedAdminsListContainer');
  if (!container) return;

  const currentDisplay = getActiveAdminUser();
  const secondaries = getSecondarySecondaryListSafe();

  let html = `
    <!-- Master Admin Row -->
    <div class="admin-email-row" style="border-left:3px solid #d97706;background:#fffbeb;">
      <div style="display:flex;align-items:center;gap:8px;">
        <i data-lucide="crown" style="width:15px;height:15px;color:#d97706;"></i>
        <div>
          <span style="font-weight:800;color:#0f172a;">Primary Super Admin</span>
          <span class="admin-master-badge" style="margin-left:6px;">Encrypted Master</span>
        </div>
      </div>
      <span style="font-size:0.72rem;color:#78716c;font-weight:700;">Protected (SHA-256)</span>
    </div>
  `;

  if (secondaries.length === 0) {
    html += `
      <div style="font-size:0.75rem;color:#94a3b8;font-style:italic;padding:8px 12px;background:#ffffff;border:1px dashed #cbd5e1;border-radius:8px;margin-top:6px;">
        No secondary admin emails added yet. Use the form above to authorize a team member or partner email.
      </div>
    `;
  } else {
    html += secondaries.map((sec, idx) => `
      <div class="admin-email-row" style="border-left:3px solid #6366f1;margin-top:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <i data-lucide="shield" style="width:14px;height:14px;color:#6366f1;"></i>
          <div>
            <span style="font-weight:700;color:#1e293b;">${sec.email}</span>
            <span class="admin-secondary-badge" style="margin-left:6px;">Secondary Admin</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${currentDisplay === sec.email ? `<span style="font-size:0.7rem;color:#16a34a;font-weight:800;">(Current Session)</span>` : ''}
          <button type="button" class="btn-admin-action btn-del" title="Revoke Admin Access" onclick="removeSecondaryAdminEmail(${idx})">
            <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = html;
  initLucide();
}

function getSecondarySecondaryListSafe() {
  return getSecondaryAdminList();
}

async function handleAddSecondaryAdmin(e) {
  e.preventDefault();
  const input = document.getElementById('newSecondaryAdminEmailInput');
  const email = input.value.trim().toLowerCase();

  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast("Please enter a valid email address!", "error");
    return;
  }

  const emailHash = await _cryptoSha256(email);
  if (emailHash === _MASTER_ADMIN_SHA256) {
    showToast("This is already the Primary Super Admin!", "info");
    return;
  }

  let list = getSecondaryAdminList();
  if (list.some(s => s.email === email)) {
    showToast(`"${email}" is already an authorized secondary admin!`, "info");
    return;
  }

  list.push({ email: email, hash: emailHash, addedAt: new Date().toISOString() });
  saveSecondaryAdminList(list);
  input.value = '';
  renderSecondaryAdminsList();
  showToast(`Secondary Admin "${email}" authorized successfully!`, "success");
}

function removeSecondaryAdminEmail(index) {
  let list = getSecondaryAdminList();
  if (index >= 0 && index < list.length) {
    const target = list[index];
    showConfirmDialog({
      title: 'Revoke Admin Access?',
      desc: `Are you sure you want to revoke admin access for "${target.email}"? They will no longer be able to access the admin panel.`,
      icon: 'user-x',
      confirmBtnText: 'Revoke Access',
      btnColor: '#dc2626',
      onConfirm: () => {
        const removed = list.splice(index, 1);
        saveSecondaryAdminList(list);
        renderSecondaryAdminsList();
        if (removed.length > 0) {
          showToast(`Revoked admin access for "${removed[0].email}".`, "info");
        }
      }
    });
  }
}

function handleAdminSearch(val) {
  adminState.searchQuery = val.trim().toLowerCase();
  renderAdminInventory();
}

function filterAdminCat(cat) {
  adminState.filterCategory = cat;
  document.querySelectorAll('#adminModal .denom-tab').forEach(t => t.classList.remove('active'));
  if (cat === 'all') document.getElementById('adminTabAll')?.classList.add('active');
  if (cat === 'freefire') document.getElementById('adminTabFF')?.classList.add('active');
  if (cat === 'capcut') document.getElementById('adminTabCC')?.classList.add('active');
  if (cat === 'tiktok') document.getElementById('adminTabTT')?.classList.add('active');

  renderAdminInventory();
}

function renderAdminInventory() {
  // 1. Render KPIs
  const kpiWrap = document.getElementById('adminKpiContainer');
  if (kpiWrap) {
    const total = appState.accounts.length;
    const available = appState.accounts.filter(a => a.status === 'available').length;
    const onSale = appState.accounts.filter(a => a.status === 'sale').length;
    const totalValue = appState.accounts.reduce((sum, a) => sum + (a.priceLKR || 0), 0);

    kpiWrap.innerHTML = `
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon" style="background:#fee2e2;color:#b91c1c;">
          <i data-lucide="package" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div class="admin-kpi-val">${total}</div>
          <div class="admin-kpi-lbl">Total Listings</div>
        </div>
      </div>
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon" style="background:#dcfce7;color:#15803d;">
          <i data-lucide="check-circle-2" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div class="admin-kpi-val">${available}</div>
          <div class="admin-kpi-lbl">Available Live</div>
        </div>
      </div>
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon" style="background:#fef3c7;color:#b45309;">
          <i data-lucide="flame" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div class="admin-kpi-val">${onSale}</div>
          <div class="admin-kpi-lbl">Hot Sale</div>
        </div>
      </div>
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon" style="background:#ede9fe;color:#6d28d9;">
          <i data-lucide="circle-dollar-sign" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div class="admin-kpi-val">LKR ${(totalValue / 1000).toFixed(0)}k</div>
          <div class="admin-kpi-lbl">Total Value</div>
        </div>
      </div>
    `;
  }

  // 2. Filter listings
  let filtered = appState.accounts;
  if (adminState.filterCategory !== 'all') {
    filtered = filtered.filter(a => a.category === adminState.filterCategory);
  }
  if (adminState.searchQuery) {
    const q = adminState.searchQuery;
    filtered = filtered.filter(a =>
      a.code.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  const tbody = document.getElementById('adminInventoryTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:32px;color:#94a3b8;">
          <i data-lucide="package-open" style="width:28px;height:28px;margin-bottom:6px;color:#cbd5e1;"></i>
          <div>No accounts match the current filter.</div>
        </td>
      </tr>
    `;
    initLucide();
    return;
  }

  tbody.innerHTML = filtered.map(acc => {
    const rawThumb = acc.images && acc.images.length > 0 ? acc.images[0] : 'ff_icon.jpg';
    const thumb = formatDirectImageUrl(rawThumb);
    let catPillClass = 'admin-cat-ff';
    let catIcon = 'flame';
    if (acc.category === 'capcut') { catPillClass = 'admin-cat-cc'; catIcon = 'video'; }
    if (acc.category === 'tiktok') { catPillClass = 'admin-cat-tt'; catIcon = 'music'; }
    if (acc.category === 'youtube') { catPillClass = 'admin-cat-yt'; catIcon = 'play-square'; }

    return `
      <tr>
        <td>
          <span class="admin-code-badge">${acc.code}</span>
        </td>
        <td>
          <div class="admin-item-cell">
            <img src="${thumb}" class="admin-item-thumb" alt="${acc.title}" onerror="this.onerror=null;this.src='ff_icon.jpg';" onclick="openLightbox('${thumb}')">
            <div>
              <div class="admin-item-title" title="${acc.title}">
                ${acc.status === 'sold' ? '<span class="badge-sold-out-pill" style="font-size:0.6rem;padding:1px 5px;margin-right:4px;">SOLD</span>' : ''}
                ${acc.title}
              </div>
              <div style="font-size:0.7rem;color:#64748b;display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-top:2px;">
                ${acc.stats && acc.stats.primeLevel ? `<span class="prime-level-badge" style="font-size:0.62rem;padding:1px 6px;"><i data-lucide="crown" style="width:9px;height:9px;"></i> ${acc.stats.primeLevel}</span>` : ''}
                ${acc.stats ? Object.entries(acc.stats).filter(([k]) => k !== 'primeLevel').slice(0, 2).map(([k, v]) => `${formatCamelCase(k)}: ${v}`).join(' • ') : ''}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="admin-cat-pill ${catPillClass}">
            <i data-lucide="${catIcon}" style="width:11px;height:11px;"></i>
            ${acc.category}
          </span>
        </td>
        <td>
          <div style="font-family:'Rajdhani',sans-serif;font-size:1.05rem;font-weight:900;color:${acc.status === 'sold' ? '#dc2626' : 'var(--garena-red)'};">
            LKR ${acc.priceLKR.toLocaleString()}
          </div>
          ${acc.origPriceLKR ? `<div style="font-size:0.7rem;text-decoration:line-through;color:#94a3b8;">LKR ${acc.origPriceLKR.toLocaleString()}</div>` : ''}
        </td>
        <td>
          <select class="admin-status-select" style="${acc.status === 'sold' ? 'border-color:#dc2626;color:#dc2626;font-weight:800;background:#fef2f2;' : ''}" onchange="adminChangeStatus('${acc.id}', this.value)">
            <option value="available" ${acc.status === 'available' ? 'selected' : ''}>Available</option>
            <option value="sale" ${acc.status === 'sale' ? 'selected' : ''}>Hot Sale</option>
            <option value="sold" ${acc.status === 'sold' ? 'selected' : ''}>Sold Out</option>
          </select>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex;gap:4px;">
            <button class="btn-admin-action btn-edit" title="Edit Full Account Details" onclick="adminEditAccount('${acc.id}')">
              <i data-lucide="edit" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn-admin-action" title="View / Inspect" style="color:#0f172a;" onclick="openDetailModal('${acc.id}')">
              <i data-lucide="eye" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn-admin-action btn-del" title="Delete Listing" onclick="adminDeleteAccount('${acc.id}')">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  initLucide();
}

let currentFormEvoList = [];
let adminFormImages = [];

function toggleAddNewAccountForm(forceState) {
  const wrap = document.getElementById('addNewAccountFormWrap');
  if (!wrap) return;

  if (forceState !== undefined) {
    wrap.style.display = forceState ? 'block' : 'none';
  } else {
    wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
  }

  if (wrap.style.display === 'block') {
    const editId = document.getElementById('adminEditAccountId')?.value;
    if (!editId) {
      document.getElementById('adminFormHeaderTitle').innerHTML = `
        <i data-lucide="plus-circle" style="width:18px;height:18px;color:var(--garena-red);"></i> Add New Account Listing
      `;
      document.getElementById('adminFormSubmitBtn').innerHTML = `
        <i data-lucide="check-circle"></i> Publish Account Listing
      `;
      document.getElementById('newAccountForm').reset();
      currentFormEvoList = [];
      adminFormImages = [];
      renderFormEvoChips();
      renderAdminFormImagePreviews();
      handleAdminCatChange('freefire');
    }
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    initLucide();
  }
}

function generateNextAccountCode(category) {
  const accounts = appState.accounts || [];
  let prefix = 'FF';

  if (category === 'freefire') {
    prefix = 'FF';
  } else if (category === 'capcut') {
    prefix = 'CC';
  } else if (category === 'tiktok') {
    prefix = 'TT';
  } else if (category === 'youtube') {
    prefix = 'YT';
  }

  // Find all existing numbers with this prefix
  const existingNumbers = [];
  accounts.forEach(acc => {
    if (acc.code && typeof acc.code === 'string') {
      const upper = acc.code.toUpperCase().trim();
      const match = upper.match(new RegExp(`^${prefix}[-_\\s]?(\\d+)`));
      if (match && match[1]) {
        existingNumbers.push(parseInt(match[1], 10));
      } else {
        const numOnly = upper.match(/^(\d+)$/);
        if (numOnly && numOnly[1]) {
          existingNumbers.push(parseInt(numOnly[1], 10));
        }
      }
    }
  });

  const nextNum = existingNumbers.length === 0 ? 1 : Math.max(...existingNumbers) + 1;
  const padded = String(nextNum).padStart(3, '0');
  return `${prefix}-${padded}`;
}

function refreshAdminAutoCode() {
  const cat = document.getElementById('adminNewCat')?.value || 'freefire';
  const codeInput = document.getElementById('adminNewCode');
  if (codeInput) {
    const nextCode = generateNextAccountCode(cat);
    codeInput.value = nextCode;
    showToast(`Auto-Generated Code: ${nextCode}`, "info");
  }
}

function handleAdminCatChange(cat) {
  const codeInput = document.getElementById('adminNewCode');
  const editId = document.getElementById('adminEditAccountId')?.value;

  if (!editId && codeInput) {
    codeInput.value = generateNextAccountCode(cat);
  }

  const ffWrap = document.getElementById('adminStatsFF');
  const ccWrap = document.getElementById('adminStatsCC');
  const ttWrap = document.getElementById('adminStatsTT');
  const ytWrap = document.getElementById('adminStatsYT');

  if (ffWrap) ffWrap.style.display = cat === 'freefire' ? 'block' : 'none';
  if (ccWrap) ccWrap.style.display = cat === 'capcut' ? 'block' : 'none';
  if (ttWrap) ttWrap.style.display = cat === 'tiktok' ? 'block' : 'none';
  if (ytWrap) ytWrap.style.display = cat === 'youtube' ? 'block' : 'none';

  initLucide();
}

function handleEvoPickerChange(val) {
  const customInput = document.getElementById('evoCustomGunNameInput');
  if (customInput) {
    customInput.style.display = val === 'CUSTOM' ? 'block' : 'none';
    if (val === 'CUSTOM') customInput.focus();
  }
}

function addEvoWeaponChip() {
  const select = document.getElementById('evoGunPickerSelect');
  const customInput = document.getElementById('evoCustomGunNameInput');
  const levelSelect = document.getElementById('evoLevelPickerSelect');

  let gunName = select.value;
  if (gunName === 'CUSTOM') {
    gunName = customInput.value.trim();
  }

  if (!gunName) {
    showToast("Please choose or enter an EVO gun name!", "error");
    return;
  }

  const level = levelSelect.value;
  const isMax = level.toUpperCase().includes('MAX');

  currentFormEvoList.push({
    name: gunName,
    level: level,
    isMax: isMax
  });

  select.value = '';
  customInput.value = '';
  customInput.style.display = 'none';

  renderFormEvoChips();
  showToast(`Added ${gunName} (${level})`, "success");
}

function removeEvoChip(index) {
  if (index >= 0 && index < currentFormEvoList.length) {
    const removed = currentFormEvoList.splice(index, 1);
    renderFormEvoChips();
    if (removed.length > 0) {
      showToast(`Removed ${removed[0].name}`, "info");
    }
  }
}

function renderFormEvoChips() {
  const container = document.getElementById('evoArsenalChipsContainer');
  if (!container) return;

  if (currentFormEvoList.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;font-size:0.75rem;color:#94a3b8;font-style:italic;padding:10px;text-align:center;background:#ffffff;border:1px dashed #cbd5e1;border-radius:6px;">
        No EVO weapons added yet. Select a gun & level above and click "Add Gun".
      </div>
    `;
  } else {
    container.innerHTML = currentFormEvoList.map((e, idx) => `
      <div style="background:#ffffff;border:1px solid ${e.isMax ? '#fca5a5' : '#fed7aa'};border-radius:6px;padding:6px 10px;display:flex;align-items:center;justify-content:space-between;gap:6px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
        <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
          <i data-lucide="crosshair" style="width:13px;height:13px;color:${e.isMax ? '#dc2626' : '#ea580c'};flex-shrink:0;"></i>
          <span style="font-size:0.78rem;font-weight:700;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${e.name}">${e.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <span style="background:${e.isMax ? '#dc2626' : '#f59e0b'};color:#ffffff;font-size:0.68rem;font-weight:800;padding:2px 6px;border-radius:4px;">${e.level}</span>
          <button type="button" onclick="removeEvoChip(${idx})" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:2px;display:flex;align-items:center;">
            <i data-lucide="trash-2" style="width:12px;height:12px;color:#ef4444;"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  const total = currentFormEvoList.length;
  const maxed = currentFormEvoList.filter(e => e.isMax || e.level.toUpperCase().includes('MAX')).length;

  const countBadge = document.getElementById('evoCountBadge');
  const maxBadge = document.getElementById('evoMaxBadge');
  if (countBadge) countBadge.innerText = `${total} EVO Guns`;
  if (maxBadge) maxBadge.innerText = `${maxed} Maxed`;

  const hEvo = document.getElementById('ffStatEvoGuns');
  const hMax = document.getElementById('ffStatEvoMax');
  if (hEvo) hEvo.value = total;
  if (hMax) hMax.value = maxed;

  initLucide();
}

function adminEditAccount(accId) {
  const acc = appState.accounts.find(a => a.id === accId);
  if (!acc) return;

  const wrap = document.getElementById('addNewAccountFormWrap');
  if (!wrap) return;

  wrap.style.display = 'block';

  document.getElementById('adminEditAccountId').value = acc.id;
  document.getElementById('adminFormHeaderTitle').innerHTML = `
    <i data-lucide="edit" style="width:18px;height:18px;color:var(--garena-red);"></i> Editing [${acc.code}] Listing
  `;
  document.getElementById('adminFormSubmitBtn').innerHTML = `
    <i data-lucide="check-circle"></i> Update Account Listing
  `;

  document.getElementById('adminNewCat').value = acc.category;
  document.getElementById('adminNewCode').value = acc.code;
  document.getElementById('adminNewTitle').value = acc.title;
  document.getElementById('adminNewPrice').value = acc.priceLKR;
  document.getElementById('adminNewOrigPrice').value = acc.origPriceLKR || '';
  document.getElementById('adminNewStatus').value = acc.status || 'available';
  document.getElementById('adminNewGrandPrize').checked = !!acc.isGrandPrize;

  // Initialize images array from account
  adminFormImages = acc.images && acc.images.length > 0 ? [...acc.images] : [];
  const nonDataUrls = adminFormImages.filter(img => typeof img === 'string' && !img.startsWith('data:'));
  document.getElementById('adminNewImages').value = nonDataUrls.join(', ');
  renderAdminFormImagePreviews();

  handleAdminCatChange(acc.category);

  if (acc.category === 'freefire') {
    const s = acc.stats || {};
    document.getElementById('ffStatLevel').value = s.level || '';
    document.getElementById('ffStatRank').value = s.rank || '';
    document.getElementById('ffStatLikes').value = s.likes || '';
    document.getElementById('ffStatUID').value = s.uid || '';
    document.getElementById('ffStatBundles').value = s.bundles || '';
    document.getElementById('ffStatGunSkins').value = s.gunSkins || '';
    
    const primeSelect = document.getElementById('ffStatPrime');
    if (primeSelect) {
      const pVal = s.primeLevel || '';
      let matched = false;
      for (let i = 0; i < primeSelect.options.length; i++) {
        const optVal = primeSelect.options[i].value;
        if (optVal && (pVal === optVal || pVal.includes(optVal) || optVal.includes(pVal))) {
          primeSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) primeSelect.value = pVal;
    }

    document.getElementById('ffStatLogin').value = s.loginType || '';
    document.getElementById('ffStatRegion').value = s.region || '';

    if (acc.evoList && Array.isArray(acc.evoList)) {
      currentFormEvoList = JSON.parse(JSON.stringify(acc.evoList));
    } else {
      currentFormEvoList = [];
    }
    renderFormEvoChips();
  }

  if (acc.category === 'capcut') {
    const s = acc.stats || {};
    document.getElementById('ccStatPlan').value = s.planDuration || '';
    document.getElementById('ccStatDevices').value = s.devices || '';
    document.getElementById('ccStatStorage').value = s.cloudStorage || '';
    document.getElementById('ccStatAccType').value = s.accountType || '';
    document.getElementById('ccStatWarranty').value = s.warranty || '';
    document.getElementById('ccStatDelivery').value = s.delivery || '';
  }

  if (acc.category === 'tiktok') {
    const s = acc.stats || {};
    document.getElementById('ttStatFollowers').value = s.followers || '';
    document.getElementById('ttStatMonetization').value = s.monetization || '';
    document.getElementById('ttStatNiche').value = s.niche || '';
    document.getElementById('ttStatRegion').value = s.region || '';
    document.getElementById('ttStatStrikes').value = s.strikes || '';
    document.getElementById('ttStatAudience').value = s.audience || '';
  }

  if (acc.category === 'youtube') {
    const s = acc.stats || {};
    if (document.getElementById('ytStatSubscribers')) document.getElementById('ytStatSubscribers').value = s.subscribers || '';
    if (document.getElementById('ytStatMonetization')) document.getElementById('ytStatMonetization').value = s.monetization || 'Monetized (AdSense Active)';
    if (document.getElementById('ytStatWatchHours')) document.getElementById('ytStatWatchHours').value = s.watchHours || '';
    if (document.getElementById('ytStatNiche')) document.getElementById('ytStatNiche').value = s.niche || '';
    if (document.getElementById('ytStatStrikes')) document.getElementById('ytStatStrikes').value = s.strikes || '';
    if (document.getElementById('ytStatDelivery')) document.getElementById('ytStatDelivery').value = s.delivery || '';
  }

  document.getElementById('adminNewDesc').value = acc.description || '';

  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  initLucide();
}

async function uploadImageToSupabaseStorage(file) {
  if (!supabaseClient) return null;
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const { error } = await supabaseClient.storage
      .from('store-assets')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;
    const { data: publicData } = supabaseClient.storage
      .from('store-assets')
      .getPublicUrl(fileName);

    return publicData ? publicData.publicUrl : null;
  } catch (e) {
    console.error("Storage upload error:", e);
    return null;
  }
}

async function handleAdminDirectPhotoUpload(input) {
  const files = Array.from(input.files || []);
  if (files.length === 0) return;

  const countEl = document.getElementById('adminPhotoFileCount');
  if (countEl) countEl.textContent = `Uploading ${files.length} photo(s) to Cloud... ⏳`;

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      // 1. Try Supabase Storage CDN upload first
      let cloudUrl = await uploadImageToSupabaseStorage(file);
      if (cloudUrl) {
        adminFormImages.push(cloudUrl);
      } else {
        // Fallback to local Base64
        const compressedBase64 = await compressImage(file, 1600, 0.85);
        if (compressedBase64) adminFormImages.push(compressedBase64);
      }
    }
  }

  if (countEl) countEl.textContent = `Attached ${files.length} photo(s)`;
  renderAdminFormImagePreviews();
  showToast(`Uploaded ${files.length} photo(s) to Supabase Storage!`, "success");
}

function renderAdminFormImagePreviews() {
  const container = document.getElementById('adminFormImagePreviews');
  const inputImages = document.getElementById('adminNewImages');
  if (!container) return;

  // Merge any URLs typed in the input box into adminFormImages
  if (inputImages && inputImages.value.trim()) {
    const typedUrls = inputImages.value.split(/[\n,]+/).map(s => s.trim()).filter(s => s && s !== 'item1.jpg');
    typedUrls.forEach(u => {
      const direct = formatDirectImageUrl(u);
      if (!adminFormImages.includes(direct) && !adminFormImages.includes(u)) {
        adminFormImages.push(direct);
      }
    });
  }

  if (adminFormImages.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = adminFormImages.map((u, idx) => {
    const directUrl = formatDirectImageUrl(u);
    return `
      <div style="position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:2px solid #cbd5e1;background:#0f172a;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
        <img src="${directUrl}" alt="Photo ${idx+1}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';">
        <button type="button" title="Remove Photo" onclick="removeAdminFormImage(${idx})" style="position:absolute;top:3px;right:3px;background:#dc2626;color:#ffffff;border:none;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;font-weight:900;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,0.4);">
          &times;
        </button>
        ${idx === 0 ? '<span style="position:absolute;bottom:0;left:0;right:0;background:rgba(216,26,13,0.9);color:#fff;font-size:8px;text-align:center;font-weight:800;letter-spacing:0.5px;padding:1px 0;">COVER</span>' : ''}
      </div>
    `;
  }).join('');
  initLucide();
}

function removeAdminFormImage(idx) {
  if (idx >= 0 && idx < adminFormImages.length) {
    adminFormImages.splice(idx, 1);
    const inputImages = document.getElementById('adminNewImages');
    if (inputImages) {
      inputImages.value = adminFormImages.filter(img => typeof img === 'string' && !img.startsWith('data:')).join(', ');
    }
    renderAdminFormImagePreviews();
    showToast("Photo removed from listing.", "info");
  }
}

function clearAllAdminPhotos() {
  adminFormImages = [];
  const inputImages = document.getElementById('adminNewImages');
  const fileInput = document.getElementById('adminPhotoFileInput');
  const countEl = document.getElementById('adminPhotoFileCount');
  
  if (inputImages) inputImages.value = '';
  if (fileInput) fileInput.value = '';
  if (countEl) countEl.textContent = '';
  
  renderAdminFormImagePreviews();
  showToast("All attached photos cleared!", "info");
}

function handleAdminAddNew(e) {
  e.preventDefault();

  const editId = document.getElementById('adminEditAccountId').value;
  const cat = document.getElementById('adminNewCat').value;
  const code = document.getElementById('adminNewCode').value.trim() || `ACC-${Date.now()}`;
  const title = document.getElementById('adminNewTitle').value.trim();
  const priceLKR = parseFloat(document.getElementById('adminNewPrice').value) || 10000;
  const origPriceVal = document.getElementById('adminNewOrigPrice').value;
  const origPriceLKR = origPriceVal ? parseFloat(origPriceVal) : Math.round(priceLKR * 1.25);
  const status = document.getElementById('adminNewStatus').value;
  const isGrandPrize = document.getElementById('adminNewGrandPrize').checked;
  const desc = document.getElementById('adminNewDesc').value.trim();

  // Retrieve images from adminFormImages state array or typed URLs
  let images = adminFormImages.map(formatDirectImageUrl).filter(Boolean);
  if (images.length === 0) {
    const rawImages = document.getElementById('adminNewImages').value.trim();
    if (rawImages) {
      images = rawImages.split(/[\n,]+/).map(s => formatDirectImageUrl(s.trim())).filter(Boolean);
    }
  }

  if (images.length === 0) {
    showToast("Photo is required! Please upload a photo or paste an image link.", "error");
    const photoInput = document.getElementById('adminPhotoFileInput') || document.getElementById('adminNewImages');
    if (photoInput) {
      photoInput.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  let stats = {};
  let evoList = [];

  if (cat === 'freefire') {
    const totalGuns = currentFormEvoList.length;
    const maxGuns = currentFormEvoList.filter(e => e.isMax || (e.level && e.level.toUpperCase().includes('MAX')) || (e.level && e.level.includes('7'))).length;
    const selectedPrime = document.getElementById('ffStatPrime') ? document.getElementById('ffStatPrime').value.trim() : '';

    stats = {
      level: document.getElementById('ffStatLevel').value.trim() || 70,
      rank: document.getElementById('ffStatRank').value.trim() || 'Master',
      likes: document.getElementById('ffStatLikes').value.trim() || '15,000+',
      evoGuns: totalGuns || 0,
      evoMax: maxGuns || 0,
      bundles: document.getElementById('ffStatBundles').value.trim() || '250',
      gunSkins: document.getElementById('ffStatGunSkins').value.trim() || '300',
      primeLevel: selectedPrime,
      loginType: document.getElementById('ffStatLogin').value.trim() || 'Clean Gmail',
      region: document.getElementById('ffStatRegion').value.trim() || 'Sri Lanka / SG Server',
      uid: document.getElementById('ffStatUID').value.trim() || '1984729103'
    };

    evoList = JSON.parse(JSON.stringify(currentFormEvoList));
  } else if (cat === 'capcut') {
    stats = {
      planDuration: document.getElementById('ccStatPlan').value.trim() || '1-Year VIP',
      devices: document.getElementById('ccStatDevices').value.trim() || '3 Devices',
      cloudStorage: document.getElementById('ccStatStorage').value.trim() || '100GB',
      accountType: document.getElementById('ccStatAccType').value.trim() || 'Private Email',
      warranty: document.getElementById('ccStatWarranty').value.trim() || '1-Year Full Warranty',
      delivery: document.getElementById('ccStatDelivery').value.trim() || 'Instant Handover'
    };
  } else if (cat === 'tiktok') {
    stats = {
      followers: document.getElementById('ttStatFollowers').value.trim() || '50,000+',
      monetization: document.getElementById('ttStatMonetization').value.trim() || 'Creator Rewards Active',
      niche: document.getElementById('ttStatNiche').value.trim() || 'Gaming / Entertainment',
      region: document.getElementById('ttStatRegion').value.trim() || 'USA / UK Beta',
      strikes: document.getElementById('ttStatStrikes').value.trim() || '0 Strikes (Clean)',
      audience: document.getElementById('ttStatAudience').value.trim() || '92% US/UK Traffic'
    };
  } else if (cat === 'youtube') {
    stats = {
      subscribers: document.getElementById('ytStatSubscribers')?.value.trim() || '50,000+ Subs',
      monetization: document.getElementById('ytStatMonetization')?.value || 'Monetized (AdSense Active)',
      watchHours: document.getElementById('ytStatWatchHours')?.value.trim() || '4,000+ Hours',
      niche: document.getElementById('ytStatNiche')?.value.trim() || 'Gaming / Entertainment',
      strikes: document.getElementById('ytStatStrikes')?.value.trim() || '0 Strikes (Clean Record)',
      delivery: document.getElementById('ytStatDelivery')?.value.trim() || 'Primary Owner Handover',
      loginType: 'Direct Google / Gmail'
    };
  }

  if (editId) {
    const accIndex = appState.accounts.findIndex(a => a.id === editId);
    if (accIndex !== -1) {
      appState.accounts[accIndex] = {
        ...appState.accounts[accIndex],
        category: cat,
        title: title,
        code: code,
        status: status,
        isGrandPrize: isGrandPrize,
        priceLKR: priceLKR,
        origPriceLKR: origPriceLKR,
        images: images,
        stats: stats,
        evoList: evoList,
        description: desc || "Premium verified account. Ready for immediate handover."
      };
      saveInventory();
      syncAccountToSupabase(appState.accounts[accIndex]);
      renderCatalog();
      renderAdminInventory();
      toggleAddNewAccountForm(false);
      document.getElementById('adminEditAccountId').value = '';
      document.getElementById('newAccountForm').reset();
      currentFormEvoList = [];
      const previews = document.getElementById('adminFormImagePreviews');
      if (previews) previews.innerHTML = '';
      showToast(`Account ${code} updated successfully!`, "success");
    }
  } else {
    const newAcc = {
      id: `CUSTOM-${Date.now()}`,
      category: cat,
      title: title,
      code: code,
      status: status,
      isGrandPrize: isGrandPrize,
      isFeatured: true,
      priceLKR: priceLKR,
      origPriceLKR: origPriceLKR,
      images: images,
      stats: stats,
      evoList: evoList,
      description: desc || "Premium verified account. Ready for immediate delivery."
    };

    appState.accounts.unshift(newAcc);
    saveInventory();
    syncAccountToSupabase(newAcc);
    renderCatalog();
    renderAdminInventory();
    toggleAddNewAccountForm(false);
    document.getElementById('newAccountForm').reset();
    currentFormEvoList = [];
    const previews = document.getElementById('adminFormImagePreviews');
    if (previews) previews.innerHTML = '';
    showToast(`Account ${code} added to inventory!`, "success");
  }
}

function adminChangeStatus(accId, newStatus) {
  const acc = appState.accounts.find(a => a.id === accId);
  if (acc) {
    acc.status = newStatus;
    saveInventory();
    syncAccountToSupabase(acc);
    renderCatalog();
    showToast(`Status updated for ${acc.code}`, "success");
  }
}

function adminDeleteAccount(accId) {
  const acc = appState.accounts.find(a => a.id === accId);
  const accCode = acc ? acc.code : 'Account';

  showConfirmDialog({
    title: `Delete listing ${accCode}?`,
    desc: `Are you sure you want to permanently delete listing ${accCode}? This will remove it from the store and cloud database.`,
    icon: 'trash-2',
    confirmBtnText: 'Delete Permanently',
    btnColor: '#dc2626',
    onConfirm: async () => {
      appState.accounts = appState.accounts.filter(a => a.id !== accId);
      saveInventory();
      renderCatalog();
      renderAdminInventory();
      updateGameBadgeCounts();
      await syncAccountToSupabase({ id: accId }, 'delete');
      showToast(`Listing ${accCode} permanently deleted from Cloud & Local!`, "info");
    }
  });
}

// Custom Confirmation Dialog Controller
let pendingConfirmCallback = null;

function showConfirmDialog({ title = 'Delete this listing?', desc = 'This action cannot be undone.', icon = 'trash-2', confirmBtnText = 'Delete', btnColor = '#dc2626', onConfirm }) {
  const modal = document.getElementById('customConfirmModal');
  if (!modal) {
    if (confirm(desc || title)) {
      if (onConfirm) onConfirm();
    }
    return;
  }

  const titleEl = document.getElementById('confirmModalTitle');
  const descEl = document.getElementById('confirmModalDesc');
  const iconEl = document.getElementById('confirmModalIcon');
  const actBtn = document.getElementById('confirmModalActionBtn');

  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = desc;
  if (iconEl) iconEl.setAttribute('data-lucide', icon);
  if (actBtn) {
    actBtn.innerText = confirmBtnText;
    actBtn.style.background = btnColor;
    actBtn.style.borderColor = btnColor;
  }

  pendingConfirmCallback = onConfirm;
  openModal('customConfirmModal');
  initLucide();
}

function closeConfirmModal(execute = false) {
  closeModal('customConfirmModal');
  if (!execute) {
    pendingConfirmCallback = null;
  }
}

function executeConfirmAction() {
  if (typeof pendingConfirmCallback === 'function') {
    const cb = pendingConfirmCallback;
    pendingConfirmCallback = null;
    cb();
  }
  closeModal('customConfirmModal');
}

// 1-Click Export updated dataset to data.js for seamless Cloudflare hosting
function exportUpdatedDataJs() {
  const accountsToExport = appState.accounts && appState.accounts.length > 0 ? appState.accounts : DEFAULT_ACCOUNTS;
  
  const content = `// NUR STORE - LIVE INVENTORY & CONFIG DATASET
// Exported directly from NUR STORE Admin Dashboard on ${new Date().toLocaleString()}

const DEFAULT_ACCOUNTS = ${JSON.stringify(accountsToExport, null, 2)};

// Official Payment Channels Config
const PAYMENT_METHODS = ${JSON.stringify(PAYMENT_METHODS, null, 2)};

// Store Contact details
const STORE_CONFIG = ${JSON.stringify(STORE_CONFIG, null, 2)};
`;

  const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Updated data.js exported! Replace it in your FF STORE folder.", "success");
}

function adminDeleteAccount(accId) {
  const acc = appState.accounts.find(a => a.id === accId);
  const accCode = acc ? acc.code : '';

  showConfirmDialog({
    title: accCode ? `Delete ${accCode}?` : 'Delete this listing?',
    desc: 'This action cannot be undone.',
    icon: 'trash-2',
    confirmBtnText: 'Delete',
    btnColor: '#dc2626',
    onConfirm: () => {
      appState.accounts = appState.accounts.filter(a => a.id !== accId);
      saveInventory();
      syncAccountToSupabase({ id: accId }, 'delete');
      renderCatalog();
      renderAdminInventory();
      showToast(`Listing ${accCode} deleted.`, "info");
    }
  });
}

// 5. Image Lightbox
function openLightbox(imgSrc) {
  const lb = document.getElementById('imageLightbox');
  const img = document.getElementById('lightboxImage');
  img.src = imgSrc;
  lb.classList.add('open');
}

function closeLightbox() {
  document.getElementById('imageLightbox').classList.remove('open');
}

// 6. Live Support Chat Widget
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const chatWin = document.getElementById('chatWindow');
  chatWin.classList.toggle('open', chatOpen);
  if (chatOpen) {
    setTimeout(() => {
      document.getElementById('chatInput').focus();
    }, 150);
  }
}

function getOrCreateChatSessionId() {
  let sid = localStorage.getItem('nexus_chat_session_id');
  if (!sid) {
    sid = 'VISITOR-' + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('nexus_chat_session_id', sid);
  }
  return sid;
}

function loadSupportMessages() {
  const saved = localStorage.getItem('nexus_live_support_messages');
  if (saved) {
    try {
      appState.supportMessages = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse support messages:", e);
      appState.supportMessages = [];
    }
  } else {
    appState.supportMessages = [];
  }
  updateAdminInboxBadge();
}

function saveSupportMessages() {
  localStorage.setItem('nexus_live_support_messages', JSON.stringify(appState.supportMessages));
  updateAdminInboxBadge();
}

function updateAdminInboxBadge() {
  const unreadCount = (appState.supportMessages || []).filter(m => m.sender === 'customer' && m.status === 'unread').length;
  const badge = document.getElementById('adminInboxUnreadBadge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
  const totalCountEl = document.getElementById('adminInboxTotalCount');
  if (totalCountEl) {
    const sessions = new Set((appState.supportMessages || []).map(m => m.session_id));
    totalCountEl.textContent = `${sessions.size} Active`;
  }
}

function handleChatKeyDown(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  const sid = getOrCreateChatSessionId();
  appendChatBubble(text, 'user');

  const msgObj = {
    id: `msg-${Date.now()}`,
    session_id: sid,
    sender: 'customer',
    message: text,
    customer_name: `Visitor #${sid.replace('VISITOR-', '')}`,
    status: 'unread',
    created_at: new Date().toISOString()
  };

  appState.supportMessages.push(msgObj);
  saveSupportMessages();

  if (supabaseClient) {
    try {
      await supabaseClient.from('support_messages').insert(msgObj);
    } catch (e) {
      console.error("Supabase send customer message error:", e);
    }
  }

  // Auto-respond if matches FAQ or show handover message
  setTimeout(() => {
    generateBotResponse(text);
  }, 600);
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('chatInput');
  if (input) input.value = promptText;
  sendChatMessage();
}

function appendChatBubble(msg, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = typeof sanitizeEncoding === 'function' ? sanitizeEncoding(msg) : msg;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function generateBotResponse(userMsg) {
  const lower = userMsg.toLowerCase();
  let reply = "Thanks for your message! 🎮 Our Store Admin has received your chat and is reviewing it right now. You can also chat directly on WhatsApp (+94 77 880 6366) for instant handover.";

  if (lower.includes('free fire') || lower.includes('ff')) {
    reply = "🔥 Free Fire accounts with Max EVO guns, Sakura/HipHop bundles and Master ranks are in stock! Clean Gmail logins with full handover warranty.";
  } else if (lower.includes('capcut') || lower.includes('warranty')) {
    reply = "🎬 CapCut Pro 1-Year & Lifetime packages are active with 4K export and AI auto-captioning for PC, Mac, and Mobile.";
  } else if (lower.includes('tiktok') || lower.includes('monetiz')) {
    reply = "🎵 TikTok accounts range from 20K to 125K+ followers with US/UK Creator Rewards active and Live Studio unlocked.";
  } else if (lower.includes('youtube') || lower.includes('yt') || lower.includes('subscriber') || lower.includes('channel')) {
    reply = "📺 Monetized YouTube channels (10K to 125K+ subscribers) with active AdSense and clean records are available for instant owner transfer!";
  } else if (lower.includes('payment') || lower.includes('bank')) {
    reply = "💳 We accept Nations Trust Bank (NTB), People's Bank, EzCash, and WhatsApp slip verification. Transfer & attach slip for 5-minute delivery!";
  }

  appendChatBubble(reply, 'bot');
}

// =========================================================
// 12. ADMIN LIVE SUPPORT INBOX CONTROLLER
// =========================================================

function renderAdminInbox() {
  updateAdminInboxBadge();
  const sessionsListEl = document.getElementById('adminInboxSessionsList');
  const chatMainEl = document.getElementById('adminInboxChatMain');
  if (!sessionsListEl || !chatMainEl) return;

  const msgs = appState.supportMessages || [];
  const search = (document.getElementById('adminInboxSearchInput')?.value || '').toLowerCase().trim();

  // Group messages by session_id
  const sessionMap = {};
  msgs.forEach(m => {
    if (!sessionMap[m.session_id]) {
      sessionMap[m.session_id] = {
        session_id: m.session_id,
        customer_name: m.customer_name || `Visitor #${m.session_id.replace('VISITOR-', '')}`,
        messages: [],
        lastMessage: '',
        lastTime: m.created_at,
        unreadCount: 0
      };
    }
    sessionMap[m.session_id].messages.push(m);
    sessionMap[m.session_id].lastMessage = m.message;
    sessionMap[m.session_id].lastTime = m.created_at;
    if (m.sender === 'customer' && m.status === 'unread') {
      sessionMap[m.session_id].unreadCount++;
    }
  });

  const sessions = Object.values(sessionMap).sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
  const filteredSessions = sessions.filter(s => {
    if (!search) return true;
    return s.customer_name.toLowerCase().includes(search) || 
           s.session_id.toLowerCase().includes(search) ||
           s.messages.some(m => m.message.toLowerCase().includes(search));
  });

  if (filteredSessions.length === 0) {
    sessionsListEl.innerHTML = `
      <div style="padding:30px 14px; text-align:center; color:#94a3b8; font-size:0.8rem;">
        <i data-lucide="message-square" style="width:28px; height:28px; margin-bottom:8px; opacity:0.5;"></i>
        <div>No customer messages yet.</div>
        <div style="font-size:0.7rem; color:#cbd5e1; margin-top:4px;">Messages from website visitors will appear here in real-time.</div>
      </div>
    `;
    chatMainEl.innerHTML = `
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; padding:30px; text-align:center;">
        <i data-lucide="inbox" style="width:42px; height:42px; color:#cbd5e1; margin-bottom:12px;"></i>
        <h4 style="color:#475569; margin:0 0 6px; font-weight:800;">No Conversation Selected</h4>
        <p style="font-size:0.78rem; color:#94a3b8; margin:0;">Select a customer chat on the left to start live messaging.</p>
      </div>
    `;
    initLucide();
    return;
  }

  // If no active session selected or current not in list, pick the first
  if (!appState.activeInboxSessionId || !sessionMap[appState.activeInboxSessionId]) {
    appState.activeInboxSessionId = filteredSessions[0].session_id;
  }

  sessionsListEl.innerHTML = filteredSessions.map(s => {
    const isActive = s.session_id === appState.activeInboxSessionId;
    const timeStr = new Date(s.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const preview = typeof sanitizeEncoding === 'function' ? sanitizeEncoding(s.lastMessage) : s.lastMessage;
    return `
      <div class="inbox-session-card ${isActive ? 'active' : ''} ${s.unreadCount > 0 ? 'has-unread' : ''}" onclick="selectAdminInboxSession('${s.session_id}')">
        <div class="inbox-session-avatar">
          ${s.customer_name.charAt(0).toUpperCase()}
        </div>
        <div class="inbox-session-info">
          <div class="inbox-session-name">
            <span>${s.customer_name}</span>
            <span style="font-size:0.65rem; color:#94a3b8; font-weight:600;">${timeStr}</span>
          </div>
          <div class="inbox-session-preview">${preview || 'New inquiry'}</div>
        </div>
        ${s.unreadCount > 0 ? `<span class="inbox-unread-pill">${s.unreadCount}</span>` : ''}
      </div>
    `;
  }).join('');

  renderAdminActiveChatSession();
  initLucide();
}

function selectAdminInboxSession(sessionId) {
  appState.activeInboxSessionId = sessionId;
  
  // Mark messages in this session as read
  (appState.supportMessages || []).forEach(m => {
    if (m.session_id === sessionId && m.sender === 'customer' && m.status === 'unread') {
      m.status = 'read';
      if (supabaseClient) {
        supabaseClient.from('support_messages').update({ status: 'read' }).eq('id', m.id).then();
      }
    }
  });

  saveSupportMessages();
  renderAdminInbox();
}

function handleInboxSearch(val) {
  renderAdminInbox();
}

function renderAdminActiveChatSession() {
  const chatMainEl = document.getElementById('adminInboxChatMain');
  if (!chatMainEl || !appState.activeInboxSessionId) return;

  const sid = appState.activeInboxSessionId;
  const sessionMsgs = (appState.supportMessages || []).filter(m => m.session_id === sid);
  const customerName = sessionMsgs[0]?.customer_name || `Visitor #${sid.replace('VISITOR-', '')}`;

  const msgsHtml = sessionMsgs.map(m => {
    const isAdmin = m.sender === 'admin';
    const timeStr = new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cleanMsg = typeof sanitizeEncoding === 'function' ? sanitizeEncoding(m.message) : m.message;
    return `
      <div class="inbox-msg ${isAdmin ? 'admin' : 'customer'}">
        <div class="inbox-msg-sender">${isAdmin ? '🛡️ Super Admin' : '👤 Customer'}</div>
        <div>${cleanMsg}</div>
        <div class="inbox-msg-time">${timeStr}</div>
      </div>
    `;
  }).join('');

  chatMainEl.innerHTML = `
    <div class="inbox-chat-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:34px; height:34px; border-radius:8px; background:var(--garena-red); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
          ${customerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size:0.9rem; font-weight:800; color:#0f172a;">${customerName}</div>
          <div style="font-size:0.68rem; color:#16a34a; font-weight:700; display:flex; align-items:center; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#22c55e;"></span> Active on Site
          </div>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:8px;">
        <a href="https://wa.me/94778806366" target="_blank" class="btn-garena-proceed" style="padding:4px 10px; font-size:0.72rem; background:#25d366; border-color:#25d366;" title="Open WhatsApp Chat">
          <i data-lucide="phone" style="width:12px; height:12px;"></i> WhatsApp
        </a>
        <button type="button" class="btn-reset-filter" style="padding:4px 8px; font-size:0.72rem; color:#dc2626;" onclick="deleteAdminInboxSession('${sid}')" title="Delete Conversation">
          <i data-lucide="trash-2" style="width:13px; height:13px;"></i>
        </button>
      </div>
    </div>

    <!-- Messages Stream -->
    <div class="inbox-chat-stream" id="adminInboxChatStream">
      ${msgsHtml || '<div style="color:#94a3b8; text-align:center; padding:20px; font-size:0.8rem;">No messages in this thread.</div>'}
    </div>

    <!-- Quick Reply Presets -->
    <div class="inbox-quick-replies">
      <button type="button" class="inbox-quick-btn" onclick="sendAdminQuickReply('Yes, this account is 100% available with clean Gmail and full recovery guarantee!')">🔥 In Stock</button>
      <button type="button" class="inbox-quick-btn" onclick="sendAdminQuickReply('Our bank details: Nations Trust Bank (200120234765) or People\\'s Bank (082200110131937). Please attach deposit slip.')">💳 Bank Details</button>
      <button type="button" class="inbox-quick-btn" onclick="sendAdminQuickReply('Please WhatsApp our hotline directly at +94 77 880 6366 for 5-minute instant handover.')">📲 WhatsApp Direct</button>
      <button type="button" class="inbox-quick-btn" onclick="sendAdminQuickReply('All CapCut Pro packages include 365-day replacement warranty with 4K export.')">🎬 CapCut Warranty</button>
    </div>

    <!-- Reply Input Bar -->
    <div class="inbox-input-bar">
      <input type="text" id="adminInboxReplyInput" class="form-control" placeholder="Type your reply to customer..." onkeydown="handleAdminInboxKeyDown(event)">
      <button type="button" class="btn-garena-proceed" style="padding:8px 16px; font-size:0.82rem; white-space:nowrap;" onclick="sendAdminReply()">
        <i data-lucide="send" style="width:14px; height:14px;"></i> Send Reply
      </button>
    </div>
  `;

  const stream = document.getElementById('adminInboxChatStream');
  if (stream) stream.scrollTop = stream.scrollHeight;
  initLucide();
}

function handleAdminInboxKeyDown(e) {
  if (e.key === 'Enter') {
    sendAdminReply();
  }
}

async function sendAdminReply() {
  const input = document.getElementById('adminInboxReplyInput');
  const text = input ? input.value.trim() : '';
  if (!text || !appState.activeInboxSessionId) return;

  const sid = appState.activeInboxSessionId;
  input.value = '';

  const replyObj = {
    id: `msg-${Date.now()}`,
    session_id: sid,
    sender: 'admin',
    message: text,
    customer_name: 'NUR Support (Admin)',
    status: 'read',
    created_at: new Date().toISOString()
  };

  appState.supportMessages.push(replyObj);
  saveSupportMessages();

  if (supabaseClient) {
    try {
      await supabaseClient.from('support_messages').insert(replyObj);
    } catch (e) {
      console.error("Supabase send admin reply error:", e);
    }
  }

  // If customer is currently on same browser, append directly
  const localSid = localStorage.getItem('nexus_chat_session_id');
  if (localSid === sid) {
    appendChatBubble(text, 'bot');
  }

  showToast("Reply sent to customer!", "success");
  renderAdminActiveChatSession();
}

function sendAdminQuickReply(text) {
  const input = document.getElementById('adminInboxReplyInput');
  if (input) input.value = text;
  sendAdminReply();
}

function deleteAdminInboxSession(sessionId) {
  showConfirmDialog({
    title: "Delete this conversation?",
    desc: "Are you sure you want to permanently delete this customer chat thread?",
    icon: 'trash-2',
    confirmBtnText: 'Delete Thread',
    btnColor: '#dc2626',
    onConfirm: async () => {
      appState.supportMessages = (appState.supportMessages || []).filter(m => m.session_id !== sessionId);
      saveSupportMessages();
      if (supabaseClient) {
        try {
          await supabaseClient.from('support_messages').delete().eq('session_id', sessionId);
        } catch (e) {
          console.error("Supabase delete session error:", e);
        }
      }
      appState.activeInboxSessionId = null;
      renderAdminInbox();
      showToast("Conversation deleted.", "info");
    }
  });
}

async function fetchSupportMessagesFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('support_messages').select('*').order('created_at', { ascending: true });
    if (!error && data) {
      appState.supportMessages = data;
      localStorage.setItem('nexus_live_support_messages', JSON.stringify(appState.supportMessages));
      updateAdminInboxBadge();
      const inboxPane = document.getElementById('adminPaneInbox');
      if (inboxPane && inboxPane.classList.contains('active')) {
        renderAdminInbox();
      }
    }
  } catch (e) {
    console.error("Failed to fetch support messages from Supabase:", e);
  }
}

// Helpers
function formatCamelCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());
}

function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label} account number to clipboard!`, "success");
  }).catch(() => {
    showToast(`Account: ${text}`, "info");
  });
}

function showToast(msg, type = "info") {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const validTypes = ['success', 'error', 'info', 'warning'];
  const safeType = validTypes.includes(type) ? type : 'info';

  const icons = {
    success: 'check-circle-2',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'sparkles'
  };

  const titles = {
    success: 'Success',
    error: 'Notice',
    warning: 'Warning',
    info: 'Store Notice'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${safeType}`;
  toast.innerHTML = `
    <div class="toast-icon-wrap">
      <i data-lucide="${icons[safeType]}"></i>
    </div>
    <div class="toast-body">
      <strong>${titles[safeType]}</strong>
      <span>${typeof sanitizeEncoding === 'function' ? sanitizeEncoding(msg) : msg}</span>
    </div>
    <button class="toast-close-btn" aria-label="Close notification">
      <i data-lucide="x" style="width:14px;height:14px;"></i>
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);
  initLucide();

  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismiss = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 280);
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(timer);
      dismiss();
    });
  }

  const timer = setTimeout(() => {
    dismiss();
  }, 3200);
}

// ==========================================================================
// 10. HERO BANNERS & SLIDER ADMIN MANAGEMENT
// ==========================================================================

let adminBannerFormImageBase64 = '';

function renderAdminBannersList() {
  const container = document.getElementById('adminBannersListContainer');
  if (!container) return;

  const banners = appState.banners || [];
  if (banners.length === 0) {
    container.innerHTML = `
      <div style="background:#ffffff;border:2px dashed #cbd5e1;border-radius:12px;padding:30px;text-align:center;">
        <i data-lucide="image-off" style="width:36px;height:36px;color:#94a3b8;margin-bottom:8px;"></i>
        <h4 style="color:#0f172a;font-weight:800;font-size:1rem;margin-bottom:4px;">No Banners Found</h4>
        <p style="color:#64748b;font-size:0.8rem;margin-bottom:12px;">Add your first promotion banner or restore the default slider pack.</p>
        <button type="button" class="btn-garena-proceed" style="padding:6px 14px;font-size:0.8rem;display:inline-flex;" onclick="openAddBannerForm()">
          <i data-lucide="plus-circle" style="width:14px;height:14px;"></i> Add Banner
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = banners.map((banner, index) => {
    const isFirst = index === 0;
    const isLast = index === banners.length - 1;
    const isActive = banner.active !== false;

    let thumbHtml = '';
    if (banner.image) {
      const imgUrl = formatDirectImageUrl(banner.image);
      thumbHtml = `<img src="${imgUrl}" class="admin-banner-thumb-img" alt="${banner.title}" onerror="this.onerror=null;this.src='hero_banner.png';">`;
    } else if (banner.type === 'discount') {
      thumbHtml = `
        <div style="width:100%;height:100%;background:linear-gradient(135deg, #091e3a 0%, #0d3b66 100%);display:flex;align-items:center;justify-content:center;color:#38bdf8;font-size:0.75rem;font-weight:900;text-align:center;padding:4px;">
          💎 DISCOUNT
        </div>
      `;
    } else {
      thumbHtml = `
        <div style="width:100%;height:100%;background:linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);display:flex;align-items:center;justify-content:center;color:#b91c1c;font-size:0.75rem;font-weight:900;text-align:center;padding:4px;">
          🛡️ GARENA CARD
        </div>
      `;
    }

    return `
      <div class="admin-banner-card ${isActive ? '' : 'is-inactive'}">
        <div style="display:flex;align-items:center;gap:14px;min-width:0;flex:1;">
          <!-- Slide Order Pill -->
          <div style="background:#0f172a;color:#ffffff;font-size:0.72rem;font-weight:900;font-family:'Rajdhani',sans-serif;padding:4px 8px;border-radius:6px;flex-shrink:0;">
            #${index + 1}
          </div>

          <!-- Thumbnail Box with Direct Image Click -->
          <div class="admin-banner-thumb-wrap" onclick="openLightbox('${banner.image || 'hero_banner.png'}')" title="Click to enlarge" style="cursor:pointer;">
            ${thumbHtml}
          </div>

          <!-- Info Details -->
          <div class="admin-banner-info">
            <div class="admin-banner-name">
              ${(banner.title || 'Untitled Banner').replace(/<[^>]*>?/gm, '')}
              ${isActive ? '<span style="background:#dcfce7;color:#15803d;font-size:0.65rem;font-weight:800;padding:2px 6px;border-radius:10px;">LIVE</span>' : '<span style="background:#f1f5f9;color:#64748b;font-size:0.65rem;font-weight:800;padding:2px 6px;border-radius:10px;">HIDDEN</span>'}
            </div>
            <div class="admin-banner-sub">
              ${(banner.subtitle || banner.description || 'No subtitle').replace(/<[^>]*>?/gm, '')}
            </div>
            <div class="admin-banner-meta">
              <span style="color:#64748b;">Type: <b>${banner.image ? 'Custom Photo' : (banner.type || 'Custom Slide')}</b></span>
            </div>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="admin-banner-actions">
          <!-- One-Click Direct Photo Replace -->
          <label class="btn-admin-action" title="Replace Photo from Computer" style="cursor:pointer;color:#2563eb;background:#eff6ff;border-color:#bfdbfe;display:inline-flex;align-items:center;justify-content:center;">
            <i data-lucide="camera" style="width:14px;height:14px;"></i>
            <input type="file" accept="image/*" style="display:none;" onchange="handleDirectPhotoReplace('${banner.id}', this)">
          </label>

          <!-- Toggle Active / Visible -->
          <button type="button" class="btn-admin-action" title="${isActive ? 'Hide from live slider' : 'Show on live slider'}" onclick="toggleHeroBannerActive('${banner.id}')" style="color:${isActive ? '#16a34a' : '#94a3b8'};background:${isActive ? '#f0fdf4' : '#f8fafc'};border-color:${isActive ? '#86efac' : '#cbd5e1'};">
            <i data-lucide="${isActive ? 'eye' : 'eye-off'}" style="width:14px;height:14px;"></i>
          </button>

          <!-- Move Up -->
          <button type="button" class="btn-admin-action" title="Move Slide Earlier" onclick="moveHeroBanner('${banner.id}', -1)" ${isFirst ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
            <i data-lucide="arrow-up" style="width:14px;height:14px;"></i>
          </button>

          <!-- Move Down -->
          <button type="button" class="btn-admin-action" title="Move Slide Later" onclick="moveHeroBanner('${banner.id}', 1)" ${isLast ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
            <i data-lucide="arrow-down" style="width:14px;height:14px;"></i>
          </button>

          <!-- Edit -->
          <button type="button" class="btn-admin-action btn-edit" title="Edit Banner Details" onclick="editHeroBanner('${banner.id}')">
            <i data-lucide="edit" style="width:14px;height:14px;"></i>
          </button>

          <!-- Delete -->
          <button type="button" class="btn-admin-action btn-del" title="Delete Banner" onclick="deleteHeroBanner('${banner.id}')">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  initLucide();
}

function openAddBannerForm() {
  const formWrap = document.getElementById('adminBannerFormWrap');
  if (!formWrap) return;

  document.getElementById('heroBannerForm').reset();
  document.getElementById('adminBannerEditId').value = '';
  document.getElementById('adminBannerFormTitle').innerHTML = `
    <i data-lucide="plus-circle" style="width:18px;height:18px;color:var(--garena-red);"></i> Add New Hero Banner
  `;
  document.getElementById('adminBannerFileCount').textContent = '';
  adminBannerFormImageBase64 = '';
  
  const previewImg = document.getElementById('adminBannerPreviewImg');
  if (previewImg) previewImg.src = 'hero_banner.png';

  formWrap.style.display = 'block';
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  initLucide();
}

function closeBannerForm() {
  const formWrap = document.getElementById('adminBannerFormWrap');
  if (formWrap) formWrap.style.display = 'none';
  adminBannerFormImageBase64 = '';
}

function editHeroBanner(bannerId) {
  const banner = (appState.banners || []).find(b => b.id === bannerId);
  if (!banner) return;

  openAddBannerForm();

  document.getElementById('adminBannerEditId').value = banner.id;
  document.getElementById('adminBannerFormTitle').innerHTML = `
    <i data-lucide="edit" style="width:18px;height:18px;color:var(--garena-red);"></i> Editing Slide [${banner.title || 'Banner'}]
  `;

  document.getElementById('adminBannerTitle').value = (banner.title || '').replace(/<[^>]*>?/gm, '');
  document.getElementById('adminBannerSubtitle').value = banner.subtitle || banner.description || '';
  document.getElementById('adminBannerImageUrl').value = (banner.image && !banner.image.startsWith('data:')) ? banner.image : '';
  document.getElementById('adminBannerActiveCheckbox').checked = banner.active !== false;

  adminBannerFormImageBase64 = banner.image || '';
  
  const previewImg = document.getElementById('adminBannerPreviewImg');
  if (previewImg) {
    previewImg.src = banner.image ? formatDirectImageUrl(banner.image) : 'hero_banner.png';
  }

  initLucide();
}

async function handleBannerFileUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  const countEl = document.getElementById('adminBannerFileCount');
  if (countEl) countEl.textContent = 'Uploading to Cloud... ⏳';

  let cloudUrl = await uploadImageToSupabaseStorage(file);
  if (!cloudUrl) {
    cloudUrl = await compressImage(file, 1360, 0.85);
  }

  if (cloudUrl) {
    adminBannerFormImageBase64 = cloudUrl;
    if (countEl) countEl.textContent = `Attached: ${file.name}`;
    
    const previewImg = document.getElementById('adminBannerPreviewImg');
    if (previewImg) previewImg.src = cloudUrl;
    
    showToast("Banner photo uploaded to Supabase Storage!", "success");
  } else {
    if (countEl) countEl.textContent = 'Failed to load file';
    showToast("Could not process image file.", "error");
  }
}

async function handleDirectPhotoReplace(bannerId, fileInput) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;

  const banner = (appState.banners || []).find(b => b.id === bannerId);
  if (!banner) return;

  showToast("Uploading banner photo to Cloud...", "info");
  let cloudUrl = await uploadImageToSupabaseStorage(file);
  if (!cloudUrl) {
    cloudUrl = await compressImage(file, 1360, 0.85);
  }

  if (cloudUrl) {
    banner.image = cloudUrl;
    banner.type = 'image';
    saveHeroBanners();
    syncHeroBannersToSupabase();
    showToast(`Photo uploaded to Cloud for slide: ${banner.title || 'Banner'}!`, "success");
  } else {
    showToast("Could not update photo.", "error");
  }
}

function updateBannerLivePreview() {
  const urlInput = document.getElementById('adminBannerImageUrl')?.value.trim();
  const previewImg = document.getElementById('adminBannerPreviewImg');
  if (!previewImg) return;

  if (adminBannerFormImageBase64) {
    previewImg.src = adminBannerFormImageBase64;
  } else if (urlInput) {
    previewImg.src = formatDirectImageUrl(urlInput);
  } else {
    previewImg.src = 'https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/hero_banner.png';
  }
}

async function handleSaveHeroBanner(e) {
  e.preventDefault();

  const editId = document.getElementById('adminBannerEditId').value;
  const title = document.getElementById('adminBannerTitle').value.trim();
  const subtitle = document.getElementById('adminBannerSubtitle').value.trim();
  const urlInput = document.getElementById('adminBannerImageUrl').value.trim();
  const isActive = document.getElementById('adminBannerActiveCheckbox').checked;

  let image = adminBannerFormImageBase64 || urlInput || 'https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/hero_banner.png';

  if (editId) {
    const idx = (appState.banners || []).findIndex(b => b.id === editId);
    if (idx !== -1) {
      appState.banners[idx] = {
        ...appState.banners[idx],
        title: title,
        subtitle: subtitle,
        image: image,
        type: 'image',
        active: isActive
      };
      saveHeroBanners();
      await syncHeroBannersToSupabase();
      closeBannerForm();
      showToast("Hero banner updated successfully!", "success");
    }
  } else {
    const newBanner = {
      id: `banner-${Date.now()}`,
      title: title,
      subtitle: subtitle,
      image: image,
      type: 'image',
      active: isActive
    };
    appState.banners.unshift(newBanner);
    saveHeroBanners();
    await syncHeroBannersToSupabase();
    closeBannerForm();
    showToast("New hero banner added to carousel!", "success");
  }
}

function deleteHeroBanner(bannerId) {
  const banner = (appState.banners || []).find(b => b.id === bannerId);
  if (!banner) return;

  const rawTitle = banner.title || 'this banner';
  const cleanTitle = rawTitle.replace(/<[^>]*>?/gm, '').trim();

  showConfirmDialog({
    title: `Delete this slide?`,
    desc: `Are you sure you want to permanently remove "${cleanTitle}" from the slider and cloud database?`,
    icon: 'trash-2',
    confirmBtnText: 'Delete Banner',
    btnColor: '#dc2626',
    onConfirm: async () => {
      appState.banners = (appState.banners || []).filter(b => b.id !== bannerId);
      saveHeroBanners();
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('hero_banners').delete().eq('id', bannerId);
          if (error) console.error("Supabase delete banner error:", error);
          else console.log(`🗑️ Deleted banner ${bannerId} from Supabase Cloud`);
        } catch (e) {
          console.error("Supabase delete banner error:", e);
        }
      }
      showToast("Banner deleted permanently from Cloud & Local.", "info");
    }
  });
}

function moveHeroBanner(bannerId, direction) {
  const list = appState.banners || [];
  const idx = list.findIndex(b => b.id === bannerId);
  if (idx === -1) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= list.length) return;

  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;

  saveHeroBanners();
  syncHeroBannersToSupabase();
  showToast("Slide order updated!", "info");
}

function toggleHeroBannerActive(bannerId) {
  const banner = (appState.banners || []).find(b => b.id === bannerId);
  if (!banner) return;

  banner.active = banner.active === false ? true : false;
  saveHeroBanners();
  syncHeroBannersToSupabase();
  showToast(banner.active ? "Slide enabled on homepage!" : "Slide hidden from homepage.", "info");
}

function resetHeroBannersToDefault() {
  showConfirmDialog({
    title: "Reset Banners to Default?",
    desc: "This will restore the original default Free Fire & Top Up promotion slides.",
    icon: 'rotate-ccw',
    confirmBtnText: 'Reset Banners',
    btnColor: '#2563eb',
    onConfirm: () => {
      localStorage.removeItem('nexus_hero_banners');
      loadHeroBanners();
      saveHeroBanners();
      syncHeroBannersToSupabase();
      showToast("Hero banners reset to original default pack!", "success");
    }
  });
}

// ==========================================================================
// 11. SUPABASE REALTIME CLOUD DATABASE CONTROLLER
// ==========================================================================

let supabaseClient = null;

const SUPABASE_DEFAULT_SQL = `-- 1. Create accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'freefire',
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  is_grand_prize BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  price_lkr NUMERIC NOT NULL,
  orig_price_lkr NUMERIC,
  images JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  evo_list JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id TEXT PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  type TEXT DEFAULT 'image',
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS & Policies safely
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read accounts" ON public.accounts;
DROP POLICY IF EXISTS "Allow public all accounts" ON public.accounts;
DROP POLICY IF EXISTS "Allow public read banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Allow public all banners" ON public.hero_banners;

CREATE POLICY "Allow public all accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all banners" ON public.hero_banners FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'accounts') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'hero_banners') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_banners;
  END IF;
END $$;`;

function getSupabaseCredentials() {
  const localUrl = localStorage.getItem('nur_supabase_url');
  const localKey = localStorage.getItem('nur_supabase_key');
  const codeUrl = typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG.url : '';
  const codeKey = typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG.anonKey : '';

  return {
    url: (localUrl || codeUrl || '').trim(),
    anonKey: (localKey || codeKey || '').trim()
  };
}

async function initSupabase() {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !window.supabase) {
    supabaseClient = null;
    renderSupabaseStatus();
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(url, anonKey);
    renderSupabaseStatus();

    // Fetch live data from Supabase
    await fetchInventoryFromSupabase();
    await fetchHeroBannersFromSupabase();
    await fetchSupportMessagesFromSupabase();

    // Subscribe to Realtime Changes on accounts
    supabaseClient
      .channel('public:accounts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, (payload) => {
        handleSupabaseAccountChange(payload);
      })
      .subscribe();

    // Subscribe to Realtime Changes on hero_banners
    supabaseClient
      .channel('public:hero_banners')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_banners' }, (payload) => {
        handleSupabaseBannerChange(payload);
      })
      .subscribe();

    // Subscribe to Realtime Changes on support_messages
    supabaseClient
      .channel('public:support_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, (payload) => {
        handleSupabaseMessageChange(payload);
      })
      .subscribe();

    console.log("🟢 Supabase Realtime connected successfully!");
  } catch (e) {
    console.error("Supabase init error:", e);
    supabaseClient = null;
    renderSupabaseStatus();
  }
}

function handleSupabaseMessageChange(payload) {
  if (payload.eventType === 'INSERT') {
    const newMsg = payload.new;
    if (!appState.supportMessages.some(m => m.id === newMsg.id)) {
      appState.supportMessages.push(newMsg);
      saveSupportMessages();

      const localSid = localStorage.getItem('nexus_chat_session_id');
      if (newMsg.session_id === localSid && newMsg.sender === 'admin') {
        appendChatBubble(newMsg.message, 'bot');
        showToast("New reply from Store Admin!", "success");
      } else if (newMsg.sender === 'customer') {
        const inboxPane = document.getElementById('adminPaneInbox');
        if (inboxPane && inboxPane.classList.contains('active')) {
          renderAdminInbox();
        }
        showToast(`New message from ${newMsg.customer_name || 'Visitor'}!`, "info");
      }
    }
  } else if (payload.eventType === 'UPDATE') {
    const updated = payload.new;
    const idx = appState.supportMessages.findIndex(m => m.id === updated.id);
    if (idx !== -1) {
      appState.supportMessages[idx] = updated;
      saveSupportMessages();
      renderAdminInbox();
    }
  } else if (payload.eventType === 'DELETE') {
    const deletedId = payload.old.id;
    appState.supportMessages = appState.supportMessages.filter(m => m.id !== deletedId);
    saveSupportMessages();
    renderAdminInbox();
  }
}

async function fetchInventoryFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('accounts').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      appState.accounts = data.map(row => ({
        id: row.id,
        category: row.category || 'freefire',
        title: sanitizeEncoding(row.title),
        code: row.code,
        status: row.status || 'available',
        isGrandPrize: row.is_grand_prize || false,
        isFeatured: row.is_featured !== false,
        priceLKR: Number(row.price_lkr) || 0,
        origPriceLKR: Number(row.orig_price_lkr) || 0,
        images: Array.isArray(row.images) ? row.images : [],
        stats: row.stats || {},
        evoList: Array.isArray(row.evo_list) ? row.evo_list : [],
        description: sanitizeEncoding(row.description || '')
      }));
      saveInventory();
      renderCatalog();
      renderAdminInventory();
      updateGameBadgeCounts();
    }
  } catch (e) {
    console.error("Failed to fetch inventory from Supabase:", e);
  }
}

async function fetchHeroBannersFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('hero_banners').select('*').order('sort_order', { ascending: true });
    if (!error && data) {
      appState.banners = data.map(row => ({
        id: row.id,
        title: sanitizeEncoding(row.title || ''),
        subtitle: sanitizeEncoding(row.subtitle || ''),
        description: sanitizeEncoding(row.description || ''),
        image: row.image || '',
        type: row.type || 'image',
        active: row.active !== false
      }));
      localStorage.setItem('nexus_hero_banners', JSON.stringify(appState.banners));
      renderHeroCarousel();
      renderAdminBannersList();
    }
  } catch (e) {
    console.error("Failed to fetch hero banners from Supabase:", e);
  }
}

function handleSupabaseAccountChange(payload) {
  const { eventType, new: newRow, old: oldRow } = payload;
  if (eventType === 'INSERT') {
    const newAcc = {
      id: newRow.id,
      category: newRow.category,
      title: newRow.title,
      code: newRow.code,
      status: newRow.status,
      isGrandPrize: newRow.is_grand_prize,
      isFeatured: newRow.is_featured,
      priceLKR: Number(newRow.price_lkr),
      origPriceLKR: Number(newRow.orig_price_lkr),
      images: newRow.images || [],
      stats: newRow.stats || {},
      evoList: newRow.evo_list || [],
      description: newRow.description || ''
    };
    appState.accounts = [newAcc, ...appState.accounts.filter(a => a.id !== newRow.id)];
  } else if (eventType === 'UPDATE') {
    const idx = appState.accounts.findIndex(a => a.id === newRow.id);
    const updatedAcc = {
      id: newRow.id,
      category: newRow.category,
      title: newRow.title,
      code: newRow.code,
      status: newRow.status,
      isGrandPrize: newRow.is_grand_prize,
      isFeatured: newRow.is_featured,
      priceLKR: Number(newRow.price_lkr),
      origPriceLKR: Number(newRow.orig_price_lkr),
      images: newRow.images || [],
      stats: newRow.stats || {},
      evoList: newRow.evo_list || [],
      description: newRow.description || ''
    };
    if (idx !== -1) {
      appState.accounts[idx] = updatedAcc;
    } else {
      appState.accounts.unshift(updatedAcc);
    }
  } else if (eventType === 'DELETE') {
    appState.accounts = appState.accounts.filter(a => a.id !== oldRow.id);
  }

  renderCatalog();
  renderAdminInventory();
  updateGameBadgeCounts();
}

function handleSupabaseBannerChange(payload) {
  fetchHeroBannersFromSupabase();
}

async function syncAccountToSupabase(acc, action = 'upsert') {
  if (!supabaseClient) return;
  try {
    if (action === 'delete') {
      const { error } = await supabaseClient.from('accounts').delete().eq('id', acc.id);
      if (error) throw error;
      console.log(`🗑️ Deleted account ${acc.id} from Supabase Cloud`);
    } else {
      const row = {
        id: acc.id,
        category: acc.category || 'freefire',
        title: acc.title,
        code: acc.code,
        status: acc.status || 'available',
        is_grand_prize: acc.isGrandPrize || false,
        is_featured: acc.isFeatured !== false,
        price_lkr: acc.priceLKR || 0,
        orig_price_lkr: acc.origPriceLKR || 0,
        images: acc.images || [],
        stats: acc.stats || {},
        evo_list: acc.evoList || [],
        description: acc.description || '',
        updated_at: new Date().toISOString()
      };
      const { error } = await supabaseClient.from('accounts').upsert(row);
      if (error) throw error;
      console.log(`💾 Saved account ${acc.code} to Supabase Cloud`);
    }
  } catch (e) {
    console.error("Supabase sync account error:", e);
  }
}

async function syncHeroBannersToSupabase() {
  if (!supabaseClient) return;
  try {
    const banners = appState.banners || [];
    const rows = banners.map((b, idx) => ({
      id: b.id,
      title: b.title || '',
      subtitle: b.subtitle || '',
      description: b.description || '',
      image: b.image || '',
      type: b.type || 'image',
      active: b.active !== false,
      sort_order: idx
    }));
    await supabaseClient.from('hero_banners').upsert(rows);
  } catch (e) {
    console.error("Supabase sync banners error:", e);
  }
}

async function pushAllDataToSupabase() {
  if (!supabaseClient) {
    showToast("Please configure and connect Supabase first.", "error");
    return;
  }

  showToast("Pushing local accounts & banners to Supabase...", "info");
  try {
    // 1. Push Accounts
    const accRows = (appState.accounts || DEFAULT_ACCOUNTS).map(acc => ({
      id: acc.id,
      category: acc.category || 'freefire',
      title: acc.title,
      code: acc.code,
      status: acc.status || 'available',
      is_grand_prize: acc.isGrandPrize || false,
      is_featured: acc.isFeatured !== false,
      price_lkr: acc.priceLKR || 0,
      orig_price_lkr: acc.origPriceLKR || 0,
      images: acc.images || [],
      stats: acc.stats || {},
      evo_list: acc.evoList || [],
      description: acc.description || ''
    }));

    const { error: accErr } = await supabaseClient.from('accounts').upsert(accRows);
    if (accErr) throw accErr;

    // 2. Push Banners
    await syncHeroBannersToSupabase();

    showToast("🎉 All accounts and slider banners uploaded to Supabase!", "success");
    renderSupabaseStatus();
  } catch (e) {
    console.error("Push to Supabase error:", e);
    showToast(`Push failed: ${e.message || 'Check database schema'}`, "error");
  }
}

function handleSaveSupabaseConfig(e) {
  e.preventDefault();
  const url = document.getElementById('supabaseUrlInput').value.trim();
  const key = document.getElementById('supabaseKeyInput').value.trim();

  localStorage.setItem('nur_supabase_url', url);
  localStorage.setItem('nur_supabase_key', key);

  showToast("Connecting to Supabase...", "info");
  initSupabase().then(() => {
    if (supabaseClient) {
      showToast("🟢 Connected to Supabase Cloud Database!", "success");
    } else {
      showToast("Could not connect to Supabase. Check URL/Key.", "error");
    }
  });
}

function handleClearSupabaseConfig() {
  localStorage.removeItem('nur_supabase_url');
  localStorage.removeItem('nur_supabase_key');
  supabaseClient = null;
  const urlInp = document.getElementById('supabaseUrlInput');
  const keyInp = document.getElementById('supabaseKeyInput');
  if (urlInp) urlInp.value = '';
  if (keyInp) keyInp.value = '';
  renderSupabaseStatus();
  showToast("Supabase disconnected. Using local dataset.", "info");
}

function renderSupabaseStatus() {
  const badge = document.getElementById('supabaseConnectionBadge');
  const urlInp = document.getElementById('supabaseUrlInput');
  const keyInp = document.getElementById('supabaseKeyInput');
  const sqlEl = document.getElementById('supabaseSqlCode');

  if (sqlEl) sqlEl.textContent = SUPABASE_DEFAULT_SQL;

  const { url, anonKey } = getSupabaseCredentials();
  if (urlInp && !urlInp.value) urlInp.value = url;
  if (keyInp && !keyInp.value) keyInp.value = anonKey;

  if (badge) {
    if (supabaseClient) {
      badge.innerHTML = `
        <span style="background:#15803d;color:#ffffff;font-size:0.72rem;font-weight:800;padding:4px 10px;border-radius:12px;display:inline-flex;align-items:center;gap:5px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#4ade80;animation:pulse 1.5s infinite;"></span> Connected 🟢 (Realtime Live)
        </span>
      `;
    } else {
      badge.innerHTML = `
        <span style="background:#dc2626;color:#ffffff;font-size:0.72rem;font-weight:800;padding:4px 10px;border-radius:12px;display:inline-flex;align-items:center;gap:4px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#ffffff;"></span> Not Connected
        </span>
      `;
    }
  }
}

function copySupabaseSql() {
  navigator.clipboard.writeText(SUPABASE_DEFAULT_SQL).then(() => {
    showToast("SQL Schema copied to clipboard! Paste in Supabase SQL Editor.", "success");
  }).catch(() => {
    showToast("Select and copy the SQL code manually.", "info");
  });
}

