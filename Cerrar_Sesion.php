<?php
// Cerrar_Sesion.php
session_start();

// Limpiar array de sesión
$_SESSION = [];

// Eliminar cookie de sesión
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destruir sesión completamente
session_destroy();

// Evitar que el navegador almacene páginas con sesión
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Redirigir correctamente al login
header("Location: Inicio.php?logout=1");
exit;

