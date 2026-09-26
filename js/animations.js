/**
 * AI+ Platform | GSAP & ScrollTrigger Animations
 * Handles hero reveals, scroll triggers, animated number counters, video player UI, and earnings calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. GSAP + ScrollTrigger Registration
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!prefersReducedMotion) {
      // Hero Elements Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (document.querySelector('.hero-eyebrow')) {
        heroTl.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
      }
      if (document.querySelector('.hero-headline')) {
        heroTl.fromTo('.hero-headline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
      }
      if (document.querySelector('.hero-supporting')) {
        heroTl.fromTo('.hero-supporting', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
      }
      if (document.querySelector('.hero-actions')) {
        heroTl.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
      }
      if (document.querySelector('.hero-visual-wrapper')) {
        heroTl.fromTo('.hero-visual-wrapper', 
          { opacity: 0, scale: 0.95, y: 40 }, 
          { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 
          '-=0.7'
        );
      }

      // Floating Cards subtle idle oscillation
      const floatingCards = document.querySelectorAll('.floating-card');
      floatingCards.forEach((card, index) => {
        gsap.to(card, {
          y: (index % 2 === 0 ? -8 : 8),
          duration: 2.8 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Scroll-triggered elements reveal
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      revealElements.forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Staggered card reveals in bento and how-it-works grids
      const staggeredContainers = document.querySelectorAll('.stagger-reveal');
      staggeredContainers.forEach((container) => {
        const children = container.children;
        gsap.fromTo(children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }

  // 2. Animated Number Counters
  const countUpElements = document.querySelectorAll('[data-counter]');
  if (countUpElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-counter'), 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          
          let count = 0;
          const duration = 1600;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const current = Math.floor(progress * (2 - progress) * targetNum);
            
            el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${targetNum.toLocaleString()}${suffix}`;
            }
          };
          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countUpElements.forEach(el => observer.observe(el));
  }

  // 3. Interactive Earnings Calculator
  const calcSlider = document.getElementById('calc-hours-slider');
  const sliderHoursText = document.getElementById('calc-hours-val');
  const calcWeeklyText = document.getElementById('calc-weekly-val');
  const calcMonthlyText = document.getElementById('calc-monthly-val');
  const calcYearlyText = document.getElementById('calc-yearly-val');

  if (calcSlider && sliderHoursText && calcWeeklyText && calcMonthlyText) {
    // Illustrative rate example up to ₹350/hour
    const ratePerHour = 350;

    const updateCalculator = () => {
      const hours = parseInt(calcSlider.value, 10);
      sliderHoursText.textContent = hours;

      const weekly = hours * ratePerHour;
      const monthly = Math.round(weekly * 4.33);
      const yearly = weekly * 52;

      calcWeeklyText.textContent = `₹${weekly.toLocaleString()}`;
      calcMonthlyText.textContent = `₹${monthly.toLocaleString()}`;
      if (calcYearlyText) {
        calcYearlyText.textContent = `₹${yearly.toLocaleString()}`;
      }
    };

    calcSlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Initial calculation
  }

  // 4. Video Player Controls in Cinematic Section
  const cinematicVideo = document.getElementById('cinematic-video-element');
  const playPauseBtn = document.getElementById('video-toggle-play');
  const muteBtn = document.getElementById('video-toggle-mute');
  const progressBar = document.getElementById('video-progress-fill');
  const progressContainer = document.getElementById('video-progress-container');
  const timeDisplay = document.getElementById('video-time-text');

  if (cinematicVideo && playPauseBtn) {
    const updatePlayIcon = () => {
      const icon = playPauseBtn.querySelector('i') || playPauseBtn;
      if (cinematicVideo.paused) {
        icon.setAttribute('data-lucide', 'play');
      } else {
        icon.setAttribute('data-lucide', 'pause');
      }
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    };

    playPauseBtn.addEventListener('click', () => {
      if (cinematicVideo.paused) {
        cinematicVideo.play();
      } else {
        cinematicVideo.pause();
      }
      updatePlayIcon();
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        cinematicVideo.muted = !cinematicVideo.muted;
        const icon = muteBtn.querySelector('i') || muteBtn;
        if (cinematicVideo.muted) {
          icon.setAttribute('data-lucide', 'volume-x');
        } else {
          icon.setAttribute('data-lucide', 'volume-2');
        }
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      });
    }

    if (progressBar && progressContainer) {
      cinematicVideo.addEventListener('timeupdate', () => {
        if (!isNaN(cinematicVideo.duration)) {
          const percent = (cinematicVideo.currentTime / cinematicVideo.duration) * 100;
          progressBar.style.width = `${percent}%`;

          if (timeDisplay) {
            const formatTime = (secs) => {
              const m = Math.floor(secs / 60);
              const s = Math.floor(secs % 60);
              return `${m}:${s < 10 ? '0' : ''}${s}`;
            };
            timeDisplay.textContent = `${formatTime(cinematicVideo.currentTime)} / ${formatTime(cinematicVideo.duration)}`;
          }
        }
      });

      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (!isNaN(cinematicVideo.duration)) {
          cinematicVideo.currentTime = pos * cinematicVideo.duration;
        }
      });
    }
  }
});
