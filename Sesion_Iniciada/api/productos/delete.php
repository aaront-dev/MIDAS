<?php
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
    $db->ejecutar("DELETE FROM productos WHERE id = ?", [$id]);

    echo json_encode(['success' => true, 'message' => 'Producto eliminado']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
