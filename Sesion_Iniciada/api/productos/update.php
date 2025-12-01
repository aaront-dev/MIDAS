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
    $nombre = trim($_POST['nombre'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $precio = floatval($_POST['precio'] ?? 0);
    $stock = intval($_POST['stock'] ?? 0);
    $categoria_id = intval($_POST['categoria_id'] ?? null);
    $subcategoria_id = intval($_POST['subcategoria_id'] ?? null);

    if ($id <= 0 || $nombre === '' || $precio <= 0) {
        echo json_encode(['success'=>false,'message'=>'Datos incompletos']);
        exit;
    }

    $db = new DataBase();

    $db->ejecutar("
        UPDATE productos
        SET nombre = :n,
            descripcion = :d,
            precio = :p,
            stock = :s,
            categoria_id = :c,
            subcategoria_id = :sc
        WHERE id = :id
    ", [
        ':n'  => $nombre,
        ':d'  => $descripcion,
        ':p'  => $precio,
        ':s'  => $stock,
        ':c'  => $categoria_id == 0 ? null : $categoria_id,
        ':sc' => $subcategoria_id == 0 ? null : $subcategoria_id,
        ':id' => $id
    ]);

    echo json_encode(['success'=>true,'message'=>'Producto actualizado']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}

