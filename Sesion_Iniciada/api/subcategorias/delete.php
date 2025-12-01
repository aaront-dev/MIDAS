<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success'=>false,'message'=>'Método no permitido']);
        exit;
    }

    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success'=>false,'message'=>'ID inválido']);
        exit;
    }

    $db = new DataBase();

    // validar relación productos
    $has = $db->ejecutar("
        SELECT id FROM productos
        WHERE subcategoria_id = ?
        LIMIT 1
    ", [$id]);

    if ($has->rowCount() > 0) {
        echo json_encode(['success'=>false,'message'=>'No se puede eliminar: tiene productos asociados']);
        exit;
    }

    $db->ejecutar("DELETE FROM subcategorias WHERE id = ?", [$id]);

    echo json_encode(['success' => true, 'message' => 'Subcategoría eliminada']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}



