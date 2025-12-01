/* ======================================================
   spa.js — MIDAS (Versión PRO Estable + FIX 2025)
   - Corrige bloqueo al cargar módulos inexistentes
   - Restablece estado después de errores
   - Permite volver a módulos válidos sin recargar
====================================================== */

console.log = function(){};

(function () {
    if (window.__spa_initialized) return;
    window.__spa_initialized = true;

    const container = document.getElementById("module-container");
    if (!container) {
        console.error("spa.js: ERROR → No existe #module-container");
        return;
    }

    window.__spa_cache = {};

    let loading = false;

    const pathHtml = (m) => `/midas/Sesion_Iniciada/modulos/${m}/${m}.php?v=${Date.now()}`;
    const pathCss  = (m) => `/midas/Sesion_Iniciada/modulos/${m}/${m}.css?v=${Date.now()}`;
    const pathJs   = (m) => `/midas/Sesion_Iniciada/modulos/${m}/${m}.js?v=${Date.now()}`;

    function removeModuleAssets(mod) {
        if (!mod) return;

        const css = document.getElementById(`midas-style-${mod}`);
        if (css) css.remove();

        const js = document.getElementById(`midas-script-${mod}`);
        if (js) js.remove();
    }

    function callUnload(mod) {
        if (!mod) return;
        const fn = window[`midas_unload_${mod}`];
        if (typeof fn === "function") {
            try { fn(); } catch (err) { console.error(err); }
        }
    }

    function loadCSS(mod) {
        return new Promise((resolve) => {
            const id = `midas-style-${mod}`;
            if (document.getElementById(id)) return resolve();
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = pathCss(mod);
            link.id = id;
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        });
    }

    function loadJS(mod) {
        return new Promise((resolve) => {
            const id = `midas-script-${mod}`;
            if (document.getElementById(id)) return resolve();
            const script = document.createElement("script");
            script.src = pathJs(mod);
            script.id = id;
            script.onload = resolve;
            script.onerror = resolve;
            document.body.appendChild(script);
        });
    }

    /* ======================================================
       FUNCIÓN PRINCIPAL PARA CARGAR MÓDULOS
       (Con FIX de recuperación tras error)
    ====================================================== */
    window.spa = {};
    window.spa.cargarModulo = async function (mod, opts = {}) {

        mod = String(mod).trim().toLowerCase();
        const force = opts.force || false;

        // 🔥 FIX → Si hubo error previo, siempre permitir recargar
        if (mod === window.__currentModule && !force) {
            return;
        }

        if (loading) return console.warn("SPA: Ignorado, ya está cargando otro módulo.");
        loading = true;


        try {
            const prev = window.__currentModule;

            // Descarga módulo anterior
            if (prev) {
                callUnload(prev);
                removeModuleAssets(prev);
            }

            const htmlUrl = pathHtml(mod);
                let html;

                if (window.__spa_cache[mod]) {
                     html = window.__spa_cache[mod];
                    } else {
                         const resp = await fetch(htmlUrl, { cache: "no-cache" });
                                if (!resp.ok) {
                             throw new Error(`HTTP ${resp.status} → NO EXISTE el módulo '${mod}'`);
                                    }
                                 html = await resp.text();
                                     window.__spa_cache[mod] = html;
                                }
            container.classList.remove("loaded");
            container.innerHTML = html;
            setTimeout(() => container.classList.add("loaded"), 10);


            await loadCSS(mod);
            await loadJS(mod);

            // Si todo salió bien, actualizar módulo actual
            window.__currentModule = mod;

            const initFn = window[`midas_init_${mod}`];
            if (typeof initFn === "function") {
                try {
                    initFn(container.querySelector(`.${mod}-module`) || container);
                } catch (err) {
                    console.error(err);
                }
            }

        } catch (err) {
            // ❗ FIX IMPORTANTE:
            // NO mantener el módulo como activo si hubo error
            window.__currentModule = "";

            container.innerHTML = `
                <div style="padding:20px;color:red;">
                    <b>Error:</b><br>
                    ${err.message}<br><br>
                    <button onclick="spa.cargarModulo('home', {force:true})"
                        style="padding:10px 15px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">
                        Ir al inicio
                    </button>
                </div>`;
        }

        loading = false;
    };

})();


/* ======================================================
   MEJORA SPA — Historial Real
   Permite usar los botones ATRÁS / ADELANTE del navegador
====================================================== */

window.addEventListener("popstate", (e) => {
    if (e.state && e.state.mod) {
        spa.cargarModulo(e.state.mod, { force: true });
    }
});

const _originalLoad = window.spa.cargarModulo;
window.spa.cargarModulo = async function(mod, opts = {}) {
    const push = opts.pushState !== false;

    await _originalLoad(mod, opts);

    if (push) {
        history.pushState({ mod }, "", `#${mod}`);
    }
};

window.addEventListener("load", () => {
    const mod = location.hash.replace("#","") || "usuarios";
    spa.cargarModulo(mod, { force: true, pushState: false });
});


