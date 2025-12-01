<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if (!isset($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'ID no especificado'
        ]);
        exit;
    }

    $id = intval($_GET['id']);
    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID inválido'
        ]);
        exit;
    }

    $db = new DataBase();

    $stmt = $db->ejecutar(
        "SELECT id, nombre 
         FROM categorias 
         WHERE id = ? LIMIT 1",
        [$id]
    );

    $row = $stmt->fetch();

echo json_encode($cat);


} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}
