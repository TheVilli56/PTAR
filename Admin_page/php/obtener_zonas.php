<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$response = [];
$sql = "SELECT id_zona, nombre_zona FROM zona_riego ORDER BY nombre_zona";
$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    $result->free();
}

$conn->close();
echo json_encode($response);
?>