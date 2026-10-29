/**
 * Vanshika Portfolio - Interactive JavaScript Engine
 * Handles: Ambient Particles, Typewriter, Project Modals, Theme Toggling,
 * Interactive Code Runner, Category Filtering, Form Validation & Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 2. Theme Toggle (Dark / Light) with LocalStorage
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('vanshika_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('vanshika_theme', nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Obsidian' : 'Clean Light'} theme`, 'info', 2000);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Ambient Interactive Particle Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 1.8 + 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse proximity interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 1.2;
            this.y -= Math.sin(angle) * 1.2;
          }
        }
      }

      draw() {
        const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.45)' : 'rgba(99, 102, 241, 0.35)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles = [];
    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 16000), 65);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlRoot.getAttribute('data-theme') === 'dark';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacity = 1 - distance / 110;
            ctx.strokeStyle = isDark
              ? `rgba(99, 102, 241, ${opacity * 0.18})`
              : `rgba(99, 102, 241, ${opacity * 0.12})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 4. Typewriter Effect
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'Full Stack Developer 💻',
      'UI/UX Designer 🎨',
      'National Hackathon Winner 🏆',
      'Global Hackathon Champion 🌍',
      'Python & C Specialist ⚡',
      'BCA Scholar & Innovator 🎓'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseDelay = 1800;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElement.textContent = currentRole.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterElement.textContent = currentRole.substring(0, charIndex);
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(type, timeout);
    }

    type();
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Hero Sandbox Tabs & Code Runner
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.card-tabs .tab-btn');
  const tabContents = document.querySelectorAll('.interactive-card .tab-content');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  const runCodeBtn = document.getElementById('run-code-btn');
  const codeOutput = document.getElementById('code-output');

  if (runCodeBtn && codeOutput) {
    runCodeBtn.addEventListener('click', () => {
      runCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing Solution...';
      runCodeBtn.disabled = true;

      setTimeout(() => {
        codeOutput.style.display = 'block';
        codeOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        runCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sprint Completed';
        runCodeBtn.style.borderColor = 'var(--accent-emerald)';
        showToast('Code executed with 0 errors! System primed for championship speed.', 'success');

        setTimeout(() => {
          runCodeBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run Again';
          runCodeBtn.disabled = false;
        }, 3000);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Skills Category Filter
  // --------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skills-filter-tabs .filter-tab');
  const skillCards = document.querySelectorAll('#skills-grid .skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Projects Filter
  // --------------------------------------------------------------------------
  const projFilterBtns = document.querySelectorAll('.project-filters .proj-filter-btn');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  projFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-proj-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Project Case Study Modals (Data & Presentation)
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContainer = document.getElementById('modal-content-container');
  const openModalTriggers = document.querySelectorAll('.open-modal-trigger');

  const projectData = {
    devflow: {
      title: 'DevFlow Studio — Collaborative Engineer Workspace',
      badge: '🏆 Global Hackathon Gold Winner',
      overview:
        'DevFlow Studio is a full-stack real-time collaboration environment tailored for agile hackathon teams and remote developers. It integrates live markdown documentation, synchronized code execution scratchpads, Kanban sprint boards, and instant audio/chat channels.',
      challenge:
        'Hackathon teams lose 20-30% of their time switching between separate apps for notes, code snippets, and messaging. The goal was to unify them in a low-latency, zero-friction single-page app.',
      solution:
        'Constructed a React frontend paired with a modular Node.js/Express backend. Implemented Socket.io for sub-50ms synchronization across active team members and MongoDB for persistent project workspaces.',
      metrics: [
        'Sub-50ms state synchronization across 20+ simultaneous team cursors',
        'Built, styled, and pitched in 36 hours from scratch',
        'Awarded 1st Place out of 450+ international submissions'
      ],
      stack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS', 'Figma']
    },
    pycore: {
      title: 'PyCore Algorithmic Pipeline — High-Throughput Analytics',
      badge: '⚡ Systems & Speed Focus',
      overview:
        'PyCore combines the extreme performance of native C dynamic memory management with the rapid scripting and web service capabilities of Python and FastAPI. It processes large arrays of financial & scientific datasets in real time.',
      challenge:
        'Pure Python was throttling data processing loops when parsing millions of data points, causing latency spikes in the live dashboard.',
      solution:
        'Authored core calculation kernels in C using custom pointers and dynamic allocations. Compiled them into shared libraries and exposed them to Python via `ctypes` bindings, serving output via FastAPI.',
      metrics: [
        '98% speedup compared to standard single-threaded Python algorithms',
        '0.042s processing benchmark on 1,000,000 continuous data rows',
        'Clean memory safety and leak-free memory cycles verified with Valgrind'
      ],
      stack: ['C Language', 'Python', 'ctypes', 'FastAPI', 'Data Analytics', 'Linux']
    },
    aura: {
      title: 'Aura FinTech — Unified Financial Design System',
      badge: '🎨 Awarded Best UI/UX Design',
      overview:
        'A comprehensive design system and mobile/desktop application prototype created for next-generation fintech experiences. Focuses on accessibility, cognitive ease, dark mode elegance, and micro-interactions.',
      challenge:
        'Traditional financial dashboards are cluttered with numbers, causing cognitive overload and user fatigue.',
      solution:
        'Conducted user flow interviews, developed a strict 8px grid token hierarchy in Figma, and implemented responsive interactive charts with 60 FPS transitions and high-contrast color harmony.',
      metrics: [
        'Over 100+ production-ready component variants in Figma',
        'WCAG AAA compliance for text contrast and accessible screen reader flow',
        'Praised by senior product design judges for frictionless UX'
      ],
      stack: ['Figma', 'Design Systems', 'Micro-Interactions', 'UX Research', 'Tailwind CSS']
    },
    algotrace: {
      title: 'AlgoTrace — Step-By-Step Algorithm Visualizer',
      badge: '🎓 Educational & Core CS Innovation',
      overview:
        'An interactive educational web platform built to demystify complex algorithms and memory pointer behaviors in C and Data Structures through smooth canvas visual animations.',
      challenge:
        'Computer science students often struggle with abstract concepts like recursive stack frames, quicksort partitioning, and pointer indirection.',
      solution:
        'Designed an interactive step-by-step controller that maps algorithmic iterations directly onto an HTML5 Canvas, visualizing variable swaps, pivot choices, and time complexities.',
      metrics: [
        'Supports 8+ sorting algorithms and dynamic memory linked lists',
        'Interactive speed control, step-forward, and step-backward execution',
        'Adopted by 500+ BCA peers for academic exam and contest preparation'
      ],
      stack: ['JavaScript (ES6+)', 'HTML5 Canvas', 'C Algorithms', 'Data Structures', 'CSS3']
    }
  };

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalContainer || !projectModal) return;

    modalContainer.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span class="tag" style="color: var(--accent-gold); border-color: rgba(245, 158, 11, 0.4); margin-bottom: 0.75rem;">
          ${data.badge}
        </span>
        <h2 style="font-size: 1.7rem; margin-bottom: 0.5rem;">${data.title}</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.2rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.65;">
        <div>
          <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.35rem;">
            <i class="fa-solid fa-bullseye" style="color: var(--accent-purple); margin-right: 0.4rem;"></i> Project Overview
          </h4>
          <p>${data.overview}</p>
        </div>

        <div>
          <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.35rem;">
            <i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-rose); margin-right: 0.4rem;"></i> The Challenge
          </h4>
          <p>${data.challenge}</p>
        </div>

        <div>
          <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.35rem;">
            <i class="fa-solid fa-lightbulb" style="color: var(--accent-cyan); margin-right: 0.4rem;"></i> The Architecture &amp; Solution
          </h4>
          <p>${data.solution}</p>
        </div>

        <div>
          <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.5rem;">
            <i class="fa-solid fa-chart-line" style="color: var(--accent-emerald); margin-right: 0.4rem;"></i> Key Outcomes &amp; Benchmarks
          </h4>
          <ul style="padding-left: 1.2rem; list-style: disc;">
            ${data.metrics.map((m) => `<li style="margin-bottom: 0.3rem;">${m}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 style="color: var(--text-main); font-size: 1.1rem; margin-bottom: 0.5rem;">
            <i class="fa-solid fa-layer-group" style="color: var(--accent-gold); margin-right: 0.4rem;"></i> Technologies Utilized
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
            ${data.stack.map((s) => `<span class="tag" style="background: var(--bg-subtle);">${s}</span>`).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); display: flex; gap: 1rem;">
        <a href="#contact" class="btn btn-primary btn-sm modal-contact-link">
          <i class="fa-regular fa-paper-plane"></i> Discuss This Project
        </a>
      </div>
    `;

    const contactLink = modalContainer.querySelector('.modal-contact-link');
    if (contactLink) {
      contactLink.addEventListener('click', () => {
        closeModal();
      });
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const projId = btn.getAttribute('data-project');
      if (projId) openProjectModal(projId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Resume Modal Interactions
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalBtn = document.getElementById('resume-modal-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const drawerResumeTriggers = document.querySelectorAll('.open-resume-trigger');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const printCvBtn = document.getElementById('print-cv-btn');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeMobileDrawer();
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (resumeModalBtn) resumeModalBtn.addEventListener('click', openResume);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResume);
  drawerResumeTriggers.forEach((b) => b.addEventListener('click', openResume));

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      showToast('Downloading Vanshika_Resume_2026.pdf...', 'success');
      setTimeout(() => {
        showToast('Resume downloaded successfully!', 'info');
      }, 1000);
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // 10. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'vanshika.dev@example.com';
      navigator.clipboard
        .writeText(email)
        .then(() => {
          showToast(`Copied ${email} to clipboard!`, 'success');
          copyEmailBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i>';
          setTimeout(() => {
            copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
          }, 2000);
        })
        .catch(() => {
          showToast('Failed to copy. Please manually select the email.', 'error');
        });
    });
  }

  // --------------------------------------------------------------------------
  // 11. Interactive Contact Form with Validation
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('form-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please provide your full name.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please provide your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) return;

      // Submit Animation
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--accent-emerald)';
        showToast(`Thank you ${nameInput.value.trim()}! Vanshika will get back to you shortly.`, 'success', 5000);

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 12. Active Navigation ScrollSpy
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  // --------------------------------------------------------------------------
  // 13. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-links .drawer-link');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // --------------------------------------------------------------------------
  // 14. Back to Top Button & Footer Year
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 15. Escape Key Closes Modals
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeResume();
      closeMobileDrawer();
    }
  });

  console.log('🚀 Vanshika Portfolio initialized with full interactive suites.');
});

