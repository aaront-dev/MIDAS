// /midas/Sesion_Iniciada/modulos/categorias/categorias.js (REEMPLAZAR COMPLETO)
(() => {

    console.log("📌 categorias.js (PRO) cargado - versión final integrada");

    const API_CAT = "/midas/Sesion_Iniciada/api/categorias";
    const API_SUB = "/midas/Sesion_Iniciada/api/subcategorias";

// showConfirm por esta versión basada en Swal (usa el theme Black & Gold)
async function showConfirm(message, title = "Confirmación") {
    // Aseguramos que Swal exista
    if (typeof Swal !== "object" || typeof Swal.fire !== "function") {
        // como último recurso (muy improbable) usar confirm nativo
        return Promise.resolve(window.confirm(message));
    }

    // Si el modal principal está abierto, lo ocultamos temporalmente para evitar superposición
    const modalVisible = modal && !modal.classList.contains("hidden");
    if (modalVisible) {
        // no destruimos estado, solo ocultamos la interfaz
        modal.classList.add("hidden");
    }

    const result = await Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        background: "#111",
        color: "#f4d35e",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#444",
        allowOutsideClick: false,
        // Opcional: mejora de z-index si hiciera falta (normalmente no)
        customClass: {
            popup: 'swal-pro-popup'
        }
    });

    // Restaurar modal si estaba visible (dejamos en estado etapa1 por seguridad)
    if (modalVisible) {
        // Al volver mostrar en etapa1 para que no tape el Swal la próxima vez
        setModoEtapa1();
        // si prefieres que siga abierto en etapa2, cámbialo; por ahora lo ocultamos y reiniciamos estado
    }

    return !!result.isConfirmed;
}


    // Root tolerante
    let root = document.querySelector(".categorias-module");
    if (!root) root = document.querySelector("#categorias-module");
    if (!root) root = document.getElementById("modCategorias");
    if (!root) {
        console.warn("categorias.js: no se encontró el root ('.categorias-module'|'#categorias-module'|'#modCategorias'). El script no continuará.");
        return;
    }

    // DOM (chequeos defensivos)
    const tableBody = root.querySelector("#categoriasTable tbody");
    const modal = root.querySelector("#categoriaModal");
    const modalTitle = root.querySelector("#modalTitle");

    const inpId = root.querySelector("#categoria_id");
    const inpNombre = root.querySelector("#nombre_input") || root.querySelector("#categoria_nombre") || root.querySelector("input[name='nombre']");

    const btnNew = root.querySelector("#btnNuevaCategoria");
    const btnSave = root.querySelector("#btnSaveCategoria");
    const btnCancel = root.querySelector("#btnCancelCategoria"); // opcional en HTML

    // Subcats DOM
    const subcatsList = root.querySelector("#subcats_list");
    const newSubcatInput = root.querySelector("#new_subcat_input");
    const btnAddSubcat = root.querySelector("#btnAddSubcat");
    const subcatHint = root.querySelector("#subcat_hint");

    // Finalizar & Volver
    const btnFinalizar = document.getElementById("btnFinalizar");

    const btnVolver = root.querySelector("#btnVolverCategoria"); // ahora buscando dentro del root también

    // small helper para chequear elementos requeridos
    function elOk(el, name) {
        if (!el) console.warn(`categorias.js: elemento faltante -> ${name}`);
        return !!el;
    }

// Toast PRO sin fallback a alert()
async function toast(msg, type = "success") {
    await waitForSwal(); // Garantiza que SweetAlert ya cargó

    let config = {
        text: msg,
        background: "#111",
        color: "#f4d35e",
        confirmButtonColor: "#26a300ff",
        confirmButtonText: "Aceptar",
    };

    switch (type) {
        case "success":
            config.title = "¡Operación exitosa!";
            config.icon = "success";
            break;

        case "error":
            config.title = "Error";
            config.icon = "error";
            config.confirmButtonColor = "#d9534f";
            break;

        case "warning":
            config.title = "Atención";
            config.icon = "warning";
            config.confirmButtonColor = "#f4d35e";
            break;

        case "danger":
            config.title = "Acción peligrosa";
            config.icon = "warning";
            config.confirmButtonColor = "#d9534f";
            break;

        default:
            config.title = "Aviso";
            config.icon = "info";
            break;
    }

    return Swal.fire(config);  // Si Swal existe, SIEMPRE se usa
}




// Espera a que SweetAlert esté disponible
async function waitForSwal() {
    let intentos = 0;
    while ((!window.Swal || typeof Swal.fire !== "function") && intentos < 40) {
        await new Promise(r => setTimeout(r, 50));
        intentos++;
    }
    return window.Swal && typeof Swal.fire === "function";
}

        // confirm PRO — sin fallback a confirm()
        async function confirmSwal(options = {}) {
            const ok = await waitForSwal();

            if (!ok) {
                console.warn("SweetAlert no cargó. confirmSwal ignorado.");
                return false;
            }

            const res = await Swal.fire({
                background: "#111",
                color: "#f4d35e",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#444",
                ...options
            });

            return !!res.isConfirmed;
        }



    function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

    /*********** ESTADOS INICIALES ***********/
    elOk(tableBody, "tableBody");
    elOk(modal, "modal");
    elOk(modalTitle, "modalTitle");
    elOk(inpNombre, "inpNombre");
    elOk(subcatsList, "subcatsList");
    elOk(newSubcatInput, "newSubcatInput");
    elOk(btnAddSubcat, "btnAddSubcat");
    elOk(btnSave, "btnSave");
    elOk(btnFinalizar, "btnFinalizar");
    elOk(btnVolver, "btnVolver");

    // estado global: si estamos en etapa 2
    let modoEtapa2 = false;

    // Inicializar estados
    function initModalStateDefaults() {
        if (newSubcatInput) { newSubcatInput.value = ""; newSubcatInput.disabled = true; }
        if (btnAddSubcat) { btnAddSubcat.disabled = true; }
        if (btnFinalizar) {
            try { btnFinalizar.style.display = "none"; } catch(e) {}
            btnFinalizar.disabled = true;
        }
        if (btnSave) btnSave.disabled = false;
        if (subcatsList) subcatsList.innerHTML = "";
        if (subcatHint) subcatHint.textContent = "Guarda la categoría primero para habilitar subcategorías.";
        if (btnVolver) {
            try { btnVolver.classList.add("hidden"); } catch(e) {}
            btnVolver.disabled = true;
        }
    }

    initModalStateDefaults();

    /*********** MODO 1/2 ***********/
    function setModoEtapa1() {
        modoEtapa2 = false;
        if (btnVolver) { btnVolver.classList.add("hidden"); btnVolver.disabled = true; }
        if (btnSave) btnSave.disabled = false;
        if (newSubcatInput) newSubcatInput.disabled = true;
        if (btnAddSubcat) btnAddSubcat.disabled = true;
        if (btnFinalizar) btnFinalizar.classList.add("hidden");
        if (subcatHint) subcatHint.textContent = "Guarda la categoría primero para habilitar subcategorías.";
    }

    function setModoEtapa2() {
        modoEtapa2 = true;
        if (btnFinalizar) btnFinalizar.classList.remove("hidden");
        if (btnVolver) { btnVolver.classList.remove("hidden"); btnVolver.disabled = false; }
        if (btnSave) btnSave.disabled = true;
        if (newSubcatInput) newSubcatInput.disabled = false;
        if (btnAddSubcat) btnAddSubcat.disabled = false;
        if (subcatHint) subcatHint.textContent = "Agrega al menos una subcategoría.";
    }

    /*********** CATEGORÍAS: FETCH / RENDER ***********/
    async function fetchCategorias() {
        if (!elOk(tableBody, "tableBody")) return;
        try {
            const res = await fetch(`${API_CAT}/list.php`);
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            renderCategorias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("fetchCategorias:", err);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:18px;color:#c00">Error cargando categorías</td></tr>`;
            toast("Error cargando categorías", "error");
        }
    }

    function renderCategorias(rows) {
        if (!elOk(tableBody, "tableBody")) return;
        tableBody.innerHTML = "";
        if (!rows || !rows.length) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#666">No hay categorías</td></tr>`;
            return;
        }

        rows.forEach(cat => {
            const subs = Array.isArray(cat.subcategorias) ? cat.subcategorias : [];
            const subsText = subs.length ? subs.map(s => escapeHtml(s.nombre)).join(", ") : "<span style='color:#888'>—</span>";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="width:70px;text-align:center">${cat.id}</td>
                <td>${escapeHtml(cat.nombre)}</td>
                <td>${subsText}</td>
                <td style="white-space:nowrap">
                    <button class="btn small edit" data-id="${cat.id}">Editar</button>
                    <button class="btn small danger del" data-id="${cat.id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Delegar eventos
        tableBody.querySelectorAll(".edit").forEach(b => b.addEventListener("click", onEdit));
        tableBody.querySelectorAll(".del").forEach(b => b.addEventListener("click", onDelete));
    }

    /*********** MODAL ***********/
    function abrirModal(data = null) {
        console.log("abrirModal DATA:", data);

        if (!elOk(modal, "modal") || !elOk(modalTitle, "modalTitle")) return;

        if (data) {
            // ETAPA 2 (editar)
            setModoEtapa2();
            modalTitle.textContent = "Editar Categoría";
            if (inpId) inpId.value = data.id ?? "";
            if (inpNombre) inpNombre.value = data.nombre ?? data[0]?.nombre ?? "";
            if (btnCancel) btnCancel.classList.add("hidden");
            if (newSubcatInput) newSubcatInput.disabled = false;
            if (btnAddSubcat) btnAddSubcat.disabled = false;
            if (subcatHint) subcatHint.textContent = "Agrega subcategorías si lo deseas.";

            if (Array.isArray(data.subcategorias)) {
                renderSubcategorias(data.subcategorias);
            } else if (data.id) {
                fetchSubcategorias(data.id);
            } else {
                const candidateId = data[0]?.id ?? null;
                if (candidateId) fetchSubcategorias(candidateId);
                else renderSubcategorias([]);
            }

            if (btnSave) btnSave.disabled = false;

        } else {
            // ETAPA 1 (nueva)
            setModoEtapa1();
            modalTitle.textContent = "Nueva Categoría";
            if (inpId) inpId.value = "";
            if (inpNombre) inpNombre.value = "";
            initModalStateDefaults();
            if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
        }

        // Mostrar modal (con animación si tu CSS lo maneja)
        modal.classList.remove("hidden");
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add("hidden");
        initModalStateDefaults();
        setModoEtapa1();
    }

    /*********** GUARDAR CATEGORÍA (CREATE / UPDATE) ***********/
    if (btnSave) {
        btnSave.addEventListener("click", async () => {
            const id = (inpId?.value || "").trim();
            const nombre = (inpNombre?.value || "").trim();

            if (!nombre) {
                toast("Ingresa un nombre para la categoría", "error");
                return;
            }

            const fd = new FormData();
            fd.append("nombre", nombre);
            if (id) fd.append("id", id);

            try {
                const url = id ? `${API_CAT}/update.php` : `${API_CAT}/create.php`;
                const res = await fetch(url, { method: "POST", body: fd });
                const json = await res.json();

                // Manejo específico: si servidor dice que ya existe → preguntar para editar
                if ((!json || !json.success) && json && typeof json.message === "string" && /existe|already exists|exist/i.test(json.message)) {
                    const modify = await Swal.fire({
                        title: "La categoría ya existe",
                        text: "¿Deseas modificarla?",
                        icon: "info",
                        background: "#111",
                        color: "#f4d35e",
                        showCancelButton: true,
                        confirmButtonText: "Modificar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#28a745",
                        cancelButtonColor: "#444"
                    });
                    if (!modify.isConfirmed) return;
                    // buscar y abrir
                    try {
                        const rsearch = await fetch(`${API_CAT}/list.php`);
                        const all = await rsearch.json();
                        if (Array.isArray(all)) {
                            const found = all.find(c => (c.nombre || "").toLowerCase() === nombre.toLowerCase());
                            if (found) {
                                abrirModal(found);
                                toast("Abriendo categoría para edición", "success");
                                return;
                            }
                        }
                        toast("No se pudo localizar la categoría existente", "error");
                    } catch (e) {
                        console.warn("Error buscando categoría existente:", e);
                        toast("Error buscando categoría existente", "error");
                    }
                    return;
                }

                if (!json || !json.success) {
                    const msg = (json && json.message) ? json.message : "Ocurrió un problema al guardar.";
                    toast(msg, "error");
                    return;
                }

                // Éxito
                await toast(json.message || "Guardado correctamente", "success");

                // refrescar tabla principal
                await fetchCategorias();

                // Si era creación: mantener modal abierto y habilitar subcategorías.
                if (!id) {
                    let newId = json.id ?? null;

                    if (!newId) {
                        try {
                            const res2 = await fetch(`${API_CAT}/list.php`);
                            const all = await res2.json();
                            if (Array.isArray(all)) {
                                const found = all.find(c => (c.nombre || "").toLowerCase() === nombre.toLowerCase());
                                newId = found?.id ?? null;
                            }
                        } catch (e) {
                            console.warn("No se pudo obtener id tras crear", e);
                        }
                    }

                    if (newId) {
                        try {
                            const r3 = await fetch(`${API_CAT}/list.php?id=${encodeURIComponent(newId)}`);
                            const arr = await r3.json();
                            const data = Array.isArray(arr) ? arr[0] : arr;
                            if (newSubcatInput) newSubcatInput.disabled = false;
                            if (btnAddSubcat) btnAddSubcat.disabled = false;
                            if (inpId) inpId.value = newId;
                            abrirModal(data || { id: newId, nombre });
                            // asegurar modo etapa2
                            setModoEtapa2();
                            if (btnSave) btnSave.disabled = true;
                            if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
                        } catch (e) {
                            // fallback
                            if (newSubcatInput) newSubcatInput.disabled = false;
                            if (btnAddSubcat) btnAddSubcat.disabled = false;
                            if (subcatsList) subcatsList.innerHTML = `<div style="color:#666">No hay subcategorías</div>`;
                            if (subcatHint) subcatHint.textContent = "Ahora puedes agregar subcategorías.";
                            if (btnSave) btnSave.disabled = true;
                            if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
                        }
                    } else {
                        if (newSubcatInput) newSubcatInput.disabled = false;
                        if (btnAddSubcat) btnAddSubcat.disabled = false;
                        if (subcatsList) subcatsList.innerHTML = `<div style="color:#666">No hay subcategorías</div>`;
                        if (subcatHint) subcatHint.textContent = "Ahora puedes agregar subcategorías.";
                        if (inpId) inpId.value = "";
                        if (btnSave) btnSave.disabled = true;
                        if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
                    }
                } else {
                    // si fue edit, cerramos modal
                    closeModal();
                }

            } catch (err) {
                console.error("saveCategoria:", err);
                toast("Error guardando categoría", "error");
            }
        });
    } else {
        console.warn("categorias.js: btnSave no encontrado (#btnSaveCategoria)");
    }

    // btnCancel original: si existe, cerrar modal en etapa1
    if (btnCancel) {
        btnCancel.addEventListener("click", () => {
            if (!modoEtapa2) {
                closeModal();
            } else {
                setModoEtapa1();
            }
        });
    }

    // btnNew abrir modal
    if (btnNew) btnNew.addEventListener("click", () => abrirModal());

    /*********** EDIT / DELETE ***********/
    async function onEdit(e) {
        const id = e.currentTarget.dataset.id;
        try {
            const res = await fetch(`${API_CAT}/list.php?id=${encodeURIComponent(id)}`);
            const data = await res.json();
            const item = Array.isArray(data) ? data[0] : data;
            abrirModal(item || { id, nombre: "" });
        } catch (err) {
            console.error("onEdit:", err);
            toast("Error cargando categoría", "error");
        }
    }

    async function onDelete(e) {
        const id = e.currentTarget.dataset.id;
        const confirmar = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "Todos los productos asociados pueden verse afectados",
            icon: "warning",
            background: "#111",
            color: "#f4d35e",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonColor: "#444",
            confirmButtonColor: "#d9534f"
        });
        if (!confirmar.isConfirmed) return;

        try {
            const fd = new FormData();
            fd.append("id", id);
            const res = await fetch(`${API_CAT}/delete.php`, { method: "POST", body: fd });
            const json = await res.json();
            if (!json.success) {
                toast(json.message || "Error eliminando", "error");
                return;
            }
            toast(json.message || "Categoría eliminada", "success");
            fetchCategorias();
        } catch (err) {
            console.error("deleteCategoria:", err);
            toast("Error eliminando", "error");
        }
    }

    /*********** SUBCATEGORÍAS ***********/
    async function fetchSubcategorias(catId) {
        if (!elOk(subcatsList, "subcatsList")) return;
        if (!catId) {
            subcatsList.innerHTML = `<div style="color:#666">Guarda la categoría para ver/agregar subcategorías.</div>`;
            if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
            return;
        }
        try {
            const res = await fetch(`${API_SUB}/list.php?categoria_id=${encodeURIComponent(catId)}`);
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            renderSubcategorias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("fetchSubcategorias:", err);
            subcatsList.innerHTML = `<div style="color:#c00">Error cargando subcategorías</div>`;
        }
    }

    function renderSubcategorias(list) {
        if (!elOk(subcatsList, "subcatsList")) return;
        subcatsList.innerHTML = "";
        if (!list || !list.length) {
            subcatsList.innerHTML = `<div style="color:#666">No hay subcategorías</div>`;
            if (btnFinalizar) { btnFinalizar.style.display = "none"; btnFinalizar.disabled = true; }
            return;
        }

        list.forEach(s => {
            const row = document.createElement("div");
            row.className = "subcat-row";
            row.dataset.id = s.id;
            row.style = "display:flex; align-items:center; justify-content:space-between; gap:10px; padding:6px 8px; border-radius:6px; background:#f6f6f6; margin-bottom:8px;";
            row.innerHTML = `<div style="font-weight:600">${escapeHtml(s.nombre)}</div>
                             <div><button class="btn small danger del-sub" data-id="${s.id}">Eliminar</button></div>`;
            subcatsList.appendChild(row);
        });

        // attach delete handlers (delegado)
        subcatsList.querySelectorAll(".del-sub").forEach(b => b.addEventListener("click", async (ev) => {
            const id = ev.currentTarget.dataset.id;
            const confirmar = await Swal.fire({
                title: "¿Eliminar subcategoría?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                background: "#111",
                color: "#f4d35e",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d9534f",
                cancelButtonColor: "#444",
            });

            if (!confirmar.isConfirmed) return;
            try {
                const fd = new FormData(); fd.append("id", id);
                const res = await fetch(`${API_SUB}/delete.php`, { method: "POST", body: fd });
                const json = await res.json();
                if (!json.success) {
                    toast(json.message || "Error eliminando", "error");
                    return;
                }
                toast(json.message || "Subcategoría eliminada", "success");
                const catId = inpId?.value || null;
                fetchSubcategorias(catId);
                fetchCategorias();
            } catch (err) {
                console.error("delSubcat:", err);
                toast("Error eliminando subcategoría", "error");
            }
        }));

        const count = list.length;
        if (btnFinalizar) {
            if (count >= 1) {
                btnFinalizar.style.display = "";
                btnFinalizar.disabled = false;
            } else {
                btnFinalizar.style.display = "none";
                btnFinalizar.disabled = true;
            }
        }

        if (modoEtapa2 && btnVolver) {
            btnVolver.classList.remove("hidden");
            btnVolver.disabled = false;
        }
    }

    // Agregar subcategoria (inline)
    if (btnAddSubcat) {
        btnAddSubcat.addEventListener("click", async () => {
            const nombre = (newSubcatInput?.value || "").trim();
            const catId = inpId?.value;
            if (!catId) return toast("Guarda la categoría antes de agregar subcategorías", "error");
            if (!nombre) return toast("Ingresa nombre de subcategoría", "error");

            try {
                const fd = new FormData();
                fd.append("categoria_id", catId);
                fd.append("nombre", nombre);

                const res = await fetch(`${API_SUB}/create.php`, { method: "POST", body: fd });
                const json = await res.json();

                // if server says subcategory exists, ask to associate / refresh
                if ((!json || !json.success) && json && typeof json.message === "string" && /existe|already exists|exist/i.test(json.message)) {
                    const associate = await Swal.fire({
                        title: "La subcategoría ya existe",
                        text: "¿Deseas asociarla/usar la existente?",
                        icon: "question",
                        background: "#111",
                        color: "#f4d35e",
                        showCancelButton: true,
                        confirmButtonText: "Sí, asociar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#28a745",
                        cancelButtonColor: "#444"
                    });
                    if (!associate.isConfirmed) return;
                    if (newSubcatInput) newSubcatInput.value = "";
                    fetchSubcategorias(catId);
                    fetchCategorias();
                    if (btnFinalizar) { btnFinalizar.style.display = ""; btnFinalizar.disabled = false; }
                    setModoEtapa2();
                    toast("Subcategoría asociada", "success");
                    return;
                }

                if (!json.success) return toast(json.message || "Error creando subcategoría", "error");

                toast(json.message || "Subcategoría creada", "success");
                if (newSubcatInput) newSubcatInput.value = "";
                fetchSubcategorias(catId);
                fetchCategorias();
                if (btnFinalizar) { btnFinalizar.style.display = ""; btnFinalizar.disabled = false; }
                setModoEtapa2();

            } catch (err) {
                console.error("addSubcat:", err);
                toast("Error creando subcategoría", "error");
            }
        });
    } else {
        console.warn("categorias.js: btnAddSubcat no encontrado (#btnAddSubcat)");
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", async () => {

            const confirmFinish = await Swal.fire({
                title: "Finalizar",
                text: "¿Deseas finalizar y cerrar el registro?",
                icon: "success",
                background: "#111",
                color: "#f4d35e",
                showCancelButton: true,
                confirmButtonText: "Sí, finalizar",
                cancelButtonText: "Seguir editando",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#444"
            });

            if (!confirmFinish.isConfirmed) return;

            await toast("¡Registro completado con éxito!", "success");

            closeModal();

            // reset UI
            setModoEtapa1();
            initModalStateDefaults();

            if (inpId) inpId.value = "";
            if (inpNombre) inpNombre.value = "";
            if (btnSave) btnSave.disabled = false;
            if (btnCancel) btnCancel.classList.remove("hidden");
            if (btnFinalizar) btnFinalizar.classList.add("hidden");

            await fetchCategorias();
        });
    }


    // Volver button: behavior depends on mode
// Volver button: behavior depends on mode
if (btnVolver) {
    btnVolver.addEventListener("click", async () => {

        if (modoEtapa2) {
            const catId = inpId?.value ?? null;

            if (!catId) {
                setModoEtapa1();
                return;
            }

            try {
                // consultar subcategorías
                const res = await fetch(`${API_SUB}/list.php?categoria_id=${encodeURIComponent(catId)}`);
                const subcats = await res.json();

                // si NO tiene subcategorías → preguntar con SweetAlert
                if (!Array.isArray(subcats) || subcats.length === 0) {

                    const confirmar = await confirmSwal({
                        title: "¿Deseas continuar?",
                        text: "Al volver a ingresar la categoría se eliminará el registro.",
                        icon: "warning",
                        background: "#111",
                        color: "#f4d35e",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#d9534f",
                        cancelButtonColor: "#444"
                    });

                    if (!confirmar) return; // usuario dijo NO

                    // eliminar categoría
                    try {
                        const fd = new FormData();
                        fd.append("id", catId);

                        const delRes = await fetch(`${API_CAT}/delete.php`, {
                            method: "POST",
                            body: fd
                        });

                        const delJson = await delRes.json();

                        if (!delJson || !delJson.success) {
                            toast(delJson?.message || "Error eliminando categoría", "error");
                        } else {
                            closeModal();
                            toast(delJson.message || "Categoría eliminada", "success");
                            await fetchCategorias();
                        }

                    } catch (errDel) {
                        console.error("Error eliminando categoria (fetch):", errDel);
                        toast("Error eliminando categoría", "error");
                    }
                }

            } catch (e) {
                console.warn("Error al consultar subcategorías:", e);
                toast("Error consultando subcategorías", "error");
            }

            // restablecer estado UI (si no eliminó, volvemos a etapa1)
            setModoEtapa1();
            if (btnCancel) btnCancel.classList.remove("hidden");
            if (btnSave) btnSave.disabled = false;

            if (inpId) inpId.value = "";
            if (inpNombre) inpNombre.value = "";
            initModalStateDefaults();

            return;
        }

        // etapa 1 normal → cerrar modal
        closeModal();
    });
}


    // INIT
    fetchCategorias();

})();
