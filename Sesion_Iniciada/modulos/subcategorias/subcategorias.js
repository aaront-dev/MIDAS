document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.querySelector("#subcategoriasTable tbody");

    const modal = document.getElementById("subcategoriaModal");
    const modalTitle = document.getElementById("modalTitle");

    const inputId = document.getElementById("subcat_id");
    const inputNombre = document.getElementById("nombre_input");
    const inputDescripcion = document.getElementById("descripcion_input");
    const selectCategoria = document.getElementById("categoria_select");

    const btnNuevo = document.getElementById("btnNuevaSubCat");
    const btnGuardar = document.getElementById("btnSaveSubCat");
    const btnCancelar = document.getElementById("btnCancelSubCat");

    /* -------------------- CARGAR CATEGORÍAS -------------------- */
    async function cargarCategorias() {
        const res = await fetch("api/mantenimiento/categorias/list.php");
        const data = await res.json();

        selectCategoria.innerHTML = "";

        data.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option);
        });
    }

    /* -------------------- LISTAR SUBCATEGORÍAS -------------------- */
    async function listarSubcategorias() {
        const res = await fetch("api/mantenimiento/subcategorias/list.php");
        const data = await res.json();

        tableBody.innerHTML = "";

        data.forEach(s => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.categoria_nombre}</td>
                <td>${s.nombre}</td>
                <td>${s.descripcion ?? ""}</td>
                <td>
                    <button class="btn small edit-btn" data-id="${s.id}">Editar</button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        activarBotonesEditar();
    }

    /* -------------------- BOTÓN EDITAR -------------------- */
    function activarBotonesEditar() {
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", async () => {

                const id = btn.dataset.id;

                const res = await fetch(`api/mantenimiento/subcategorias/get.php?id=${id}`);
                const data = await res.json();

                inputId.value = data.id;
                inputNombre.value = data.nombre;
                inputDescripcion.value = data.descripcion;
                selectCategoria.value = data.categoria_id;

                modalTitle.textContent = "Editar Subcategoría";
                abrirModal();
            });
        });
    }

    /* -------------------- GUARDAR -------------------- */
    btnGuardar.addEventListener("click", async () => {

        const formData = new FormData();
        formData.append("id", inputId.value);
        formData.append("nombre", inputNombre.value);
        formData.append("descripcion", inputDescripcion.value);
        formData.append("categoria_id", selectCategoria.value);

        const res = await fetch("api/mantenimiento/subcategorias/save.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.success) {
            Swal.fire("Error", data.message || "Error desconocido", "error");
            return;
        }

        Swal.fire("Correcto", "Subcategoría guardada", "success");

        cerrarModal();
        listarSubcategorias();
    });

    /* -------------------- NUEVA SUBCATEGORÍA -------------------- */
    btnNuevo.addEventListener("click", () => {
        inputId.value = "";
        inputNombre.value = "";
        inputDescripcion.value = "";
        selectCategoria.selectedIndex = 0;

        modalTitle.textContent = "Nueva Subcategoría";
        abrirModal();
    });

    /* -------------------- CANCELAR -------------------- */
    btnCancelar.addEventListener("click", cerrarModal);

    /* -------------------- FUNCIONES MODAL -------------------- */
    function abrirModal() {
        modal.classList.remove("hidden");
        modal.classList.add("show");
    }

    function cerrarModal() {
        modal.classList.add("hidden");
        modal.classList.remove("show");
    }

    /* -------------------- INICIO -------------------- */
    cargarCategorias();
    listarSubcategorias();

});


