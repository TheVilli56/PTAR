<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$response = [];
$sql = "SELECT id_usuario, nombre_usuario FROM usuario ORDER BY nombre_usuario";
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