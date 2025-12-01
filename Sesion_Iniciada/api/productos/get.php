<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if (!isset($_GET['id'])) {
        echo json_encode([]);
        exit;
    }

    $id = intval($_GET['id']);
    $db = new DataBase();

    $stmt = $db->ejecutar("
        SELECT id, nombre, descripcion, precio, stock, categoria_id
        FROM productos 
        WHERE id = ? LIMIT 1
    ", [$id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($row ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
