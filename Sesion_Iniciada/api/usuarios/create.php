<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $usuario  = trim($_POST['usuario'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $rol_id   = intval($_POST['rol_input'] ?? 2); // ← FIX REAL

    if ($usuario === '' || $email === '') {
        echo json_encode(['success' => false, 'message' => 'Usuario y email son obligatorios']);
        exit;
    }

    if ($password === '') {
        echo json_encode(['success' => false, 'message' => 'La contraseña es obligatoria']);
        exit;
    }

    $db = new DataBase();

    // Validación duplicados (usuario o email)
    $q = $db->ejecutar(
        "SELECT id FROM users WHERE usuario = :u OR email = :e LIMIT 1",
        [':u' => $usuario, ':e' => $email]
    );

    if ($q->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['success' => false, 'message' => 'El usuario o correo ya está registrado']);
        exit;
    }

    // Crear usuario
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $db->ejecutar(
        "INSERT INTO users (usuario, email, password, rol_id) 
         VALUES (:u, :e, :p, :r)",
        [
            ':u' => $usuario,
            ':e' => $email,
            ':p' => $hash,
            ':r' => $rol_id
        ]
    );

    echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente']);
} 
catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}


