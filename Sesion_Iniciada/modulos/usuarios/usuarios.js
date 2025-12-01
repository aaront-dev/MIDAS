// /midas/Sesion_Iniciada/modulos/usuarios/usuarios.js
// Versión PRO final: init/unload + consumo de API real
console.log("usuarios.js: cargado (PRO - API)");

if (!window.__midas_usuarios_flags) window.__midas_usuarios_flags = {};
// Evitar reinicializar si ya estamos in
if (window.__midas_usuarios_flags.initialized) {
  console.log("usuarios.js: ya inicializado anteriormente (ignorado)");
}

// Exponer init que SPA llamará con el root correcto
window.midas_init_usuarios = function (root) {
  if (!root) {
    console.error("usuarios.js: root inválido");
    return;
  }

  // Si ya inicializamos previamente en esta session, limpiamos primero por si acaso
  if (window.__midas_usuarios_flags.initialized) {
    // llamar unload para resetear estado
    if (typeof window.midas_unload_usuarios === "function") {
      window.midas_unload_usuarios();
    }
  }

  window.__midas_usuarios_flags.initialized = true;
  console.log("midas_init_usuarios: inicializando con root", root);

  /* ------------------------------
     Selectores dentro de root
  ------------------------------ */
const tableBody      = root.querySelector("#usuariosTable tbody");
const searchInput    = root.querySelector(".search");
const perpageSelect  = root.querySelector(".perpage");
const msgArea        = root.querySelector("#usuarios-messages");

const modal          = root.querySelector("#usuarioModal");
const modalTitle     = root.querySelector("#modalTitle");

const inputId        = root.querySelector("#usuario_id");
const inputUser      = root.querySelector("#username_input"); 
const inputEmail     = root.querySelector("#email_input");     
const inputPassword  = root.querySelector("#clave_input");    
const inputRol       = root.querySelector("#rol_input");

const btnNuevo       = root.querySelector("#btnNuevoUsuario");
const btnCancel      = root.querySelector("#btnCancelUsuario");    // ← FIX
const btnSave        = root.querySelector("#btnSaveUsuario");      // ← FIX
       

  if (!tableBody || !modal) {
    console.error("usuarios.js: faltan elementos dentro del root");
    return;
  }

  /* ------------------------------
     Estado local
  ------------------------------ */
  const API = "/midas/Sesion_Iniciada/api/usuarios";
  let usuarios = [];
  let perpage = parseInt(perpageSelect?.value || 10);
  let search = "";

  // Para cleanup de listeners
  const cleanupHandlers = [];

  function addListener(target, ev, fn, opts) {
    target.addEventListener(ev, fn, opts);
    cleanupHandlers.push({ target, ev, fn, opts });
  }

  function removeAllListeners() {
    cleanupHandlers.forEach(h => {
      try { h.target.removeEventListener(h.ev, h.fn, h.opts); } catch (e) {}
    });
    cleanupHandlers.length = 0;
  }

  /* ------------------------------
     UI Helpers
  ------------------------------ */
  function toast(msg, type = "success") {
    try {
      const bg = type === "success"
        ? "linear-gradient(to right,#00b09b,#96c93d)"
        : "linear-gradient(to right,#b31217,#e52d27)";
      Toastify({ text: msg, duration: 3000, close: true, gravity: "top", position: "right", style: { background: bg } }).showToast();
    } catch (e) {
      console.log(type.toUpperCase(), msg);
    }
  }

  function showMessage(text, type = "success") {
    if (!msgArea) return;
    msgArea.innerHTML = `<div class="msg ${type}">${text}</div>`;
    setTimeout(() => { if (msgArea) msgArea.innerHTML = ""; }, 2500);
  }

function openModal(edit = false, data = null) {

    if (edit && data) {
        modalTitle.textContent = "Editar usuario";

        inputId.value = data.id ?? "";
        inputUser.value = data.usuario ?? data.username ?? "";
        inputEmail.value = data.email ?? "";
        
        inputPassword.value = ""; // seguridad, no se carga la contraseña

        // Rol puede venir como rol_id o rol
        inputRol.value = data.rol_id ?? data.rol ?? "2";

    } else {
        modalTitle.textContent = "Nuevo usuario";

        inputId.value = "";
        inputUser.value = "";
        inputEmail.value = "";
        inputPassword.value = "";
        inputRol.value = "2"; // rol por defecto
    }

    modal.classList.remove("hidden");
}


function closeModal() {
    if (modal) modal.classList.add("hidden");
}


  /* ------------------------------
     Render tabla
  ------------------------------ */
  function roleName(r) {
    return {1: "Administrador", 2:"Vendedor", 3:"Gestor inventario", 4:"Auditor"}[Number(r)] || "Usuario";
  }

  function renderTable() {
    tableBody.innerHTML = "";

    let list = usuarios.slice();

    if (search && search.length > 0) {
      const q = search.toLowerCase();
      list = list.filter(u => (u.usuario||"").toLowerCase().includes(q) || (u.email||"").toLowerCase().includes(q));
    }

    list = list.slice(0, perpage);

    if (!list.length) {
      tableBody.innerHTML = `<tr><td colspan="6" style="padding:18px;text-align:center;color:#777">No hay usuarios</td></tr>`;
      return;
    }

    for (const u of list) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align:center">${u.id}</td>
        <td>${escapeHtml(u.usuario)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(roleName(u.rol_id ?? u.rol))}</td>
        <td>${escapeHtml(u.fecha_registro ?? "")}</td>
        <td>
          <button class="btn small edit" data-id="${u.id}">Editar</button>
          <button class="btn small danger del" data-id="${u.id}">Eliminar</button>
        </td>`;
      tableBody.appendChild(tr);
    }
  }

  function escapeHtml(s) {
    return (s||"").toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* ------------------------------
     API Calls
  ------------------------------ */
  async function fetchUsuarios() {
    try {
      const res = await fetch(`${API}/list.php`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      usuarios = Array.isArray(data) ? data : [];
      renderTable();
    } catch (err) {
      console.error("fetchUsuarios:", err);
      toast("Error cargando usuarios", "error");
      usuarios = [];
      renderTable();
    }
  }

  async function fetchUsuarioById(id) {
    try {
      const res = await fetch(`${API}/list.php?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      return Array.isArray(data) && data.length ? data[0] : null;
    } catch (err) {
      console.error("fetchUsuarioById:", err);
      toast("Error obteniendo usuario", "error");
      return null;
    }
  }

  async function createUsuario(formData) {
    try {
      // create.php expects rol_input key (observado en tu backend) — incluimos ambas por compatibilidad
      if (formData.has("rol_id")) formData.set("rol_input", formData.get("rol_id"));
      else if (formData.has("rol")) formData.set("rol_input", formData.get("rol"));

      const res = await fetch(`${API}/create.php`, { method: "POST", body: formData });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("createUsuario:", err);
      return { success: false, message: "Error creando usuario" };
    }
  }

  async function updateUsuario(formData) {
    try {
      // ensure both keys present
      if (formData.has("rol")) formData.set("rol_id", formData.get("rol"));
      if (formData.has("rol_id") && !formData.has("rol_input")) formData.set("rol_input", formData.get("rol_id"));

      const res = await fetch(`${API}/update.php`, { method: "POST", body: formData });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("updateUsuario:", err);
      return { success: false, message: "Error actualizando usuario" };
    }
  }

  async function deleteUsuarioApi(id) {
    try {
      const fd = new FormData();
      fd.append("id", id);
      const res = await fetch(`${API}/delete.php`, { method: "POST", body: fd });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("deleteUsuarioApi:", err);
      return { success: false, message: "Error eliminando usuario" };
    }
  }

  /* ------------------------------
     EVENT HANDLERS
  ------------------------------ */

  // Nuevo
  addListener(btnNuevo, "click", (e) => {
    openModal(false, null);
  });

  // Cancel
  addListener(btnCancel, "click", (e) => {
    closeModal();
  });

  // Save (create or update)
  addListener(btnSave, "click", async (e) => {
    const id = inputId.value ? parseInt(inputId.value) : 0;
    const usuario = (inputUser.value || "").trim();
    const email = (inputEmail.value || "").trim();
    const password = inputPassword.value || "";
    const rol = inputRol.value || "2";

    if (!usuario || !email) {
      showMessage("Usuario y email son obligatorios", "error");
      return;
    }

    const fd = new FormData();
    fd.append("usuario", usuario);
    fd.append("email", email);
    fd.append("rol_id", rol);
    fd.append("rol_input", rol); // compat
    if (password) fd.append("password", password);
    if (id) fd.append("id", id);

    // Decide endpoint
    if (id && id > 0) {
      const res = await updateUsuario(fd);
      if (res.success) {
        toast(res.message || "Usuario actualizado");
        closeModal();
        fetchUsuarios();
      } else {
        toast(res.message || "Error actualizando", "error");
      }
    } else {
      const res = await createUsuario(fd);
      if (res.success) {
        toast(res.message || "Usuario creado");
        closeModal();
        fetchUsuarios();
      } else {
        toast(res.message || "Error creando usuario", "error");
      }
    }
  });

  // Search & perpage
  if (searchInput) {
    addListener(searchInput, "input", (e) => {
      search = (e.target.value || "").toLowerCase();
      renderTable();
    });
  }
  if (perpageSelect) {
    addListener(perpageSelect, "change", (e) => {
      perpage = parseInt(e.target.value) || perpage;
      renderTable();
    });
  }

  // Delegación en tabla: edit / delete
  addListener(tableBody, "click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id ? parseInt(btn.dataset.id) : 0;
    if (!id) return;

    if (btn.classList.contains("edit")) {
      // obtener usuario
      const data = await fetchUsuarioById(id);
      if (data) openModal(true, data);
    } else if (btn.classList.contains("del")) {
      const { value } = await Swal.fire({
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33"
      });

      if (!value) return;

      const res = await deleteUsuarioApi(id);
      if (res.success) {
        toast(res.message || "Usuario eliminado");
        fetchUsuarios();
      } else {
        toast(res.message || "Error eliminando usuario", "error");
      }
    }
  });

  /* ------------------------------
     START: cargar lista inicial
  ------------------------------ */
  fetchUsuarios();

  /* ------------------------------
     Guardar referencia cleanup global
     (spa.js llamará midas_unload_usuarios cuando cambies de módulo)
  ------------------------------ */
  window.__midas_usuarios_cleanup = function () {
    try {
      closeModal();
    } catch (e) {}
    removeAllListeners();
    window.__midas_usuarios_flags.initialized = false;
    console.log("midas_unload_usuarios: limpieza realizada");
  };

  // Also expose named unload that spa.js expects
  window.midas_unload_usuarios = function () {
    if (window.__midas_usuarios_cleanup) {
      window.__midas_usuarios_cleanup();
      window.__midas_usuarios_cleanup = null;
    }
  };
};

