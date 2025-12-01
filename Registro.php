<?php
if (isset($_SESSION['user_id']) && $_SESSION["rol"] !== "admin") {
    // Si es usuario normal logueado → no puede entrar a registro
    header("Location: Sesion_Iniciada/Principal.php");
    exit();
}


$mensaje = "";
$tipo = ""; // success, danger, warning

if (isset($_GET["msg"]) && isset($_GET["tipo"])) {
    $mensaje = $_GET["msg"];
    $tipo = $_GET["tipo"];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>MIDAS - Registro de Usuario</title>
    <link rel="stylesheet" href="assets/css/registro.css">
    <link rel="stylesheet" href="assets/css/alert.css"><!-- ESTILO DE ALERTAS -->
</head>

<body>

    <div class="register-container">

        <div class="logo-area">
            <img src="assets/img/logo_midas.png" class="logo">
        </div>

        <h2 class="title">REGISTRO DE USUARIO</h2>

        <!-- ALERTA DINÁMICA ANIMADA -->
        <?php if (!empty($mensaje)): ?>
            <div class="alert <?= $tipo ?>">
                <?= htmlspecialchars($mensaje) ?>
            </div>
        <?php endif; ?>

        <form id="formRegistro" action="procesos/registro.php" method="POST" autocomplete="off">

            <input type="text" name="usuario" class="input-box" placeholder="Usuario" required>

            <input type="email" name="email" class="input-box" placeholder="Correo electrónico" required>

            <input type="password" id="password" name="password" class="input-box" placeholder="Contraseña" required>

            <input type="password" id="confirmar" name="confirmar" class="input-box" placeholder="Confirmar contraseña" required>

            <p id="msgPass" class="msg-pass"></p>

            <button type="submit" class="btn-register">
                Crear Cuenta
            </button>

        </form>

        <p class="bottom-text">
            ¿Ya tienes cuenta?
            <a href="Inicio.php">Inicia sesión aquí</a>
        </p>

    </div>

<!-- VALIDACIÓN VISUAL SIN alert() -->
<script>
const form = document.getElementById("formRegistro");
const pass1 = document.getElementById("password");
const pass2 = document.getElementById("confirmar");
const msg = document.getElementById("msgPass");

// Validación en tiempo real
function validarLive() {
    if (pass2.value.length === 0) {
        msg.textContent = "";
        msg.className = "msg-pass";
        return;
    }

    if (pass1.value !== pass2.value) {
        msg.textContent = "Las contraseñas no coinciden.";
        msg.className = "msg-pass error show";
    } else {
        msg.textContent = "Contraseñas coinciden.";
        msg.className = "msg-pass success show";
    }
}

pass1.addEventListener("input", validarLive);
pass2.addEventListener("input", validarLive);

// Validación al enviar formulario
form.addEventListener("submit", function(e) {
    if (pass1.value !== pass2.value) {
        e.preventDefault();
        window.location.href = 
            "Registro.php?msg=Las+contraseñas+no+coinciden&tipo=danger";
    }
});
</script>

<script src="assets/js/alert.js"></script>

</body>
</html>







