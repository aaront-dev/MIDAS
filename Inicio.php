<?php
session_start();
if (isset($_SESSION['usuario_id'])) {
    header("Location: Sesion_Iniciada/Principal.php");
    exit();
}
 $mensaje = ""; 
 if (isset($_GET['error'])) { 
    if ($_GET['error'] == 1) $mensaje = "Datos o contraseña no coinciden.";
  if ($_GET['error'] == 2) $mensaje = "El usuario no existe.";
  
};


?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>MIDAS - Inicio de Sesión</title>
    <link rel="stylesheet" href="assets/css/inicio.css">
</head>

<body>


    <div class="login-container">

        <div class="logo-area">
            <img src="assets/img/logo_midas.png" class="logo">
        </div>

        <h2 class="title">INICIO DE SESIÓN</h2>

<?php if (isset($_GET['logout'])): ?> <p style="color: green; font-weight: bold;">Sesión cerrada correctamente.</p> <?php endif; ?>
 <?php if (isset($_GET['success'])): ?> <p style="color: green; font-weight: bold;">Usuario creado correctamente.</p> <?php endif; ?>


       <form method="POST" action="procesos/login.php">

       <?php if ($mensaje != ""): ?> <p style="color:red; font-weight:bold;"><?= $mensaje ?></p> <?php endif; ?>



<input type="text" name="usuario" class="input-box" placeholder="Usuario" required>
<input type="password" name="password" class="input-box" placeholder="Contraseña" required>

            <button type="submit" class="btn-login">
                Entrar
            </button>

        </form>

        <p class="bottom-text">
            ¿No tienes cuenta?
            <a href="Registro.php">Regístrate aquí</a>


        </p>

    </div>


<script src="assets/js/inicio.js"></script>
<script src="assets/js/alert.js"></script>
</body>
</html>
