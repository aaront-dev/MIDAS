

<div class="categorias-module">

    <h1 class="module-title">Categorías</h1>

    <div class="module-actions">
        <button id="btnNuevaCategoria" class="new-btn">+ Nueva Categoría</button>
    </div>

    <div class="table-wrapper">
        <table class="midas-table" id="categoriasTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Categorias</th>
                    <th>Sub-categorías</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- MODAL PRO -->
    <div id="categoriaModal" class="midas-modal hidden fade">
        <div class="midas-modal-content">

            <h2 id="modalTitle" class="modal-title">Nueva Categoría</h2>

            <div class="modal-body">

                <input type="hidden" id="categoria_id">

                <div class="field">
                    <label for="nombre_input">Nombre de categoría</label>
                    <input type="text" id="nombre_input" class="m-input" placeholder="Nombre de categoría">
                </div>

                <!-- SUBCATEGORÍAS -->
                <div class="field">
                    <label>Subcategorías</label>

                    <div id="subcats_list">
                        <!-- Render dinámico -->
                    </div>

                    <div class="grid-2" style="align-items:center;">
                        <input id="new_subcat_input" class="m-input" placeholder="Nueva subcategoría">
                        <button id="btnAddSubcat" class="btn primary">Agregar</button>
                    </div>

                    <small id="subcat_hint" style="color:#777; margin-top:6px;">
                        Guarda la categoría primero para agregar subcategorías.
                    </small>
                </div>


            </div>

            <div class="modal-actions">
                <button id="btnCancelCategoria" class="btn secondary">Cancelar</button>
                <button id="btnSaveCategoria" class="btn primary">Guardar categoría</button>
                <button id="btnVolverCategoria" class="hidden btn btn-warning" type="button">Volver</button>
                <button id="btnFinalizar" class="btn btn-success hidden">Finalizar</button>

                

            </div>

        </div>
    </div>


</div>



