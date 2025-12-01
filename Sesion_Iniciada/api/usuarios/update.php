<?php
// Sesion_Iniciada/api/usuarios/update.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $id = intval($_POST['id'] ?? 0);

    // Normalización para evitar errores por espacios o mayúsculas
    $usuario = trim(strtolower($_POST['usuario'] ?? ''));
    $email   = trim(strtolower($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? null;
    $rol_id  = intval($_POST['rol_id'] ?? 2);

    if ($id <= 0 || $usuario === '' || $email === '') {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }

    $db = new DataBase();

    // Validación de duplicados (excluyendo el propio registro)
    $q = $db->ejecutar(
        "SELECT id FROM users 
        WHERE (usuario = :u OR email = :e) 
        AND id <> :id
        LIMIT 1",
        [
            ':u' => $usuario,
            ':e' => $email,
            ':id' => $id
        ]
    );

    $existe = $q->fetch(PDO::FETCH_ASSOC);

    if ($existe) {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario o correo ya registrado por otro usuario'
        ]);
        exit;
    }

    // Si cambia la contraseña → actualizar con hash
    if (!empty($password)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $db->ejecutar(
            "UPDATE users 
             SET usuario = :u, email = :e, password = :p, rol_id = :r 
             WHERE id = :id",
            [
                ':u' => $usuario,
                ':e' => $email,
                ':p' => $hash,
                ':r' => $rol_id,
                ':id' => $id
            ]
        );
    } else {
        // Si NO cambia contraseña → actualizar sin tocarla
        $db->ejecutar(
            "UPDATE users 
             SET usuario = :u, email = :e, rol_id = :r 
             WHERE id = :id",
            [
                ':u' => $usuario,
                ':e' => $email,
                ':r' => $rol_id,
                ':id' => $id
            ]
        );
    }

    echo json_encode(['success' => true, 'message' => 'Usuario actualizado']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

