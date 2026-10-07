<?php
header('Content-Type: application/json');

// Incluye el archivo de conexión a la base de datos. 
// Ahora esperamos que este archivo cree la variable $conn con el objeto MySQLi.
require_once '../config/conexion.php'; 

$response = [];
$datos = [];

try {
    // 1. Verificar la conexión MySQLi ($conn)
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Error de conexión: La variable \$conn no está definida o la conexión MySQLi falló.");
    }
    
    // 2. Obtener y validar parámetros
    $idZona = isset($_GET['id_zona']) ? $_GET['id_zona'] : 'todos';
    $mesInicio = isset($_GET['mes_inicio']) ? (int)$_GET['mes_inicio'] : 1;
    $anioInicio = isset($_GET['anio_inicio']) ? (int)$_GET['anio_inicio'] : date('Y');
    $mesFin = isset($_GET['mes_fin']) ? (int)$_GET['mes_fin'] : date('m');
    $anioFin = isset($_GET['anio_fin']) ? (int)$_GET['anio_fin'] : date('Y');
    
    // 3. Construir las fechas de inicio y fin del rango
    $fechaInicioStr = sprintf('%d-%02d-01 00:00:00', $anioInicio, $mesInicio);
    
    $ultimoDiaMesFin = date('t', strtotime(sprintf('%d-%02d-01', $anioFin, $mesFin)));
    $fechaFinStr = sprintf('%d-%02d-%02d 23:59:59', $anioFin, $mesFin, $ultimoDiaMesFin);


    // 4. Preparar la consulta SQL (usando ? como placeholders)
    $sql = "
        SELECT 
            YEAR(fecha) AS anio,
            MONTH(fecha) AS mes,
            SUM(volumen_usado) AS volumen_total
        FROM 
            registro_operacion
        WHERE 
            fecha BETWEEN ? AND ?
    ";
    
    // Agregar el filtro por zona si no es 'todos'
    $bindTypes = 'ss'; // Inicializar con 'ss' para los dos strings de fecha
    $bindParams = [&$fechaInicioStr, &$fechaFinStr];
    
    if ($idZona !== 'todos' && is_numeric($idZona)) {
        $sql .= " AND id_zona = ?";
        $bindTypes .= 'i'; // Agregar 'i' para el entero de id_zona
        // El idZona debe ser un entero para bind_param, por eso se usa (int)$idZona
        $idZonaInt = (int)$idZona;
        $bindParams[] = &$idZonaInt; 
    }

    // Agrupar y ordenar para el histograma
    $sql .= " 
        GROUP BY 
            anio, mes
        ORDER BY 
            anio ASC, mes ASC
    ";

    // 5. Preparar y vincular parámetros
    // Utilizamos consultas preparadas para mayor seguridad
    if ($stmt = $conn->prepare($sql)) {
        
        // Agregar el tipo de dato como primer argumento de bind_param
        array_unshift($bindParams, $bindTypes);
        
        // Llamar a bind_param dinámicamente
        call_user_func_array([$stmt, 'bind_param'], $bindParams);
        
        // 6. Ejecutar
        $stmt->execute();
        
        // 7. Obtener resultados
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
        
        $stmt->close();
        
        // 8. Enviar respuesta
        $response = $datos;

    } else {
        // Error en la preparación de la consulta
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

} catch (Exception $e) {
    // Captura errores generales (incluido el error de conexión)
    $response = ['error' => 'Error en el servidor: ' . $e->getMessage()];
} finally {
    // Cerramos la conexión MySQLi si existe
    if (isset($conn)) {
        $conn->close();
    }
}

echo json_encode($response);
?>