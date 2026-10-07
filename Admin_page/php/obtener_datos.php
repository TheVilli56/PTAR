<?php
header('Content-Type: application/json');

// Incluir la configuración de conexión a la base de datos
require_once '../config/conexion.php';

$tabla = $_POST['tabla'] ?? '';
$mes = $_POST['mes'] ?? '';
$anio = $_POST['anio'] ?? '';
$pagina = $_POST['pagina'] ?? 1;
$limit = $_POST['limit'] ?? 10; 
$offset = ($pagina - 1) * $limit;

$response = array('error' => null, 'totalRecords' => 0, 'datos' => array());

// Validar que la tabla sea una de las permitidas
$allowedTables = ['registro_operacion', 'flujos', 'registro_riegos', 'csc', 'rac', 'rec01', 'tec01'];
if (!in_array($tabla, $allowedTables)) {
    $response['error'] = 'Tabla no permitida.';
    echo json_encode($response);
    exit;
}

// Inicializar SELECT, JOINs y ORDER BY
$selectFields = "`" . $tabla . "`.*";
$joinClauses = "";
$orderByClause = ""; 
$hasUsuarioJoin = false; // Bandera para saber si se necesita JOIN a usuario

// --- LÓGICA DE JOINS UNIFICADA ---

if ($tabla === 'registro_operacion' || $tabla === 'registro_riegos' || $tabla === 'flujos') {
    // Estas tablas SÍ tienen campos para hacer JOIN (id_responsable o id_usuario)
    $hasUsuarioJoin = true;

    if ($tabla === 'registro_operacion' || $tabla === 'registro_riegos') {
        // Riego tiene JOINs a Usuario y Zona_riego
        $selectFields .= ", `usuario`.`nombre_usuario` AS `responsable_nombre`, `zona_riego`.`nombre_zona` AS `zona_nombre`";
        $joinClauses .= " LEFT JOIN `usuario` ON `" . $tabla . "`.`id_responsable` = `usuario`.`id_usuario`";
        $joinClauses .= " LEFT JOIN `zona_riego` ON `" . $tabla . "`.`id_zona` = `zona_riego`.`id_zona`";
        $orderByClause = " ORDER BY `" . $tabla . "`.`fecha` DESC, `" . $tabla . "`.`hora_inicio` DESC";
    } else { // Asumimos que flujos solo tiene fecha/hora y usuario
        $selectFields .= ", `usuario`.`nombre_usuario` AS `responsable_nombre`";
        $joinClauses .= " LEFT JOIN `usuario` ON `" . $tabla . "`.`id_usuario` = `usuario`.`id_usuario`";
        $orderByClause = " ORDER BY `" . $tabla . "`.`fecha` DESC, `" . $tabla . "`.`hora` DESC";
    }

} else {
    // Si es una de las tablas de muestreo (csc, rac, rec01, tec01)
    // NO tienen campo de usuario, por lo tanto, NO hay JOIN a 'usuario'.
    $orderByClause = " ORDER BY `" . $tabla . "`.`fecha` DESC, `" . $tabla . "`.`hora` DESC";
}


$whereClauses = array();
$bindTypes = "";
$bindParams = [];

// Filtrar por mes y año (asumiendo que todas las tablas tienen un campo 'fecha')
if (!empty($mes)) {
    $whereClauses[] = "MONTH(fecha) = ?";
    $bindTypes .= "i"; // Integer
    $bindParams[] = (int)$mes;
}
if (!empty($anio)) {
    $whereClauses[] = "YEAR(fecha) = ?";
    $bindTypes .= "i"; // Integer
    $bindParams[] = (int)$anio;
}

// Unir las cláusulas WHERE en una sola cadena
$where_sql = !empty($whereClauses) ? " WHERE " . implode(" AND ", $whereClauses) : "";

// Paso 1: Obtener el total de registros (para la paginación)
$sqlCount = "SELECT COUNT(*) AS total FROM `" . $tabla . "`" . $joinClauses . $where_sql;
$stmtCount = $conn->prepare($sqlCount);

if ($stmtCount === false) {
    $response['error'] = 'Error al preparar la consulta de conteo: ' . $conn->error;
    echo json_encode($response);
    exit;
}

if (!empty($bindParams)) {
    $stmtCount->bind_param($bindTypes, ...$bindParams);
}
$stmtCount->execute();
$resultCount = $stmtCount->get_result();
$rowCount = $resultCount->fetch_assoc();
$response['totalRecords'] = $rowCount['total'];
$stmtCount->close();


// Paso 2: Obtener los datos de la página actual
$sqlData = "SELECT " . $selectFields . " FROM `" . $tabla . "`" . $joinClauses . $where_sql . $orderByClause . " LIMIT ? OFFSET ?";
$stmtData = $conn->prepare($sqlData);

if ($stmtData === false) {
    $response['error'] = 'Error al preparar la consulta de datos: ' . $conn->error;
    echo json_encode($response);
    exit;
}

$bindTypesData = $bindTypes . "ii";
$bindParamsData = array_merge($bindParams, [(int)$limit, (int)$offset]);
$stmtData->bind_param($bindTypesData, ...$bindParamsData);

$stmtData->execute();
$resultData = $stmtData->get_result();

if ($resultData->num_rows > 0) {
    while ($row = $resultData->fetch_assoc()) {
        $response['datos'][] = $row;
    }
}
$stmtData->close();
$conn->close();
echo json_encode($response);
?>