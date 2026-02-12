/* ========= script.js (Normal JS) ========= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  const toggle = document.querySelector(".toggle-menu");
  // flexible selector for the to-top button
  const toTopBtn = document.getElementById("toTopBtn") || document.querySelector(".to-top, .toTopBtn, .to-top-btn");
  // target the about section so button shows when About begins
  const aboutSection = document.getElementById("about-us") || document.querySelector("#about-us, .about-us, .about-section");

  /* Sticky header on scroll */
  window.addEventListener("scroll", () => {
    if (!header) return;
    // add `sticky` class when scrolled (CSS controls the sticky background)
    header.classList.toggle("sticky", window.scrollY > 30);

    if (toTopBtn) {
      let show = false;
      if (aboutSection) {
        // show once we've scrolled to the top of the About section (account for header height)
        const headerHeight = header.offsetHeight || 80;
        show = window.scrollY >= Math.max(0, aboutSection.offsetTop - headerHeight - 20);
      } else {
        show = window.scrollY > 350;
      }
      toTopBtn.classList.toggle("show", show);
    }
  });

  /* Mobile menu toggle */
  if (toggle && nav) {
    // central toggle method so behavior is consistent
    const toggleNav = () => {
      const opened = nav.classList.toggle("active");
      // reflect state on the toggle button for accessibility
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // close menu when clicking any link inside nav
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // close when clicking outside the nav or toggle
    document.addEventListener("click", (e) => {
      const isInside = nav.contains(e.target) || toggle.contains(e.target);
      if (!isInside) {
        nav.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Scroll to top */
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Intersection Observer reveal animations */
  const revealEls = document.querySelectorAll(
    ".section-title, .service-card, .project-card, .team-card, .testimonial-card, .blog-card, .hero-container, .hero-stats > div"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("reveal-show");
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));

  /* Stats counters (run once when 40% visible) */
  const animateCounter = (el) => {
    if (el.dataset.counted === "true") return;

    const start = Number(el.dataset.start || 0);
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * progress);
      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
        el.dataset.counted = "true";
      }
    };

    requestAnimationFrame(update);
  };

  const initCounterSection = (sectionSelector) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const counters = section.querySelectorAll("span[data-target]");
    if (!counters.length) return;

    counters.forEach((el) => {
      const start = Number(el.dataset.start || 0);
      const suffix = el.dataset.suffix || "";
      el.textContent = `${start}${suffix}`;
    });

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counters.forEach((el) => animateCounter(el));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    sectionObserver.observe(section);
  };

  initCounterSection(".hero-stats");
  initCounterSection(".certifications-stat");
});
