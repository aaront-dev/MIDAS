
<div class="usuarios-module">


    <!-- ======================================
         ENCABEZADO DEL MÓDULO
    ======================================= -->
    
    <h2 class="module-title">Gestión de Usuarios</h2>
    <div class="module-header">
        
        <span class="module-icon">👤</span>
        <button id="btnNuevoUsuario" class="new-btn">+ Nuevo Usuario</button>
    </div>
    

    <!-- ======================================
         TOOLS (Search, PerPage, Nuevo Usuario)
    ======================================= -->
    <div class="usuarios-tools">

        <input type="text" name="search" class="search" placeholder="Buscar usuario...">

        <select class="perpage" mame="perpage" id="perpage">
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
        </select>

        
    </div>

    <!-- Área de mensajes -->
    <div id="usuarios-messages"></div>

    <!-- ======================================
         TABLA DE USUARIOS
    ======================================= -->
    
    <div class="table-wrapper">
        <table id="usuariosTable" class="midas-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Registro</th>
                    <th style="width:150px;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- JS insertará filas aquí -->
            </tbody>
        </table>
    </div>



    <!-- =====================================================
         MODAL USUARIO (BLACK & GOLD - PRO)
    ======================================================= -->
    <div id="usuarioModal" class="midas-modal hidden fade">

        <div class="midas-modal-content">

            <h3 id="modalTitle" class="modal-title">Nuevo Usuario</h3>

            <div class="modal-body">

                <!-- ID HIDDEN -->
                <input type="hidden" id="usuario_id">

                <!-- Usuario -->
                <div class="field">
                    <label for="username_input">Usuario</label>
                    <input type="text" id="username_input" class="m-input" placeholder="Usuario">
                </div>

                <!-- Nombre Completo -->
                <div class="field">
                    <label for="nombre_input">Nombre completo</label>
                    <input type="text" id="nombre_input" class="m-input" placeholder="Nombre">
                </div>

                <!-- Correo -->
                <div class="field">
                    <label for="email_input">Correo electrónico</label>
                    <input type="email" id="email_input" class="m-input" placeholder="correo@correo.com">
                </div>

                <!-- Teléfono -->
                <div class="field">
                    <label for="telefono_input">Teléfono</label>
                    <input type="text" id="telefono_input" class="m-input">
                </div>

                <!-- GRID: Rol + Estado -->
                <div class="grid-2">

                    <div class="field">
                        <label for="rol_input">Rol</label>
                        <select id="rol_input" class="m-input select">
                            <option value="1">Administrador</option>
                            <option value="2">Vendedor</option>
                            <option value="3">Gestor de Inventario</option>
                            <option value="4">Auditor</option>
                        </select>
                    </div>

                    <div class="field">
                        <label for="estado_input">Estado</label>
                        <select id="estado_input" class="m-input select">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>

                </div>

                <!-- Contraseña -->
                <div class="field">
                    <label for="clave_input">Contraseña</label>
                    <input type="password" id="clave_input" class="m-input" placeholder="••••••••">
                </div>

            </div>

            <div class="modal-actions">
                <button id="btnCancelUsuario" class="btn secondary">Cancelar</button>
                <button id="btnSaveUsuario" class="btn primary">Guardar</button>
            </div>

        </div>
    </div>

</div>









