<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
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
        ORDER BY s.nombre ASC
    ");

    echo json_encode([
        'success' => true,
        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success'=>false,
        'message'=>$e->getMessage()
    ]);
}

