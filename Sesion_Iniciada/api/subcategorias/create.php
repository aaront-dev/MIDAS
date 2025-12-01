<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success'=>false,'message'=>'Método no permitido']);
        exit;
    }

    $categoria_id = intval($_POST['categoria_id'] ?? 0);
    $nombre = trim($_POST['nombre'] ?? '');

    if ($categoria_id <= 0 || $nombre === '') {
        echo json_encode(['success'=>false,'message'=>'Datos incompletos']);
        exit;
    }

    $db = new DataBase();

    // Validación de duplicados
    $q = $db->ejecutar("
        SELECT id FROM subcategorias
        WHERE categoria_id = ?
        AND LOWER(nombre) = LOWER(?)
        LIMIT 1
    ", [$categoria_id, $nombre]);

    if ($q->rowCount() > 0) {
        echo json_encode(['success'=>false,'message'=>'Ya existe una subcategoría con ese nombre']);
        exit;
    }

    // Insert sin descripcion
    $db->ejecutar("
        INSERT INTO subcategorias (categoria_id, nombre, fecha_creacion)
        VALUES (?, ?, NOW())
    ", [$categoria_id, $nombre]);

    echo json_encode(['success'=>true,'message'=>'Subcategoría creada']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}



