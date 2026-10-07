<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$response = array('error' => null, 'columns' => []);
$allowedTables = ['registro_operacion', 'flujos', 'sst']; 

$tabla = $_POST['tabla'] ?? '';

if (!in_array($tabla, $allowedTables)) {
    echo json_encode(['error' => 'Tabla no permitida.']);
    exit;
}
if (isset($_POST['tabla'])) {
    $tabla = $_POST['tabla'];
    $sql = "SHOW COLUMNS FROM " . mysqli_real_escape_string($conn, $tabla);
    $result = $conn->query($sql);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $response['columns'][] = $row;
        }
        $result->free();
    } else {
        $response['error'] = 'Error al obtener las columnas de la tabla: ' . $conn->error;
    }
} else {
    $response['error'] = 'Nombre de tabla no proporcionado.';
}

$conn->close();
echo json_encode($response);
?>