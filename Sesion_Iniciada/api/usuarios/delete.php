<?php
// Sesion_Iniciada/api/usuarios/delete.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $id = intval($_POST['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'ID inválido']);
        exit;
    }

    $db = new DataBase();

    // Verificar que el usuario exista
    $check = $db->ejecutar("SELECT id FROM users WHERE id = :id LIMIT 1", [
        ':id' => $id
    ]);

    if ($check->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'El usuario no existe']);
        exit;
    }

    // Intentar eliminar
    try {
        $db->ejecutar("DELETE FROM users WHERE id = :id", [
            ':id' => $id
        ]);
    } catch (PDOException $e) {
        // Error por integridad (usuario usado en otras tablas)
        if ($e->getCode() === '23000') {
            echo json_encode([
                'success' => false,
                'message' => 'No se puede eliminar el usuario porque está relacionado con otros registros'
            ]);
            exit;
        }
        throw $e;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Usuario eliminado correctamente'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}

