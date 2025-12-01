<?php 
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    $db = new DataBase();

    /* ============================================================
       CASO 1 — OBTENER UNA CATEGORÍA POR ID (con subcategorías)
    ============================================================ */
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if ($id <= 0) {
            echo json_encode(null);
            exit;
        }

        // Categoría
        $stmt = $db->ejecutar(
            "SELECT id, nombre 
             FROM categorias 
             WHERE id = ? LIMIT 1",
            [$id]
        );
        $cat = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$cat) {
            echo json_encode(null);
            exit;
        }

        // Subcategorías
        $stmt2 = $db->ejecutar(
            "SELECT id, nombre 
             FROM subcategorias 
             WHERE categoria_id = ? 
             ORDER BY nombre ASC",
            [$id]
        );

        $cat['subcategorias'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($cat);
        exit;
    }

    /* ============================================================
       CASO 2 — LISTAR TODAS LAS CATEGORÍAS
    ============================================================ */
    $stmt = $db->ejecutar(
        "SELECT id, nombre 
         FROM categorias 
         ORDER BY nombre ASC"
    );

    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Subcategorías agrupadas
    $stmtSubs = $db->ejecutar(
        "SELECT id, categoria_id, nombre 
         FROM subcategorias
         ORDER BY nombre ASC"
    );

    $subcats = $stmtSubs->fetchAll(PDO::FETCH_ASSOC);

    $map = [];
    foreach ($subcats as $s) {
        $map[$s['categoria_id']][] = [
            'id' => $s['id'],
            'nombre' => $s['nombre']
        ];
    }

    foreach ($categorias as &$c) {
        $cid = $c['id'];
        $c['subcategorias'] = $map[$cid] ?? [];
    }

    echo json_encode($categorias);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(null);
}


