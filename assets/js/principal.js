/* =======================================================
   principal.js — MIDAS (versión PRO sincronizada con spa.js)
   - Delegación de eventos limpia
   - Sidebar colapsable, submenús, tooltips
   - Integra con window.spa.cargarModulo(mod)
   - Idempotente (evita doble inicialización)
======================================================= */
(function () {
  "use strict";

  if (window.__midas_principal_pro_inited) {
    console.log("principal.js: ya inicializado (PRO)");
    return;
  }
  window.__midas_principal_pro_inited = true;
  console.log("principal.js: inicializado (PRO)");

  // Selectores / configuración
  const SIDEBAR = document.querySelector(".sidebar");
  const TOGGLE = document.querySelector(".toggle-btn");
  const MENU = document.querySelector(".menu");
  const MODULE_ATTR = "data-module";
  const TOGGLE_ATTR = "data-toggle";
  const TITLE_ATTR = "data-title";

  if (!SIDEBAR || !TOGGLE || !MENU) {
    console.error("principal.js: elementos esenciales no encontrados");
    return;
  }

  // Small utilities
  const isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  const norm = s => String(s || "").trim().toLowerCase();

  // Tooltip state
  let tooltipEl = null;
  let tooltipTimer = null;
  let tooltipHover = false;

  /* -------------------------
     Sidebar toggle
  ------------------------- */
  TOGGLE.addEventListener("click", () => {
    SIDEBAR.classList.toggle("collapsed");
    removeTooltipImmediate();
    closeAllSubmenus();
  });

  /* -------------------------
     Submenu helpers
  ------------------------- */
  function closeAllSubmenus() {
    document.querySelectorAll(".submenu").forEach(sub => {
      sub.classList.remove("open");
      sub.style.maxHeight = "0px";
      sub.style.opacity = "0";
    });
    document.querySelectorAll(".has-children").forEach(btn => {
      btn.dataset.open = "false";
      // restore arrow char if used
      if (btn.innerText.includes("▴")) btn.innerHTML = btn.innerHTML.replace("▴", "▾");
    });
  }

  function openSubmenu(btn) {
    const id = btn.getAttribute(TOGGLE_ATTR);
    const submenu = document.querySelector(`.submenu[data-parent="${id}"]`);
    if (!submenu) return;

    const wasOpen = submenu.classList.contains("open");
    closeAllSubmenus();
    if (!wasOpen) {
      submenu.classList.add("open");
      submenu.style.maxHeight = submenu.scrollHeight + "px";
      submenu.style.opacity = "1";
      btn.dataset.open = "true";
      if (btn.innerText.includes("▾")) btn.innerHTML = btn.innerHTML.replace("▾", "▴");
    }
  }

  /* -------------------------
     Tooltip helpers
  ------------------------- */
  function removeTooltipImmediate() {
    if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null; }
    if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; tooltipHover = false; }
  }
  function scheduleRemoveTooltip(ms = 120) {
    if (tooltipTimer) clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => { if (!tooltipHover) removeTooltipImmediate(); }, ms);
  }

  function createTooltipForItem(item) {
    removeTooltipImmediate();
    if (!item) return;
    const title = item.getAttribute(TITLE_ATTR) || item.textContent.trim();
    const hasChildren = item.classList.contains("has-children");
    const toggleId = item.getAttribute(TOGGLE_ATTR);

    const t = document.createElement("div");
    t.className = "menu-tooltip";
    t.style.zIndex = 9999;
    t.innerHTML = `<h4>${title}</h4><ul></ul>`;

    if (hasChildren && toggleId) {
      const submenu = document.querySelector(`.submenu[data-parent="${toggleId}"]`);
      if (submenu) {
        submenu.querySelectorAll(".sub-item").forEach(sub => {
          const label = sub.getAttribute(TITLE_ATTR) || sub.textContent.trim();
          const mod = sub.getAttribute(MODULE_ATTR) || "";
          const li = document.createElement("li");
          li.className = "tooltip-li";
          li.dataset.module = mod;
          li.textContent = label;
          t.querySelector("ul").appendChild(li);
        });
      }
    } else {
      const mod = item.getAttribute(MODULE_ATTR) || "";
      const li = document.createElement("li");
      li.className = "tooltip-li";
      li.dataset.module = mod;
      li.textContent = title;
      t.querySelector("ul").appendChild(li);
    }

    document.body.appendChild(t);
    tooltipEl = t;

    // position
    const sbRect = SIDEBAR.getBoundingClientRect();
    const itRect = item.getBoundingClientRect();
    let top = itRect.top;
    const left = Math.round(sbRect.right + 10);
    const maxTop = window.innerHeight - t.offsetHeight - 8;
    if (top > maxTop) top = maxTop;
    if (top < 8) top = 8;
    t.style.left = `${left}px`;
    t.style.top = `${top}px`;

    // attach handlers for tooltip items
    t.querySelectorAll(".tooltip-li").forEach(li => {
      li.addEventListener("click", ev => {
        ev.stopPropagation();
        const mod = norm(li.dataset.module);
        if (!mod) return;
        removeTooltipImmediate();
        openModuleByName(mod);
      });
    });

    t.addEventListener("mouseenter", () => tooltipHover = true);
    t.addEventListener("mouseleave", () => { tooltipHover = false; scheduleRemoveTooltip(); });
  }

  /* -------------------------
     Open module (delegado a spa)
  ------------------------- */
  function openModuleByName(name) {
    name = norm(name);
    if (!name) return;

    // prefer window.spa.cargarModulo (we set spa in spa.js)
    if (window.spa && typeof window.spa.cargarModulo === "function") {
      window.spa.cargarModulo(name);
      return;
    }
    // fallback to SPA.loadModule (older)
    if (window.SPA && typeof window.SPA.loadModule === "function") {
      window.SPA.loadModule(name);
      return;
    }

    console.warn("principal.js: No se encontró función SPA para cargar módulos");
  }

  /* -------------------------
     Delegación click en menu
  ------------------------- */
  MENU.addEventListener("click", e => {
    const btn = e.target.closest(".menu-item, .sub-item");
    if (!btn) return;

    // If sidebar collapsed and item has children -> tooltip
    if (SIDEBAR.classList.contains("collapsed") && btn.classList.contains("has-children")) {
      createTooltipForItem(btn);
      return;
    }

    // If item has children and sidebar expanded -> open submenu
    if (btn.classList.contains("has-children") && !SIDEBAR.classList.contains("collapsed")) {
      openSubmenu(btn);
      return;
    }

    // Normal module open
    const mod = norm(btn.getAttribute(MODULE_ATTR) || btn.dataset.module || "");
    if (mod) {
      openModuleByName(mod);
      removeTooltipImmediate();
    }
  });

  /* -------------------------
     Hover tooltips (only when collapsed)
  ------------------------- */
  MENU.addEventListener("mouseover", e => {
    if (!SIDEBAR.classList.contains("collapsed")) return;
    if (isTouch) return;
    const item = e.target.closest(".menu-item, .sub-item");
    if (!item) return;
    if (!item.getAttribute(TITLE_ATTR) && !item.getAttribute(MODULE_ATTR)) return;
    if (tooltipTimer) clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => createTooltipForItem(item), 80);
  });

  MENU.addEventListener("mouseout", () => {
    if (!SIDEBAR.classList.contains("collapsed")) return;
    if (isTouch) return;
    scheduleRemoveTooltip();
  });

  // click outside to close tooltip
  document.addEventListener("click", e => {
    if (!tooltipEl) return;
    if (e.target.closest(".menu-tooltip") || e.target.closest(".menu-item") || e.target.closest(".sub-item")) return;
    removeTooltipImmediate();
  });

  // escape key closes
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      removeTooltipImmediate();
      closeAllSubmenus();
    }
  });

  // resize -> close tooltip
  window.addEventListener("resize", removeTooltipImmediate);

  // Auto load initial module if provided
  document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.body.dataset.inicio;
    if (inicio) openModuleByName(inicio);
  });

})();


