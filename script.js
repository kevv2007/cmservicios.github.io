const header = document.querySelector("[data-header]");
const powerCanvas = document.querySelector("[data-power-canvas]");
if (powerCanvas) {
  const context = powerCanvas.getContext("2d");
  const logo = new Image();
  logo.src = "assets/logo.svg";
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame;
  let inView = true;

  const box = (x, y, width, height, fill, stroke, radius = 4) => {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.fillStyle = fill;
    context.fill();
    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = 1;
      context.stroke();
    }
  };
  const label = (text, x, y, color = "#b9ccef", size = 10, align = "left") => {
    context.font = `600 ${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(text, x, y);
  };
  const wire = (points, color, phase) => {
    const path = () => {
      context.beginPath();
      points.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y));
    };
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.globalAlpha = 0.3;
    path();
    context.stroke();
    context.globalAlpha = 1;
    context.shadowColor = color;
    context.shadowBlur = 9;
    context.setLineDash([10, 42]);
    context.lineDashOffset = -phase;
    path();
    context.stroke();
    context.setLineDash([]);
    context.shadowBlur = 0;
  };
  const breaker = (x, y, width, name, color, t, index) => {
    const surface = context.createLinearGradient(x, y, x + width, y + 95);
    surface.addColorStop(0, "#e8f0f7");
    surface.addColorStop(0.5, "#a6bed1");
    surface.addColorStop(1, "#d1dfeb");
    box(x, y, width, 93, surface, "#7a9bb5");
    for (const terminalY of [y + 9, y + 84]) {
      context.beginPath();
      context.arc(x + width / 2, terminalY, 3.5, 0, Math.PI * 2);
      context.fillStyle = "#203b51";
      context.fill();
      context.strokeStyle = "#a7c4db";
      context.beginPath();
      context.moveTo(x + width / 2 - 2, terminalY);
      context.lineTo(x + width / 2 + 2, terminalY);
      context.stroke();
    }
    label(name, x + width / 2, y + 27, "#203b51", 9, "center");
    box(x + 7, y + 34, width - 14, 36, "#14293c", "#6889a2", 3);
    const lift = motion.matches ? 0 : Math.sin(t * 1.4 + index) * 1.2;
    box(x + 9, y + 39 + lift, width - 18, 13, color, null, 2);
    label("I", x + width / 2, y + 49 + lift, "#fff", 10, "center");
    label("0", x + width / 2, y + 65, "#6e879d", 8, "center");
  };
  const draw = (time = 0) => {
    const scale = powerCanvas.width / 560;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, 560, 460);
    const t = motion.matches ? 0 : time / 1000;

    // Cabinet, DIN rails and recognisable protective devices form the main scene.
    box(60, 13, 440, 430, "#061526", "#3a789f", 8);
    box(69, 22, 422, 412, "#0b2137", "#244760", 5);
    for (const x of [78, 482]) for (const y of [31, 425]) {
      context.beginPath();
      context.arc(x, y, 3, 0, Math.PI * 2);
      context.fillStyle = "#7b9aae";
      context.fill();
    }
    if (logo.complete && logo.naturalWidth) context.drawImage(logo, 87, 35, 57, 40);
    label("TABLERO ELÉCTRICO", 163, 52, "#f7faff", 14);
    label("PROTECCIÓN · DISTRIBUCIÓN", 163, 69, "#8dabc4", 9);
    box(432, 43, 33, 20, "#113f3a", "#3ee4bd", 3);
    label("I / ON", 448, 56, "#8df0d7", 8, "center");

    for (let i = 0; i < 3; i++) {
      const x = 236 + i * 20;
      wire([[x, 83], [x, 100], [152 + i * 13, 100], [152 + i * 13, 129]], ["#ff455d", "#76ceff", "#ffd34d"][i], t * 35 + i * 17);
    }
    box(91, 166, 375, 9, "#506e85", "#8aa9bf", 1);
    box(91, 314, 375, 9, "#506e85", "#8aa9bf", 1);
    breaker(122, 123, 55, "GENERAL", "#ef233c", t, 0);
    breaker(184, 123, 55, "DIF.", "#ef233c", t, 1);
    for (let i = 0; i < 3; i++) {
      const x = 259 + i * 62;
      breaker(x, 123, 48, ["C10", "C16", "C20"][i], "#1474e8", t, i + 2);
      wire([[211, 218], [211, 238], [x + 24, 238], [x + 24, 269]], i % 2 ? "#ff455d" : "#76ceff", t * 44 + i * 20);
    }
    for (let i = 0; i < 5; i++) {
      const x = 122 + i * 62;
      breaker(x, 270, 48, ["C10", "C16", "C20", "C25", "C32"][i], i % 2 ? "#ef233c" : "#1474e8", t, i + 5);
      wire([[x + 24, 364], [x + 24, 390], [405 - i * 10, 390], [405 - i * 10, 404]], i % 2 ? "#ff455d" : "#76ceff", t * 42 + i * 15);
    }
    wire([[103, 104], [103, 397], [300, 397]], "#3ee4bd", t * 38);
    box(285, 405, 147, 12, "#254b43", "#3ee4bd", 2);
    for (let i = 0; i < 11; i++) {
      context.fillStyle = "#b6e8cd";
      context.fillRect(293 + i * 12, 408, 4, 6);
    }

    const active = Math.floor(t / 1.5) % 5;
    for (let i = 0; i < 5; i++) {
      const color = i === active ? "#76ceff" : "#345069";
      context.shadowColor = color;
      context.shadowBlur = i === active ? 12 : 0;
      box(92 + i * 16, 410, 8, 5, color, null, 1);
    }
    context.shadowBlur = 0;
    // A moving highlight follows the enclosure rather than obscuring the devices.
    context.strokeStyle = "#76ceff";
    context.lineWidth = 2;
    context.shadowColor = "#459cff";
    context.shadowBlur = 12;
    context.setLineDash([70, 1670]);
    context.lineDashOffset = -t * 90;
    context.strokeRect(60, 13, 440, 430);
    context.setLineDash([]);
    context.shadowBlur = 0;
    if (!motion.matches && inView && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const restart = () => { cancelAnimationFrame(frame); draw(performance.now()); };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    powerCanvas.width = Math.round(powerCanvas.clientWidth * dpr);
    powerCanvas.height = Math.round(powerCanvas.width * 460 / 560);
    restart();
  };
  new ResizeObserver(resize).observe(powerCanvas);
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; restart(); }).observe(powerCanvas);
  logo.addEventListener("load", restart);
  motion.addEventListener("change", restart);
  document.addEventListener("visibilitychange", restart);
}
const galleryLinks = [...document.querySelectorAll(".work-card")];
const galleryViewer = document.querySelector("[data-gallery-viewer]");
let galleryIndex = 0;

const showGalleryImage = (index) => {
  galleryIndex = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[galleryIndex];
  const source = link.querySelector("img");
  const image = galleryViewer.querySelector("[data-gallery-image]");
  image.src = link.href;
  image.alt = source.alt;
  galleryViewer.querySelector("[data-gallery-caption]").textContent = source.alt;
  galleryViewer.querySelector("[data-gallery-counter]").textContent = `${galleryIndex + 1} / ${galleryLinks.length}`;
};

galleryLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showGalleryImage(index);
    galleryViewer.showModal();
    document.body.classList.add("gallery-open");
  });
});

galleryViewer.querySelector("[data-gallery-close]").addEventListener("click", () => galleryViewer.close());
galleryViewer.querySelector("[data-gallery-prev]").addEventListener("click", () => showGalleryImage(galleryIndex - 1));
galleryViewer.querySelector("[data-gallery-next]").addEventListener("click", () => showGalleryImage(galleryIndex + 1));
galleryViewer.addEventListener("close", () => document.body.classList.remove("gallery-open"));
galleryViewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showGalleryImage(galleryIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
galleryViewer.addEventListener("click", (event) => {
  if (event.target !== galleryViewer) return;
  const bounds = galleryViewer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) galleryViewer.close();
});
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (typeof window.particlesJS === "function") {
  window.particlesJS("particles-background", {
    particles: {
      number: { value: window.innerWidth < 600 ? 32 : 78, density: { enable: true, value_area: 900 } },
      color: { value: ["#459cff", "#a7d5ff", "#ff455d"] },
      shape: { type: "circle" },
      opacity: { value: 0.65, random: true },
      size: { value: 2.4, random: true },
      line_linked: { enable: true, distance: 155, color: "#459cff", opacity: 0.24, width: 1 },
      move: { enable: !reducedMotion.matches, speed: 0.65, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
      detect_on: "window",
      events: { onhover: { enable: !reducedMotion.matches, mode: "grab" }, onclick: { enable: false }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.45 } } }
    },
    retina_detect: true
  });
  const syncParticleMotion = () => {
    const instance = window.pJSDom?.find((item) => item.pJS.canvas.el.parentElement.id === "particles-background");
    if (!instance) return;
    instance.pJS.particles.move.enable = !reducedMotion.matches && !document.hidden;
    instance.pJS.interactivity.events.onhover.enable = !reducedMotion.matches;
    instance.pJS.fn.particlesRefresh();
  };
  reducedMotion.addEventListener("change", syncParticleMotion);
  document.addEventListener("visibilitychange", syncParticleMotion);
}
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".desktop-nav a");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(item);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

document.querySelector("[data-whatsapp-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const lines = [
    "Hola CM Servicios, quiero hacer una consulta.",
    "",
    `Nombre: ${data.get("Nombre") || "-"}`,
    `Empresa: ${data.get("Empresa") || "-"}`,
    `Telefono: ${data.get("Telefono") || "-"}`,
    `Email: ${data.get("Email") || "-"}`,
    `Servicio requerido: ${data.get("Servicio requerido") || "-"}`,
    "",
    `Mensaje: ${data.get("Mensaje") || "-"}`,
  ];

  window.open(`https://wa.me/542974083336?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

const processLine = document.querySelector(".process-line");
const updateProcessProgress = () => {
  if (!processLine) return;
  const rect = processLine.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport * 0.75 + rect.height)));
  processLine.style.setProperty("--progress", `${Math.round(progress * 100)}%`);
};

window.addEventListener("scroll", updateProcessProgress, { passive: true });
window.addEventListener("resize", updateProcessProgress);
updateProcessProgress();

document.querySelector(".hero-visual")?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const panel = event.currentTarget.querySelector(".technical-panel");
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
  panel.style.transform = `rotateX(${2 + y}deg) rotateY(${-5 + x}deg) translateY(-4px)`;
});

document.querySelector(".hero-visual")?.addEventListener("pointerleave", (event) => {
  event.currentTarget.querySelector(".technical-panel").style.transform = "";
});
