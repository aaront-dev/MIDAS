<?php
// Sesion_Iniciada/Principal.php
session_start();

// Control de acceso
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../Inicio.php?error=1");
    exit();
}

$usuario_nombre = $_SESSION['usuario'] ?? 'Usuario';
$rol_id = $_SESSION['rol_id'] ?? 0;
 // <- usar 'rol' (coincide con login.php)
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>MIDAS - Principal</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" href="../assets/css/global.css">
    <link rel="stylesheet" href="../assets/css/principal.css">

    <!-- SweetAlert2 (confirmaciones bonitas) -->
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Toastify (toasts) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
<script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>


</head>

<body>

<!-- ===========================================
     APP WRAPPER
=========================================== -->
<div class="app">

    <!-- ===========================================
         SIDEBAR
    =========================================== -->
    <div class="sidebar">
        <div class="sidebar-header">
            <img src="../assets/img/logo_midas.png" class="logo" alt="MIDAS">
            <span class="logo-text">MIDAS</span>
            
        </div>

<!-- MENU -->
<div class="menu">
    <div class="menu-group">
        <button class="menu-item" data-module="home" data-title="Inicio">🏠 Inicio</button>
    </div>

    <!-- TIENDA -->
    <div class="menu-group">
        <button class="menu-item has-children" data-toggle="store" data-title="Tienda">🛒 Tienda ▾</button>

        <div class="submenu" data-parent="store">
            <button class="sub-item" data-module="productos" data-title="Productos">Productos</button>
            <button class="sub-item" data-module="categorias" data-title="Categorias">Categorias</button>
            <button class="sub-item" data-module="ordenes" data-title="Órdenes de Compra">Órdenes de Compra</button>
            <button class="sub-item" data-module="devoluciones" data-title="Devoluciones">Devoluciones</button>
        </div>
    </div>

    <!-- ALMACÉN -->
    <div class="menu-group">
        <button class="menu-item has-children" data-toggle="almacen" data-title="Almacén">📦 Almacén ▾</button>

        <div class="submenu" data-parent="almacen">
            <button class="sub-item" data-module="ingresos" data-title="Ingreso">Ingreso</button>
            <button class="sub-item" data-module="despacho" data-title="Despacho">Despacho</button>
            <button class="sub-item" data-module="inventario" data-title="Inventario">Inventario</button>
        </div>
    </div>

    <!-- VENTAS -->
    <div class="menu-group">
        <button class="menu-item" data-module="ventas" data-title="Ventas">💰 Ventas</button>
    </div>

    <!-- USUARIOS (solo admin) -->
    <?php if ($rol_id == 1): ?>
    <div class="menu-group admin-only">
        <button class="menu-item" data-module="usuarios" data-title="Usuarios">👤 Usuarios</button>
    </div>
    <?php endif; ?>
</div>

        <!-- FOOTER -->
        <div class="sidebar-footer">
            <div class="user-info">
                <span class="user-name"><?= htmlspecialchars($usuario_nombre) ?></span>
               <span class="user-role">
    <?= $rol_id == 1 ? "Administrador" : ($rol_id == 2 ? "Vendedor" : ($rol_id == 3 ? "Gestor inventario" : "Auditor")) ?>
</span>


            </div>

            <a href="../Cerrar_Sesion.php" class="logout-btn">Cerrar sesión</a>
        </div>
    </div>
    <button class="toggle-btn">☰</button>



    <!-- ===========================================
         MAIN CONTENT
    =========================================== -->
    <div class="main" id="main">
        <h1 class="main-title">Bienvenido a MIDAS</h1>
        <p class="main-subtitle">Selecciona un módulo del menú</p>

        <div id="module-container"></div>

    </div>

</div>

<!-- SCRIPTS -->
<script src="../assets/js/principal.js"></script>
<script src="../assets/js/spa.js"></script>
</body>
</html>