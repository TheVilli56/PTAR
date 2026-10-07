<?php
// php_admin/obtener_datos_grafica_sst.php

header('Content-Type: application/json');
require '../config/conexion.php'; // Asegúrate de que esta ruta es correcta para tu archivo de conexión

// 1. Obtener y sanear los parámetros de entrada
$tabla = isset($_GET['tabla']) ? $conn->real_escape_string($_GET['tabla']) : '';
$parametro = isset($_GET['parametro']) ? $conn->real_escape_string($_GET['parametro']) : '';
$fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
$fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

$response = [];

// 2. Validación de parámetros
$tablasPermitidas = ['csc', 'tec01', 'rec01', 'rac'];
// Mapeo de parámetros para evitar inyecciones SQL
$parametrosPermitidos = [
    'csc' => ['ddq', 'ph', 't'],
    'tec01' => ['nivel', 'ph', 'dqo', 't'],
    'rec01' => ['ssed', 'od', 'ph', 't'],
    'rac' => ['ddq', 'ph', 't'],
];

if (!in_array($tabla, $tablasPermitidas) || 
    !isset($parametrosPermitidos[$tabla]) || 
    !in_array($parametro, $parametrosPermitidos[$tabla])) {
    $response['error'] = 'Parámetro o tabla inválida.';
    echo json_encode($response);
    $conn->close();
    exit();
}

if (empty($fecha_inicio) || empty($fecha_fin)) {
    $response['error'] = 'Las fechas de inicio y fin son obligatorias.';
    echo json_encode($response);
    $conn->close();
    exit();
}

// 3. Construcción de la consulta SQL
// Agrupamos por fecha y calculamos el promedio del parámetro para esa fecha.
$sql = "
    SELECT 
        DATE(fecha) AS fecha, 
        AVG($parametro) AS valor 
    FROM 
        $tabla 
    WHERE 
        fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'
    GROUP BY 
        DATE(fecha)
    ORDER BY 
        fecha ASC
";

$result = $conn->query($sql);

if ($result === false) {
    $response['error'] = 'Error al ejecutar la consulta: ' . $conn->error;
} else {
    $datos = [];
    while ($row = $result->fetch_assoc()) {
        // Formateamos el valor para asegurar que sea numérico
        $row['valor'] = floatval($row['valor']);
        $datos[] = $row;
    }
    $response = $datos;
}

// 4. Cerrar conexión y devolver JSON
$conn->close();
echo json_encode($response);

?>