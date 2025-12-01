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
    $categoria_id = intval($_POST['categoria_id'] ?? 0);
    $nombre = trim($_POST['nombre'] ?? '');

    if ($id <= 0 || $categoria_id <= 0 || $nombre === '') {
        echo json_encode(['success'=>false,'message'=>'Datos incompletos']);
        exit;
    }

    $db = new DataBase();

    // Validación de duplicados
    $q = $db->ejecutar("
        SELECT id FROM subcategorias
        WHERE categoria_id = ?
        AND LOWER(nombre) = LOWER(?)
        AND id <> ?
        LIMIT 1
    ", [$categoria_id, $nombre, $id]);

    if ($q->rowCount() > 0) {
        echo json_encode(['success'=>false,'message'=>'Otra subcategoría ya tiene ese nombre']);
        exit;
    }

    // UPDATE correcto
    $db->ejecutar("
        UPDATE subcategorias
        SET categoria_id = ?, nombre = ?
        WHERE id = ?
    ", [$categoria_id, $nombre, $id]);

    echo json_encode(['success' => true, 'message' => 'Subcategoría actualizada']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}

