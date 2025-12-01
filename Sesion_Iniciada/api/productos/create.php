<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $nombre = trim($_POST['nombre'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $precio = floatval($_POST['precio'] ?? 0);
    $stock = intval($_POST['stock'] ?? 0);
    $categoria_id = intval($_POST['categoria_id'] ?? null);
    $subcategoria_id = intval($_POST['subcategoria_id'] ?? null);

    if ($nombre === '' || $precio <= 0) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }

    $db = new DataBase();

    $db->ejecutar("
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, subcategoria_id)
        VALUES (:n, :d, :p, :s, :c, :sc)
    ", [
        ':n'  => $nombre,
        ':d'  => $descripcion,
        ':p'  => $precio,
        ':s'  => $stock,
        ':c'  => $categoria_id == 0 ? null : $categoria_id,
        ':sc' => $subcategoria_id == 0 ? null : $subcategoria_id
    ]);

    echo json_encode(['success' => true, 'message' => 'Producto creado']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}


