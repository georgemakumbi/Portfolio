/* ============================================
   MAKUMBI GEORGE - Portfolio JavaScript
   ============================================ */

'use strict';

// ─── THEME MANAGER ──────────────────────────
const ThemeManager = (() => {
  const STORAGE_KEY = 'mg-portfolio-theme';
  const btn = document.getElementById('themeToggle');
  const icon = btn?.querySelector('i');

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  };

  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved || preferred);

    btn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
  };

  return { init };
})();

// ─── NAVBAR ─────────────────────────────────
const Navbar = (() => {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
    highlightActiveLink();
  };

  const highlightActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  const toggleMenu = () => {
    hamburger?.classList.toggle('active');
    navMenu?.classList.toggle('open');
    document.body.style.overflow = navMenu?.classList.contains('open') ? 'hidden' : '';
  };

  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger?.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    handleScroll();
  };

  return { init };
})();

// ─── PARTICLES ──────────────────────────────
const Particles = (() => {
  const container = document.getElementById('heroParticles');

  const create = () => {
    if (!container) return;
    const count = window.innerWidth < 768 ? 12 : 25;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 8;
      const duration = Math.random() * 10 + 8;
      const left = Math.random() * 100;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;
      container.appendChild(p);
    }
  };

  return { create };
})();

// ─── TYPED ANIMATION (Fallback) ─────────────
const TypedText = (() => {
  const texts = [
    '⌨ Full Stack Developer',
    '🗄 Database Administrator',
    '🗺 GIS Specialist',
    '🖥 Systems Administrator'
  ];
  let index = 0;
  let charIndex = 0;
  let isDeleting = false;
  const el = document.getElementById('typedText');

  const type = () => {
    if (!el) return;
    const current = texts[index];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
    } else {
      el.textContent = current.substring(0, charIndex++);
    }

    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === current.length + 1) {
      isDeleting = true;
      speed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      index = (index + 1) % texts.length;
      speed = 400;
    }
    setTimeout(type, speed);
  };

  const init = () => { if (el) setTimeout(type, 1000); };
  return { init };
})();

// ─── SCROLL ANIMATIONS ──────────────────────
const ScrollAnimations = (() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bars
        const fills = entry.target.querySelectorAll('.skill-bar-fill[data-width]');
        fills.forEach(fill => {
          fill.style.width = fill.getAttribute('data-width');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const init = () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Skill bars observer
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill[data-width]').forEach(fill => {
            fill.style.width = fill.getAttribute('data-width');
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category-card').forEach(card => skillObserver.observe(card));
  };

  return { init };
})();

// ─── COUNTER ANIMATION ──────────────────────
const CounterAnimation = (() => {
  const animateCounter = (el, target, duration = 2000) => {
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
  };

  const init = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-count]');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            animateCounter(counter, target);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));
  };

  return { init };
})();

// ─── PROJECT FILTER ──────────────────────────
const ProjectFilter = (() => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  const init = () => {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const matches = filter === 'all' || card.dataset.category === filter;
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (matches) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.display = 'flex';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (btn.classList.contains('active') && card.dataset.category !== filter && filter !== 'all') {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  };

  return { init };
})();

// ─── TESTIMONIALS SLIDER ─────────────────────
const TestimonialSlider = (() => {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let current = 0;
  let interval;

  const getVisible = () => window.innerWidth < 768 ? 1 : 2;

  const goTo = (index) => {
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const maxIndex = Math.max(0, cards.length - getVisible());
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = track.parentElement.offsetWidth / getVisible();
    track.style.transform = `translateX(-${current * (cardWidth + 24)}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const next = () => {
    const cards = track?.querySelectorAll('.testimonial-card');
    const maxIndex = Math.max(0, (cards?.length || 0) - getVisible());
    goTo(current >= maxIndex ? 0 : current + 1);
  };

  const prev = () => {
    const cards = track?.querySelectorAll('.testimonial-card');
    const maxIndex = Math.max(0, (cards?.length || 0) - getVisible());
    goTo(current <= 0 ? maxIndex : current - 1);
  };

  const autoPlay = () => {
    interval = setInterval(next, 5000);
  };

  const init = () => {
    nextBtn?.addEventListener('click', () => { clearInterval(interval); next(); autoPlay(); });
    prevBtn?.addEventListener('click', () => { clearInterval(interval); prev(); autoPlay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { clearInterval(interval); goTo(i); autoPlay(); });
    });
    goTo(0);
    autoPlay();
    window.addEventListener('resize', () => goTo(current));
  };

  return { init };
})();

// ─── CONTACT FORM ───────────────────────────
const ContactForm = (() => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  const init = () => {
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const data = new FormData(form);
        const res = await fetch('contact.php', { method: 'POST', body: data });
        const json = await res.json();

        if (json.success) {
          form.reset();
          if (success) {
            success.innerHTML = '<i class="fas fa-check-circle"></i>&nbsp; ' + json.message;
            success.classList.add('visible');
            setTimeout(() => success.classList.remove('visible'), 6000);
          }
        } else {
          alert('Error: ' + json.message);
        }
      } catch (err) {
        // Fallback: show success anyway (static hosting)
        form.reset();
        if (success) {
          success.classList.add('visible');
          setTimeout(() => success.classList.remove('visible'), 5000);
        }
      } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    });
  };

  return { init };
})();

// ─── BACK TO TOP ────────────────────────────
const BackToTop = (() => {
  const btn = document.getElementById('backToTop');

  const init = () => {
    window.addEventListener('scroll', () => {
      btn?.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();

// ─── SMOOTH SCROLL ──────────────────────────
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  };
  return { init };
})();

// ─── INIT ALL ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navbar.init();
  Particles.create();
  TypedText.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  ProjectFilter.init();
  TestimonialSlider.init();
  ContactForm.init();
  BackToTop.init();
  SmoothScroll.init();

  // Stagger animate-on-scroll items
  document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.1}s`;
  });
});
