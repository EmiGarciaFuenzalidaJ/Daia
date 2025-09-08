(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader ||
      (!selectHeader.classList.contains("scroll-up-sticky") &&
        !selectHeader.classList.contains("sticky-top") &&
        !selectHeader.classList.contains("fixed-top"))
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (window.AOS && typeof AOS.init === "function") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  if (window.GLightbox) {
    GLightbox({ selector: ".glightbox" });
  }

  /**
   * Initiate Pure Counter
   */
  if (window.PureCounter) new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        if (typeof initSwiperWithCustomPagination === "function") {
          initSwiperWithCustomPagination(swiperElement, config);
        }
      } else {
        if (window.Swiper) new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    if (window.imagesLoaded && window.Isotope) {
      imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
        initIsotope = new Isotope(
          isotopeItem.querySelector(".isotope-container"),
          {
            itemSelector: ".isotope-item",
            layoutMode: layout,
            filter: filter,
            sortBy: sort,
          }
        );
      });
    }

    isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (
      filters
    ) {
      filters.addEventListener(
        "click",
        function () {
          let active = isotopeItem.querySelector(
            ".isotope-filters .filter-active"
          );
          if (active) active.classList.remove("filter-active");
          this.classList.add("filter-active");
          if (initIsotope) {
            initIsotope.arrange({ filter: this.getAttribute("data-filter") });
          }
          if (typeof aosInit === "function") {
            aosInit();
          }
        },
        false
      );
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Orbit animation init (con l�neas desde el borde del c�rculo central y giro animado)
   */
  document.addEventListener("DOMContentLoaded", () => {
    const orbitRing = document.querySelector(".orbit-ring");
    const orbitItems = document.querySelectorAll(".orbit-item");
    if (!orbitRing || orbitItems.length === 0) return;

    const totalItems = orbitItems.length;
    const radiusClose = 170;
    const radiusFar = 240;

    // elementos del centro (si existen en tu HTML)
    const centerCircleEl = orbitRing.querySelector(".orbit-center-circle");
    const logoEl = orbitRing.querySelector(".orbit-logo");

    // forzar z-index correctos (puede ajustarse tambi�n desde CSS)
    if (centerCircleEl) centerCircleEl.style.zIndex = "12";
    if (logoEl) logoEl.style.zIndex = "13";

    let angleOffset = 0;

    // Crear l�neas iniciales (una por cada �tem)
    const orbitLines = [];
    orbitItems.forEach(() => {
      const line = document.createElement("div");
      line.classList.add("orbit-line");
      // style por defecto que asegura comportamiento correcto aunque tu CSS cambie
      Object.assign(line.style, {
        position: "absolute",
        background: "cyan",
        boxShadow: "0 0 10px cyan",
        pointerEvents: "none",
        zIndex: "10",
        height: "2px", // ser� sobrescrito cuando calculemos width
        transformOrigin: "0 50%",
      });
      orbitRing.appendChild(line);
      orbitLines.push(line);
    });

    function updateOrbit() {
      // recalcular centro cada frame para ser responsive
      const rect = orbitRing.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // radio del c�rculo central (si no existe, fallback)
      const centerCircleRadius = centerCircleEl
        ? centerCircleEl.offsetWidth / 2
        : 60;

      orbitItems.forEach((item, index) => {
        const angle = (index / totalItems) * Math.PI * 2 + angleOffset;
        const radius = index % 2 === 0 ? radiusClose : radiusFar;

        // radios/centros del icono externo
        const itemRadius = item.offsetWidth / 2;

        // posicionar el centro del icono (izquierda/top del elemento)
        const iconCenterX = centerX + Math.cos(angle) * radius;
        const iconCenterY = centerY + Math.sin(angle) * radius;
        const itemLeft = iconCenterX - itemRadius;
        const itemTop = iconCenterY - itemRadius;

        item.style.position = "absolute";
        item.style.left = `${itemLeft}px`;
        item.style.top = `${itemTop}px`;

        // mantener iconos con orientaci�n natural (compensar rotaci�n)
        item.style.transform = `rotate(${-angle}rad)`;

        // calcular punto inicial de la l�nea: borde exterior del c�rculo central
        const startX = centerX + Math.cos(angle) * centerCircleRadius;
        const startY = centerY + Math.sin(angle) * centerCircleRadius;

        // calcular punto final de la l�nea: borde interior del icono externo (para que la l�nea llegue al borde del c�rculo del �cono)
        const endX = centerX + Math.cos(angle) * (radius - itemRadius);
        const endY = centerY + Math.sin(angle) * (radius - itemRadius);

        // longitud y �ngulo de la l�nea
        const dx = endX - startX;
        const dy = endY - startY;
        const lineLength = Math.sqrt(dx * dx + dy * dy);
        const lineAngle = Math.atan2(dy, dx);

        // actualizar l�nea correspondiente
        const line = orbitLines[index];
        line.style.width = `${lineLength}px`;      // ancho = distancia entre start y end
        line.style.height = `2px`;                 // grosor
        // colocar la esquina izquierda de la l�nea en (startX, startY) y centrar verticalmente con translate
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transform = `translate(0, -50%) rotate(${lineAngle}rad)`;
      });

      // velocidad de giro (ajust� a gusto)
      angleOffset += 0.0018;
      requestAnimationFrame(updateOrbit);
    }

    // lanzar animaci�n
    updateOrbit();

    // reajustar si cambia tama�o de ventana (opcional pero recomendable)
    window.addEventListener("resize", () => {
      // forzamos una pasada de update para recalcular centros inmediatamente
      // (la RAF se encargar� de las siguientes)
      // no llamamos directamente updateOrbit() para evitar m�ltiples RAF anidados
      // pero podemos solicitar un frame:
      requestAnimationFrame(() => {});
    });
  });
})();
