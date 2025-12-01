console.log = function(){};
console.log("productos.js: cargado (PRO)");

if (!window.__midas_productos_flags) window.__midas_productos_flags = {};

window.midas_init_productos = function (root) {
  if (!root) return;

  if (window.__midas_productos_flags.initialized) {
    if (typeof window.midas_unload_productos === "function") {
      window.midas_unload_productos();
    }
  }

  window.__midas_productos_flags.initialized = true;
  console.log("midas_init_productos: inicializando", root);

  /* ------------------------------
     SELECTORES
  ------------------------------ */
  const tableBody = root.querySelector("#productosTable tbody");
  const btnNuevo = root.querySelector("#btnNuevoProducto");
  const modal = root.querySelector("#productoModal");
  const modalTitle = root.querySelector("#modalTitle");

  const inpId = root.querySelector("#producto_id");
  const inpNombre = root.querySelector("#nombre_input");
  const inpDescripcion = root.querySelector("#descripcion_input");
  const inpPrecio = root.querySelector("#precio_input");
  const inpStock = root.querySelector("#stock_input");
  const inpCategoria = root.querySelector("#categoria_input");
  const inpSubcategoria = root.querySelector("#subcategoria_input");

  const btnSave = root.querySelector("#btnSaveProducto");
  const btnCancel = root.querySelector("#btnCancelProducto");

  const API = "/midas/Sesion_Iniciada/api/productos";
  const API_CAT = "/midas/Sesion_Iniciada/api/categorias";
  const API_SUB = "/midas/Sesion_Iniciada/api/subcategorias";

  let cleanup = [];

  function addListener(target, ev, fn, opts) {
    target.addEventListener(ev, fn, opts);
    cleanup.push({ target, ev, fn, opts });
  }

  function removeAllListeners() {
    cleanup.forEach(h => {
      try { h.target.removeEventListener(h.ev, h.fn, h.opts); } catch(e){}
    });
    cleanup = [];
  }

  /* ------------------------------
     HELPERS
  ------------------------------ */
  function toast(msg, type="success") {
    try {
      Toastify({
        text: msg,
        duration: 2500,
        gravity: "top",
        position: "right",
        style: {
          background: type === "success"
            ? "linear-gradient(to right,#00b09b,#96c93d)"
            : "linear-gradient(to right,#b31217,#e52d27)"
        }
      }).showToast();
    } catch(e) { console.log(msg); }
  }

  function escapeHtml(s){
    return (s||"").toString().replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  /* ------------------------------
     SUBCATEGORÍAS DINÁMICAS
  ------------------------------ */
  async function cargarSubcategorias(categoriaId, selectedId = "") {
    inpSubcategoria.innerHTML = `<option value="">Sin subcategoría</option>`;

    if (!categoriaId) return;

    try {
      const res = await fetch(`${API_SUB}/list.php?categoria_id=${categoriaId}`);
      const data = await res.json();

      data.forEach(sc => {
        const opt = document.createElement("option");
        opt.value = sc.id;
        opt.textContent = sc.nombre;
        if (selectedId && selectedId == sc.id) opt.selected = true;
        inpSubcategoria.appendChild(opt);
      });
    } catch (err) {
      console.error("Error cargando subcategorías:", err);
    }
  }

  /* ------------------------------
     API PRINCIPAL
  ------------------------------ */
  async function cargarCategorias() {
    const res = await fetch(`${API_CAT}/list.php`);
    const cats = await res.json();

    inpCategoria.innerHTML = `<option value="">Sin categoría</option>`;
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombre;
      inpCategoria.appendChild(opt);
    });
  }

  async function cargarProductos() {
    const res = await fetch(`${API}/list.php`);
    const data = await res.json();
    renderRows(data);
  }

  async function fetchProductoById(id) {
    const res = await fetch(`${API}/get.php?id=${id}`);
    return res.json();
  }

  async function saveProducto(form) {
    const url = form.get("id") ? `${API}/update.php` : `${API}/create.php`;
    const res = await fetch(url, { method: "POST", body: form });
    return res.json();
  }

  async function deleteProductoApi(id) {
    const fd = new FormData();
    fd.append("id", id);
    const res = await fetch(`${API}/delete.php`, { method:"POST", body: fd });
    return res.json();
  }

  /* ------------------------------
     MODAL
  ------------------------------ */
  function openModal(data = null) {
    modalTitle.textContent = data ? "Editar producto" : "Nuevo producto";

    inpId.value = data?.id || "";
    inpNombre.value = data?.nombre || "";
    inpDescripcion.value = data?.descripcion || "";
    inpPrecio.value = data?.precio || "";
    inpStock.value = data?.stock || "";
    inpCategoria.value = data?.categoria_id || "";

    // 🔥 NUEVO → cargar subcategorías del producto
    if (data?.categoria_id) {
      cargarSubcategorias(data.categoria_id, data.subcategoria_id);
    } else {
      cargarSubcategorias("", "");
    }

    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  /* ------------------------------
     RENDER TABLA
  ------------------------------ */
function renderRows(rows) {
    tableBody.innerHTML = "";

    const list = Array.isArray(rows) ? rows : [];

    if (!list.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:15px;color:#777">
                    No hay productos
                </td>
            </tr>`;
        return;
    }

    for (const p of list) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${escapeHtml(p.id)}</td>
            <td>${escapeHtml(p.nombre)}</td>
            <td>${escapeHtml(p.descripcion ?? "")}</td>
            <td>$${escapeHtml(p.precio ?? "")}</td>
            <td>${escapeHtml(p.stock ?? "")}</td>
            <td>${escapeHtml(p.categoria ?? "Sin categoría")}</td>
            <td>${escapeHtml(p.subcategoria ?? "Sin subcategoría")}</td>
            <td>${escapeHtml(p.fecha_creacion ?? "")}</td>
            <td>
                <button class="btn small edit" data-id="${p.id}">Editar</button>
                <button class="btn small danger del" data-id="${p.id}">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }
}


  /* ------------------------------
     EVENTOS
  ------------------------------ */

  addListener(btnNuevo, "click", () => openModal(null));

  addListener(inpCategoria, "change", () => {
    cargarSubcategorias(inpCategoria.value);
  });

  addListener(btnCancel, "click", () => closeModal());

  addListener(btnSave, "click", async () => {
    const form = new FormData();

    form.append("id", inpId.value);
    form.append("nombre", inpNombre.value.trim());
    form.append("descripcion", inpDescripcion.value.trim());
    form.append("precio", inpPrecio.value);
    form.append("stock", inpStock.value);
    form.append("categoria_id", inpCategoria.value);
    form.append("subcategoria_id", inpSubcategoria.value);

    if (!form.get("nombre")) {
      toast("Nombre obligatorio", "error");
      return;
    }

    const res = await saveProducto(form);
    if (res.success) {
      toast(res.message, "success");
      closeModal();
      cargarProductos();
    } else {
      toast(res.message, "error");
    }
  });

  // EDITAR / ELIMINAR
  addListener(tableBody, "click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.classList.contains("edit")) {
      const data = await fetchProductoById(id);
      openModal(data);
    }

    if (btn.classList.contains("del")) {
      const { value } = await Swal.fire({
        title: "¿Eliminar producto?",
        text: "No podrás deshacer esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });
      if (!value) return;

      const res = await deleteProductoApi(id);
      if (res.success) {
        toast("Producto eliminado");
        cargarProductos();
      } else {
        toast(res.message, "error");
      }
    }
  });

  /* ------------------------------
     START
  ------------------------------ */
  (async () => {
    await cargarCategorias();
    await cargarProductos();
  })();

  /* ------------------------------
     UNLOAD
  ------------------------------ */
  window.__midas_productos_cleanup = function () {
    closeModal();
    removeAllListeners();
    window.__midas_productos_flags.initialized = false;
  };

  window.midas_unload_productos = function () {
    if (window.__midas_productos_cleanup) {
      window.__midas_productos_cleanup();
      window.__midas_productos_cleanup = null;
    }
  };
};
