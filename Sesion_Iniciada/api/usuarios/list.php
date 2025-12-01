<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../../DataBase.php';

try {
    $db = new DataBase();

    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);

        $stmt = $db->ejecutar("
            SELECT u.id, u.usuario, u.email, u.rol_id, r.nombre AS rol, u.fecha_registro
            FROM users u
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.id = :id
            LIMIT 1
        ", [':id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($row ? [$row] : []);
        exit;
    }

    $stmt = $db->ejecutar("
        SELECT u.id, u.usuario, u.email, u.rol_id, r.nombre AS rol, u.fecha_registro
        FROM users u
        LEFT JOIN roles r ON u.rol_id = r.id
        ORDER BY u.id DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}


