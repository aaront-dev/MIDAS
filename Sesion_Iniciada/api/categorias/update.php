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

    $id = intval($_POST['id'] ?? 0);
    $nombre = trim($_POST['nombre'] ?? '');

    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID inválido'
        ]);
        exit;
    }

    if ($nombre === '') {
        echo json_encode([
            'success' => false,
            'message' => 'El nombre es obligatorio'
        ]);
        exit;
    }

    $db = new DataBase();

    // Duplicado
    $stmt = $db->ejecutar(
        "SELECT id 
         FROM categorias 
         WHERE LOWER(nombre) = LOWER(?) AND id <> ?
         LIMIT 1",
        [$nombre, $id]
    );

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Ya existe otra categoría con ese nombre'
        ]);
        exit;
    }

    // Update
    $db->ejecutar(
        "UPDATE categorias SET nombre = ? WHERE id = ?",
        [$nombre, $id]
    );

    echo json_encode([
        'success' => true,
        'message' => 'Categoría actualizada correctamente'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}



