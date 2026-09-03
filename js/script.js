/* ==========================================================================
   Ali Hamada Elshenawy — Portfolio Script
   ==========================================================================
   1. SITE CONFIG — the contact details used in more than one place
      (header/footer social icons, contact section, form mailto link).
      Edit this in ONE place and every spot on the page updates.
   2. Header scroll state + mobile nav toggle
   3. Scroll-spy: highlights the active nav link + slides the indicator
   4. Contact form -> opens a pre-filled email (no backend required)
   5. Footer year
   ========================================================================== */

/* -------------------------------------------------------------------------
   1. SITE CONFIG — EDIT YOUR CONTACT DETAILS HERE
   ------------------------------------------------------------------------- */
const SITE_CONFIG = {
  email: "alielshenawy1200@gmail.com",
  phone: "01150577155",
  phoneHref: "+201150577155", // international format used for tel: links
  location: "Damietta, Egypt",
  github: "https://github.com/alielshenawy-oss",
  linkedin: "https://www.linkedin.com/in/ali-elshenawy-520a39410",
  resumeUrl: "#", // TODO: replace with your CV download URL
};

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  initHeaderScroll();
  initMobileNav();
  initScrollSpy();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* Fill every element carrying a data-config attribute from SITE_CONFIG.
   data-config="email"      -> sets text content
   data-config-href="email" -> sets the href attribute (mailto/tel/link) */
function applySiteConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    if (SITE_CONFIG[key] !== undefined) el.textContent = SITE_CONFIG[key];
  });

  document.querySelectorAll("[data-config-href]").forEach((el) => {
    const key = el.getAttribute("data-config-href");
    if (key === "email") el.href = `mailto:${SITE_CONFIG.email}`;
    else if (key === "phone") el.href = `tel:${SITE_CONFIG.phoneHref}`;
    else if (SITE_CONFIG[key] !== undefined) el.href = SITE_CONFIG[key];
  });
}

/* -------------------------------------------------------------------------
   2. HEADER SCROLL STATE
   ------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -------------------------------------------------------------------------
   3. MOBILE NAV TOGGLE
   ------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* -------------------------------------------------------------------------
   4. SCROLL-SPY — highlight active nav link + slide the indicator pill
   ------------------------------------------------------------------------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
  const indicator = document.querySelector(".nav-indicator");
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(link) {
    links.forEach((l) => l.classList.remove("is-active"));
    if (!link) return;
    link.classList.add("is-active");
    if (indicator && window.innerWidth > 980) {
      indicator.style.opacity = "1";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = links.find((l) => l.getAttribute("href") === `#${entry.target.id}`);
          if (match) setActive(match);
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((sec) => observer.observe(sec));
  window.addEventListener("resize", () => {
    const current = document.querySelector(".main-nav a.is-active");
    if (current) setActive(current);
  });
}

/* -------------------------------------------------------------------------
   5. CONTACT FORM — static hosting has no backend, so this opens the
      visitor's email client with the message pre-filled. To collect
      messages without an email client (e.g. via Formspree or a similar
      form endpoint), swap the code inside the submit handler for a
      fetch() call to that service.
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus("Please fill in every field before sending.", "err");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("That email address doesn't look right.", "err");
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
    showStatus("Opening your email app to send the message…", "ok");
  });

  function showStatus(text, kind) {
    status.textContent = text;
    status.className = `form-status ${kind}`;
  }
}
