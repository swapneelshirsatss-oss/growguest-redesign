/**
 * GROWGUEST — MODERN INTERACTION & ROI ENGINE
 * Handles: Live ROI Calculator, Dynamic Sliders, Service Prefills, 
 * FAQ Accordion, WhatsApp Lead Formatting, Mobile Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. STICKY HEADER SCROLL SHADOW ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- 2. MOBILE MENU DRAWER ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.classList.toggle('active');
    });

    // Close when clicking any nav link inside drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. INDIAN CURRENCY FORMATTER ---
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // --- 4. INTERACTIVE DIRECT BOOKING ROI CALCULATOR ---
  const revenueSlider = document.getElementById('calc-revenue');
  const otaShareSlider = document.getElementById('calc-ota-share');
  const otaFeeSlider = document.getElementById('calc-ota-fee');
  const shiftSlider = document.getElementById('calc-shift');

  const revenueOut = document.getElementById('val-revenue');
  const otaShareOut = document.getElementById('val-ota-share');
  const otaFeeOut = document.getElementById('val-ota-fee');
  const shiftOut = document.getElementById('val-shift');

  const monthlySavingsEl = document.getElementById('res-monthly-savings');
  const annualSavingsEl = document.getElementById('res-annual-savings');
  const formulaDetailEl = document.getElementById('res-formula-detail');

  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #dfad3c 0%, #dfad3c ${percent}%, #1c3d31 ${percent}%, #1c3d31 100%)`;
  }

  function calculateROI() {
    if (!revenueSlider) return;

    const revenue = parseFloat(revenueSlider.value) || 0;
    const otaShare = parseFloat(otaShareSlider.value) || 0;
    const otaFee = parseFloat(otaFeeSlider.value) || 0;
    const shiftPercent = parseFloat(shiftSlider.value) || 0;

    // Update Output badges
    if (revenueOut) revenueOut.textContent = formatINR(revenue);
    if (otaShareOut) otaShareOut.textContent = `${otaShare}%`;
    if (otaFeeOut) otaFeeOut.textContent = `${otaFee}%`;
    if (shiftOut) shiftOut.textContent = `${shiftPercent}%`;

    // Visual Slider Track Update
    updateSliderFill(revenueSlider);
    updateSliderFill(otaShareSlider);
    updateSliderFill(otaFeeSlider);
    updateSliderFill(shiftSlider);

    // Math:
    // Monthly OTA Revenue = revenue * (otaShare / 100)
    // Shifted Revenue to Direct = Monthly OTA Revenue * (shiftPercent / 100)
    // Monthly Commission Avoided = Shifted Revenue * (otaFee / 100)
    const monthlyOtaRev = revenue * (otaShare / 100);
    const shiftedRevenue = monthlyOtaRev * (shiftPercent / 100);
    const monthlySaved = shiftedRevenue * (otaFee / 100);
    const annualSaved = monthlySaved * 12;

    if (monthlySavingsEl) {
      monthlySavingsEl.textContent = formatINR(monthlySaved) + ' / mo';
    }

    if (annualSavingsEl) {
      annualSavingsEl.textContent = formatINR(annualSaved) + ' / yr';
    }

    if (formulaDetailEl) {
      formulaDetailEl.textContent = `${formatINR(revenue)} revenue × ${otaShare}% OTA share × ${shiftPercent}% shifted to direct × ${otaFee}% commission rate saved.`;
    }
  }

  [revenueSlider, otaShareSlider, otaFeeSlider, shiftSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculateROI);
      updateSliderFill(slider);
    }
  });

  calculateROI();

  // --- 5. SERVICE CLICK TO AUDIT PRE-FILL ---
  const serviceCards = document.querySelectorAll('.service-card[data-service]');
  const goalSelect = document.getElementById('audit-goal');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceName = card.getAttribute('data-service');
      if (goalSelect && serviceName) {
        goalSelect.value = serviceName;
      }
      const auditSection = document.getElementById('audit');
      if (auditSection) {
        auditSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Calculator CTA pre-fill
  const calcCta = document.getElementById('calc-to-audit-btn');
  if (calcCta && goalSelect) {
    calcCta.addEventListener('click', (e) => {
      e.preventDefault();
      goalSelect.value = "Direct Booking vs OTA Strategy";
      const auditSection = document.getElementById('audit');
      if (auditSection) {
        auditSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 6. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --- 7. AUDIT FORM TO WHATSAPP SUBMISSION ---
  const auditForm = document.getElementById('audit-form');
  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(auditForm);

      const name = (formData.get('name') || '').toString().trim();
      const property = (formData.get('property') || '').toString().trim();
      const type = (formData.get('type') || '').toString().trim();
      const rooms = (formData.get('rooms') || '').toString().trim();
      const website = (formData.get('website') || '').toString().trim();
      const goal = (formData.get('goal') || '').toString().trim();

      const messageLines = [
        "🏨 *GrowGuest Free Direct Booking Audit Request*",
        "-----------------------------------",
        `*Owner / Manager:* ${name}`,
        `*Property & City:* ${property}`,
        `*Property Type:* ${type}`,
        `*Total Room Keys:* ${rooms || 'Not specified'}`,
        `*Website / Google Maps:* ${website || 'Not provided yet'}`,
        `*Primary Focus:* ${goal}`,
        "-----------------------------------",
        "Hi Swapneel, please review our property details and share practical audit recommendations to reduce our OTA commission bleed."
      ];

      const whatsappText = encodeURIComponent(messageLines.join('\n'));
      const whatsappUrl = `https://wa.me/918956907343?text=${whatsappText}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
