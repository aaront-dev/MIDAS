<div class="productos-module">

    <!-- HEADER -->
    <div class="module-header">
        <span class="module-icon">📦</span>
        <h2 class="module-title">Productos</h2>
    </div>

    <!-- BOTÓN NUEVO -->
    <button id="btnNuevoProducto" class="btn primary new-btn">
        ➕ Nuevo Producto
    </button>

    <!-- TABLA -->
    <div class="table-wrapper">
        <table id="productosTable" class="midas-table">
          <thead>
             <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Fecha creación</th>
                <th>Acciones</th>
            </tr>
        </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- MODAL MIDAS -->
<!-- ================================
     MODAL PRO – BLACK & GOLD MIDAS
================================ -->

<div id="productoModal" class="midas-modal hidden fade">
    <div class="midas-modal-content">

        <h3 id="modalTitle" class="modal-title">Nuevo Producto</h3>

        <div class="modal-body">

            <input type="hidden" id="producto_id">

            <!-- NOMBRE -->
            <div class="field">
                <label>Nombre del producto</label>
                <input type="text" id="nombre_input" class="m-input" placeholder="Ej: Zapatos deportivos">
            </div>

            <!-- DESCRIPCIÓN -->
            <div class="field">
                <label>Descripción</label>
                <textarea id="descripcion_input" class="m-input" rows="3"
                          placeholder="Detalles del producto"></textarea>
            </div>

            <!-- GRID PRECIOS Y STOCK -->
            <div class="grid-2">

                <div class="field">
                    <label>Precio</label>
                    <input type="number" id="precio_input" class="m-input" placeholder="0.00">
                </div>

                <div class="field">
                    <label>Stock inicial</label>
                    <input type="number" id="stock_input" class="m-input" placeholder="0">
                </div>

            </div>

            <!-- GRID CATEGORÍA / SUBCATEGORÍA -->
            <div class="grid-2">

                <div class="field">
                    <label>Categoría</label>
                    <select id="categoria_input" class="m-input select">
                        <option value="">Seleccione...</option>
                    </select>
                </div>

                <div class="field">
                    <label>Subcategoría</label>
                    <select id="subcategoria_input" class="m-input select">
                        <option value="">Seleccione una categoría primero</option>
                    </select>
                </div>

            </div>

        </div>

        <!-- ACCIONES -->
        <div class="modal-actions">
            <button id="btnCancelProducto" class="btn secondary">Cancelar</button>
            <button id="btnSaveProducto" class="btn primary">Guardar</button>
        </div>

    </div>
</div>


</div>


