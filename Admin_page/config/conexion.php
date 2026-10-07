<?php

$servername = "localhost"; // Servidor (en este caso, local)
$username = "root";       // Usuario de la base de datos
$password = "";           // Contraseña del usuario 
$database = "ptar_data";   // Nombre de la base de datos
$port = "3312";           // Puerto de MySQL

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

?>