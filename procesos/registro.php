<?php
require_once "../DataBase.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $usuario   = trim($_POST["usuario"] ?? "");
    $email     = trim($_POST["email"] ?? "");
    $password  = trim($_POST["password"] ?? "");
    $confirmar = trim($_POST["confirmar"] ?? "");

    // Validar campos vacíos
    if ($usuario === "" || $email === "" || $password === "" || $confirmar === "") {
        header("Location: ../Registro.php?msg=Debes+completar+todos+los+campos&tipo=danger");
        exit();
    }

    // Validar contraseñas iguales
    if ($password !== $confirmar) {
        header("Location: ../Registro.php?msg=Las+contraseñas+no+coinciden&tipo=danger");
        exit();
    }

    $db = new DataBase();

    // Verificar usuario existente
    $query = $db->ejecutar(
        "SELECT id FROM users WHERE usuario = :usuario LIMIT 1",
        [":usuario" => $usuario]
    );

    if ($query->rowCount() > 0) {
        header("Location: ../Registro.php?msg=El+usuario+ya+existe&tipo=danger");
        exit();
    }

    // Verificar email existente
    $query = $db->ejecutar(
        "SELECT id FROM users WHERE email = :email LIMIT 1",
        [":email" => $email]
    );

    if ($query->rowCount() > 0) {
        header("Location: ../Registro.php?msg=El+correo+ya+está+registrado&tipo=danger");
        exit();
    }

    // Crear hash de contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertar usuario (rol_id = 2 por defecto)
    $insert = $db->ejecutar(
        "INSERT INTO users (usuario, email, password, rol_id)
         VALUES (:usuario, :email, :password, 2)",
        [
            ":usuario"  => $usuario,
            ":email"    => $email,
            ":password" => $password_hash
        ]
    );

    if ($insert) {
        header("Location: ../Inicio.php?success=1");
        exit();
    } else {
        header("Location: ../Registro.php?msg=Ocurrió+un+error+inesperado&tipo=danger");
        exit();
    }
}
?>



