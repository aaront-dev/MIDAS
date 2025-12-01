<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
        exit;
    }

    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'ID inválido'
        ]);
        exit;
    }

    $db = new DataBase();

    // Productos usando categoría
    $qProd = $db->ejecutar(
        "SELECT id FROM productos WHERE categoria_id = ? LIMIT 1",
        [$id]
    );
    if ($qProd->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'No se puede eliminar: hay productos usando esta categoría'
        ]);
        exit;
    }

    // Subcategorías asociadas
    $qSub = $db->ejecutar(
        "SELECT id FROM subcategorias WHERE categoria_id = ? LIMIT 1",
        [$id]
    );
    if ($qSub->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'No se puede eliminar: la categoría tiene subcategorías asociadas'
        ]);
        exit;
    }

    // Eliminar
    $db->ejecutar("DELETE FROM categorias WHERE id = ?", [$id]);

    echo json_encode([
        'success' => true,
        'message' => 'Categoría eliminada correctamente'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error'   => $e->getMessage()
    ]);
}
