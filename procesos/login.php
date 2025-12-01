<?php
session_start();
require_once("../DataBase.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $usuario = trim($_POST["usuario"]);
    $password = trim($_POST["password"]);

    $db = new DataBase();

    // Buscar usuario
    $resultado = $db->ejecutar(
        "SELECT id, usuario, password, rol_id FROM users WHERE usuario = ? LIMIT 1",
        [$usuario]
    );

    $data = $resultado->fetch(PDO::FETCH_ASSOC);

    // Usuario no existe
    if (!$data) {
        header("Location: ../Inicio.php?error=1");
        exit();
    }

    // Contraseña incorrecta
    if (!password_verify($password, $data["password"])) {
        header("Location: ../Inicio.php?error=1");
        exit();
    }

    // LOGIN EXITOSO
    $_SESSION["usuario_id"] = $data["id"];
    $_SESSION["usuario"] = $data["usuario"];
    $_SESSION["rol_id"] = $data["rol_id"];

    header("Location: ../Sesion_Iniciada/Principal.php");
    exit();
}
?>


