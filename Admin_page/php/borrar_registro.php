<?php
header('Content-Type: application/json');

require_once '../config/conexion.php';

$response = ['success' => false, 'error' => null];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tabla = $_POST['tabla'] ?? '';
    $id = $_POST['id'] ?? null; // El ID del registro a borrar

    if (empty($tabla) || $id === null) {
        $response['error'] = 'Tabla y ID son requeridos.';
        echo json_encode($response);
        exit;
    }

    // Validar tabla para evitar inyección SQL
    $allowedTables = ['registro_operacion', 'flujos', 'registro_riegos'];
    if (!in_array($tabla, $allowedTables)) {
        $response['error'] = 'Tabla no permitida.';
        echo json_encode($response);
        exit;
    }

    // Identificar el nombre de la clave primaria para cada tabla
    $primaryKeys = [
        'registro_operacion' => 'id_registro',
        'flujos' => 'id_flujo',
        'registro_riegos' => 'id_riego'
    ];

    if (!isset($primaryKeys[$tabla])) {
        $response['error'] = 'Clave primaria no definida para esta tabla.';
        echo json_encode($response);
        exit;
    }
    $primaryKeyName = $primaryKeys[$tabla];

    $sql = "DELETE FROM `" . $tabla . "` WHERE `" . $primaryKeyName . "` = ?";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        $response['error'] = 'Error al preparar la consulta: ' . $conn->error;
        echo json_encode($response);
        exit;
    }

    $stmt->bind_param("i", (int)$id); // El ID suele ser un entero

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $response['success'] = true;
        } else {
            $response['error'] = 'No se encontró el registro con el ID proporcionado o no hubo cambios.';
        }
    } else {
        $response['error'] = 'Error al ejecutar la consulta: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();

} else {
    $response['error'] = 'Método de solicitud no permitido.';
}

echo json_encode($response);
?>