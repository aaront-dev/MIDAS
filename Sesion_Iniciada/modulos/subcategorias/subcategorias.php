<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<div class="subcategorias-module">

    <h1 class="module-title">Subcategorías</h1>

    <div class="module-actions">
        <button id="btnNuevaSubCat" class="new-btn">+ Nueva Subcategoría</button>
    </div>

    <div class="table-wrapper">
        <table class="midas-table" id="subcategoriasTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Categoría</th>
                    <th>Subcategoría</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- MODAL PRO -->
    <div id="subcategoriaModal" class="midas-modal hidden fade">
        <div class="midas-modal-content">

            <h3 id="modalTitle" class="modal-title">Nueva Subcategoría</h3>

            <div class="modal-body">

                <input type="hidden" id="subcat_id">

                <div class="field">
                    <label>Nombre de subcategoría</label>
                    <input type="text" id="nombre_input" class="m-input">
                </div>

                <div class="field">
                    <label>Categoría</label>
                    <select id="categoria_select" class="m-input select"></select>
                </div>

                <div class="field">
                    <label>Descripción (opcional)</label>
                    <textarea id="descripcion_input" class="m-input" rows="3"></textarea>
                </div>

            </div>

            <div class="modal-actions">
                <button id="btnCancelSubCat" class="btn secondary">Cancelar</button>
                <button id="btnSaveSubCat" class="btn primary">Guardar</button>
            </div>

        </div>
    </div>

</div>



