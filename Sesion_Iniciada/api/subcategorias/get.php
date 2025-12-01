<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {

    if (!isset($_GET['id'])) {
        echo json_encode([]);
        exit;
    }

    $id = intval($_GET['id']);
    if ($id <= 0) {
        echo json_encode([]);
        exit;
    }

    $db = new DataBase();

    $stmt = $db->ejecutar("
        SELECT 
            s.id, 
            s.nombre, 
            s.categoria_id,
            c.nombre AS categoria_nombre,
            s.fecha_creacion
        FROM subcategorias s
        INNER JOIN categorias c ON c.id = s.categoria_id
        WHERE s.id = ?
        LIMIT 1
    ", [$id]);

    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}



