<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
        exit;
    }

    $nombre = trim($_POST['nombre'] ?? '');

    if ($nombre === '') {
        echo json_encode([
            'success' => false,
            'message' => 'El nombre es obligatorio'
        ]);
        exit;
    }

    $db = new DataBase();

    // Duplicado
    $q = $db->ejecutar(
        "SELECT id FROM categorias WHERE LOWER(nombre) = LOWER(?) LIMIT 1",
        [$nombre]
    );

    if ($q->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'La categoría ya existe'
        ]);
        exit;
    }

    // Insert
    $db->ejecutar(
        "INSERT INTO categorias (nombre) VALUES (?)",
        [$nombre]
    );

    $idNuevo = $db->conexion->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Categoría creada',
        'id' => $idNuevo
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}

