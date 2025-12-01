<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    $db = new DataBase();

    $stmt = $db->ejecutar("
        SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock,
               p.categoria_id, c.nombre AS categoria,
               p.subcategoria_id, s.nombre AS subcategoria,
               p.fecha_creacion
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
        ORDER BY p.id DESC
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}


