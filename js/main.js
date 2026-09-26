/**
 * AI+ Platform | Core JavaScript
 * Initializes Lenis smooth scrolling, custom cursor, navigation, modals, and Lucide icons.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // 2. Fast Native Scrolling & Snappy Anchor Handling
  // Removed heavy Lenis dampening to deliver ultra-fast, responsive scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 3. Sticky Navbar Blur on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 4. Active Navigation Indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 5. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      
      const bars = mobileToggle.querySelectorAll('span');
      if (bars.length === 3) {
        if (isOpen) {
          bars[0].style.transform = 'translateY(7px) rotate(45deg)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
        }
      }
    };

    mobileToggle.addEventListener('click', () => toggleMenu());
    
    // Close on clicking mobile link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // 6. Custom Cursor (Desktop Only)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice && !prefersReducedMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const renderFollower = () => {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderFollower);
    };
    requestAnimationFrame(renderFollower);

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .bento-card, .task-card, .how-card, .dropzone-box');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 7. Global Modal Management
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  };

  window.closeModal = function(modalId) {
    const modal = modalId ? document.getElementById(modalId) : document.querySelector('.modal-backdrop.active');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modals on clicking backdrop or pressing ESC
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      window.closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
    }
  });

  // Attach close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      window.closeModal(modalId);
    });
  });

  // 8. Demo Notice Toast Utility
  window.showDemoToast = function(message = 'Demonstration action recorded.') {
    let toast = document.getElementById('demo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'demo-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(14, 14, 14, 0.95);
        color: #FFFFFF;
        border: 1px solid #242424;
        border-radius: 9999px;
        padding: 10px 22px;
        font-size: 0.88rem;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(16px);
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: #00E599; display: inline-block;"></span>${message}`;
    toast.style.opacity = '1';
    toast.style.visibility = 'visible';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.visibility = 'hidden';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3200);
  };

  // 9. Fast Instant Video Loader & Playback Prioritization
  window.initSmartVideos = function() {
    const smartWrappers = document.querySelectorAll('.video-wrapper-smart');

    // 1. Immediately prioritize and start Hero video
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      heroVideo.muted = true;
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback: retry on first interaction
          const unlock = () => {
            heroVideo.play();
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
      }
    }

    // 2. Set up fast reveals for all videos
    smartWrappers.forEach(wrapper => {
      const video = wrapper.querySelector('video');
      const loader = wrapper.querySelector('.video-logo-loader');
      if (!video) return;

      const hideLoader = () => {
        if (loader) loader.classList.add('hidden');
      };

      // If already playing or has frames, hide loader immediately
      if (video.currentTime > 0 || video.readyState >= 2) {
        hideLoader();
      }

      video.addEventListener('playing', hideLoader);
      video.addEventListener('timeupdate', hideLoader, { once: true });
      video.addEventListener('loadeddata', hideLoader, { once: true });
      video.addEventListener('canplay', hideLoader, { once: true });

      // Immediate fallback to never block video
      setTimeout(hideLoader, 1200);

      // 3. For below-the-fold videos, lazy-play when entering viewport to save bandwidth
      if (!video.classList.contains('hero-video') && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.muted = true;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        }, { rootMargin: '200px 0px' });
        observer.observe(video);
      }
    });
  };
  window.initSmartVideos();

  // 10. Interactive Video Switcher (Gallery Tabs for record1 - record5)
  const videoTabs = document.querySelectorAll('.video-tab-btn');
  const mainVideo = document.getElementById('cinematic-video-element');
  const mainVideoWrapper = mainVideo ? mainVideo.closest('.video-wrapper-smart') : null;
  const mainVideoLoader = mainVideoWrapper ? mainVideoWrapper.querySelector('.video-logo-loader') : null;

  if (videoTabs.length > 0 && mainVideo) {
    videoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        videoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const videoSrc = tab.getAttribute('data-video');
        if (videoSrc) {
          if (mainVideoLoader) mainVideoLoader.classList.remove('hidden');
          mainVideo.classList.remove('video-loaded');

          mainVideo.src = videoSrc;
          mainVideo.load();
          mainVideo.play().catch(e => console.log('Autoplay deferred:', e));

          const onReady = () => {
            mainVideo.classList.add('video-loaded');
            if (mainVideoLoader) mainVideoLoader.classList.add('hidden');
          };
          mainVideo.addEventListener('loadeddata', onReady, { once: true });
          mainVideo.addEventListener('canplay', onReady, { once: true });
        }
      });
    });
  }

  // 11. Mobile Phone Mockup Video Switcher
  window.switchMobileVideo = function(videoSrc, btn) {
    const mobileVideo = document.getElementById('mobile-preview-video');
    if (!mobileVideo) return;
    const wrapper = mobileVideo.closest('.video-wrapper-smart');
    const loader = wrapper ? wrapper.querySelector('.video-logo-loader') : null;

    if (btn) {
      const parent = btn.parentElement;
      parent.querySelectorAll('button').forEach(b => {
        b.style.borderColor = 'var(--border-card)';
        b.style.color = 'var(--text-white)';
      });
      btn.style.borderColor = 'var(--accent-green)';
      btn.style.color = 'var(--accent-green)';
    }

    if (loader) loader.classList.remove('hidden');
    mobileVideo.classList.remove('video-loaded');

    mobileVideo.src = videoSrc;
    mobileVideo.load();
    mobileVideo.play().catch(e => console.log('Autoplay deferred:', e));

    const onReady = () => {
      mobileVideo.classList.add('video-loaded');
      if (loader) loader.classList.add('hidden');
    };
    mobileVideo.addEventListener('loadeddata', onReady, { once: true });
    mobileVideo.addEventListener('canplay', onReady, { once: true });
  };

  // 12. Ensure all videos play reliably across all browsers and devices
  const forcePlayAllVideos = () => {
    document.querySelectorAll('video').forEach(video => {
      video.muted = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });
  };

  forcePlayAllVideos();
  window.addEventListener('load', forcePlayAllVideos);
  ['click', 'touchstart', 'scroll'].forEach(evt => {
    window.addEventListener(evt, forcePlayAllVideos, { once: true });
  });
});
